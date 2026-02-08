import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, where } from 'firebase/firestore';

const COLLECTION_NAME = 'weather_logs';

export const saveWeatherLog = async (weatherData, locationName) => {
    try {
        if (!weatherData || !weatherData.current) return;

        const { temperature_2m, weather_code, wind_speed_10m, relative_humidity_2m } = weatherData.current;

        await addDoc(collection(db, COLLECTION_NAME), {
            temperature: temperature_2m,
            conditionCode: weather_code,
            windSpeed: wind_speed_10m,
            humidity: relative_humidity_2m,
            location: locationName,
            timestamp: Timestamp.now(),
        });
        console.log('Weather log saved');
    } catch (error) {
        console.error('Error saving weather log:', error);
        throw error;
    }
};

export const fetchHistory = async (selectedDate = null) => {
    try {
        let q;

        if (selectedDate) {
            const startStr = selectedDate.toISOString().split('T')[0];
            const start = new Date(startStr);
            start.setHours(0, 0, 0, 0);

            const end = new Date(startStr);
            end.setHours(23, 59, 59, 999);

            q = query(
                collection(db, COLLECTION_NAME),
                where('timestamp', '>=', Timestamp.fromDate(start)),
                where('timestamp', '<=', Timestamp.fromDate(end)),
                orderBy('timestamp', 'desc')
            );
        } else {
            q = query(
                collection(db, COLLECTION_NAME),
                orderBy('timestamp', 'desc'),
                limit(10)
            );
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching history:', error);
        // Return empty array on error (e.g. if permissions failed or config missing)
        return [];
    }
};

export const getLastLogTimestamp = async () => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('timestamp', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            return snapshot.docs[0].data().timestamp;
        }
        return null;
    } catch (error) {
        console.error('Error fetching last log:', error);
        return null; // Return null on error to avoid infinite loops
    }
};

export const saveWeatherLogBatch = async (logs) => {
    try {
        const batchPromises = logs.map(log => {
            return addDoc(collection(db, COLLECTION_NAME), {
                temperature: log.temperature,
                conditionCode: log.conditionCode,
                windSpeed: log.windSpeed,
                humidity: log.humidity,
                location: log.location,
                timestamp: Timestamp.fromDate(log.date)
            });
        });

        await Promise.all(batchPromises);
        console.log(`Batch saved ${logs.length} logs`);
    } catch (error) {
        console.error('Error batch saving logs:', error);
        throw error;
    }
};
