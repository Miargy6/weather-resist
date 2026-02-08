import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (err) => {
                    setError('Location access denied. Using default location (Maputo).');
                    // Default to Maputo if permission denied
                    setLocation({ lat: -25.9692, lon: 32.5732 });
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setLocation({ lat: -25.9692, lon: 32.5732 });
        }
    }, []);

    useEffect(() => {
        if (location.lat && location.lon) {
            const loadWeather = async () => {
                try {
                    setLoading(true);
                    setError(null); // Clear any previous errors (e.g. geolocation denial)
                    const data = await fetchWeather(location.lat, location.lon);
                    setWeather(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            loadWeather();
        }
    }, [location]);

    return { weather, loading, error, location };
};
