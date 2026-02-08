import React from 'react';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import { useWeather } from './hooks/useWeather';
import HistoryList from './components/HistoryList';
import { saveWeatherLog } from './services/historyService';
import { useAutoLogger } from './hooks/useAutoLogger';

function App() {
  const { weather, loading, error, location } = useWeather();
  const [locationName, setLocationName] = React.useState('Detecting Location...');
  const [refreshHistory, setRefreshHistory] = React.useState(0);

  // Activate automated logging
  useAutoLogger(weather, locationName, location);

  const handleSaveWeather = async () => {
    if (weather) {
      try {
        await saveWeatherLog(weather, locationName);
        setRefreshHistory(prev => prev + 1);
        alert("Weather saved!");
      } catch (err) {
        alert("Failed to save weather (check console for details/config).");
      }
    }
  };

  React.useEffect(() => {
    if (location.lat && location.lon) {
      // Simple approximation or reverse geocoding could go here.
      // For now, we'll just format the coordinates nicely or say "My Location"
      if (location.lat === -25.9692 && location.lon === 32.5732) {
        setLocationName('Maputo (Default)');
      } else {
        setLocationName('My Location');
      }
    }
  }, [location, error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <Header />

      <main className="container mx-auto px-4 py-8 flex flex-col items-center gap-12">
        <section className="w-full flex flex-col items-center gap-6 pt-8">
          <WeatherCard
            weather={weather}
            loading={loading}
            error={error}
            locationName={locationName}
          />

          <button
            onClick={handleSaveWeather}
            disabled={!weather || loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save to History
          </button>
        </section>

        {/* History Section */}
        <section className="w-full flex justify-center pb-12">
          <HistoryList refreshTrigger={refreshHistory} />
        </section>
      </main>
    </div>
  );
}

export default App;
