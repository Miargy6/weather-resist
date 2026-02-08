
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchWeather = async (lat, lon) => {
    try {
        const response = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        return await response.json();
    } catch (error) {
        console.error('Weather Fetch Error:', error);
        throw error;
    }
};

export const getWeatherDescription = (code) => {
    // WMO Weather interpretation codes (WW)
    const codes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Drizzle: Light',
        53: 'Drizzle: Moderate',
        55: 'Drizzle: Dense intensity',
        61: 'Rain: Slight',
        63: 'Rain: Moderate',
        65: 'Rain: Heavy intensity',
        71: 'Snow fall: Slight',
        73: 'Snow fall: Moderate',
        75: 'Snow fall: Heavy intensity',
        95: 'Thunderstorm: Slight or moderate',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return codes[code] || 'Unknown';
};

export const fetchHistoricalWeather = async (lat, lon, date) => {
    // date format: YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&hourly=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch historical data');
        return await response.json();
    } catch (error) {
        console.error('Historical Fetch Error:', error);
        return null;
    }
};
