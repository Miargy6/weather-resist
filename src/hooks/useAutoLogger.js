import { useEffect, useRef } from 'react';
import { saveWeatherLog, getLastLogTimestamp, saveWeatherLogBatch } from '../services/historyService';
import { fetchWeather, fetchHistoricalWeather } from '../services/weatherService';

const LOG_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CHECK_INTERVAL_MS = 60 * 1000; // Check every minute

export const useAutoLogger = (currentWeather, locationName, location) => {
    const lastLogTimeRef = useRef(null);

    useEffect(() => {
        const initLogger = async () => {
            // 1. Get last log time
            const lastTimestamp = await getLastLogTimestamp();
            let lastTime = lastTimestamp ? lastTimestamp.toDate().getTime() : 0;

            // If no logs, assume we start from now (or could backfill if needed, but let's start fresh for new users)
            // Actually, if lastTime is 0, we should probably log immediately.

            const now = Date.now();

            // 2. Backfill Logic
            if (lastTime > 0) {
                const missedIntervals = [];
                let nextScheduledTime = lastTime + LOG_INTERVAL_MS;

                while (nextScheduledTime < now) {
                    missedIntervals.push(nextScheduledTime);
                    nextScheduledTime += LOG_INTERVAL_MS;
                }

                if (missedIntervals.length > 0) {
                    console.log(`Found ${missedIntervals.length} missed intervals. Backfilling...`);

                    const backfillLogs = [];

                    for (const time of missedIntervals) {
                        const dateObj = new Date(time);
                        // We use Maputo coordinates for backfill as per requirement (or current location if available, but Maputo is default)
                        // Using the passed location which defaults to Maputo
                        const lat = location.lat;
                        const lon = location.lon;

                        if (lat && lon) {
                            const historicalData = await fetchHistoricalWeather(lat, lon, dateObj);

                            if (historicalData && historicalData.hourly) {
                                // Open-Meteo returns hourly arrays. Find the index for our specific hour.
                                const hourIndex = dateObj.getHours();

                                // Simple validation: check if data exists at index
                                if (historicalData.hourly.temperature_2m[hourIndex] !== undefined) {
                                    backfillLogs.push({
                                        temperature: historicalData.hourly.temperature_2m[hourIndex],
                                        conditionCode: historicalData.hourly.weather_code[hourIndex],
                                        windSpeed: historicalData.hourly.wind_speed_10m[hourIndex],
                                        humidity: historicalData.hourly.relative_humidity_2m[hourIndex],
                                        location: locationName,
                                        date: dateObj
                                    });
                                }
                            }
                        }
                    }

                    if (backfillLogs.length > 0) {
                        await saveWeatherLogBatch(backfillLogs);
                        lastTime = missedIntervals[missedIntervals.length - 1]; // Update lastTime to the most recent backfilled time
                        alert(`Backfilled ${backfillLogs.length} missed weather logs!`);
                    }
                }
            }

            lastLogTimeRef.current = lastTime;
        };

        initLogger();

        // 3. Active Logger Interval
        const intervalId = setInterval(async () => {
            const now = Date.now();
            // If last log was (now - interval) ago, log again
            if (lastLogTimeRef.current && (now - lastLogTimeRef.current) >= LOG_INTERVAL_MS) {
                if (currentWeather && locationName) {
                    console.log("Auto-logging weather...");
                    await saveWeatherLog(currentWeather, locationName);
                    lastLogTimeRef.current = now;
                }
            } else if (!lastLogTimeRef.current && currentWeather) {
                // First log ever (if initLogger found nothing or failed)
                console.log("Initial auto-log...");
                await saveWeatherLog(currentWeather, locationName);
                lastLogTimeRef.current = now;
            }
        }, CHECK_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [locationName, location.lat, location.lon]); // We depend on location to be ready
};
