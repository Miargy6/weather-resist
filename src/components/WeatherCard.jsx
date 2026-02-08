import React from 'react';
import { getWeatherDescription } from '../services/weatherService';

const WeatherCard = ({ weather, loading, error, locationName }) => {
    if (loading) {
        return (
            <div className="bg-slate-800 rounded-3xl p-8 shadow-xl w-full max-w-md animate-pulse">
                <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
                <div className="h-24 bg-slate-700 rounded mb-4"></div>
                <div className="h-6 bg-slate-700 rounded w-3/4"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-500/50 rounded-3xl p-8 text-center max-w-md w-full">
                <p className="text-red-200">Error: {error}</p>
            </div>
        );
    }

    if (!weather || !weather.current) {
        return null;
    }

    const { temperature_2m, weather_code, wind_speed_10m, relative_humidity_2m } = weather.current;
    const description = getWeatherDescription(weather_code);
    const isDay = weather.current.is_day !== 0; // Open-Meteo returns 1 for day, 0 for night

    return (
        <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl w-full max-w-md text-white transition-all hover:scale-[1.02] duration-300
      ${isDay ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-slate-700 to-slate-900'}
    `}>
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-2xl font-light tracking-wide mb-1">Current Weather</h2>
                <p className="text-sm text-blue-100 mb-6">{locationName || "Current Location"}</p>

                <div className="text-8xl font-bold mb-4 tracking-tighter">
                    {Math.round(temperature_2m)}°
                </div>

                <div className="text-2xl font-medium mb-8 capitalize px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                    {description}
                </div>

                <div className="grid grid-cols-2 gap-8 w-full border-t border-white/10 pt-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-200 uppercase tracking-wider">Wind</span>
                        <span className="text-xl font-semibold">{wind_speed_10m} km/h</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-200 uppercase tracking-wider">Humidity</span>
                        <span className="text-xl font-semibold">{relative_humidity_2m}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
