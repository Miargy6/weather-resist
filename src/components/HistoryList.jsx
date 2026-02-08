import React, { useEffect, useState } from 'react';
import { fetchHistory } from '../services/historyService';
import { getWeatherDescription } from '../services/weatherService';

const HistoryList = ({ refreshTrigger }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoading(true);
                // If date is selected, pass date object, otherwise null (recent history)
                const dateObj = selectedDate ? new Date(selectedDate) : null;
                const data = await fetchHistory(dateObj);
                setHistory(data);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [selectedDate, refreshTrigger]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    if (loading) {
        return <div className="text-slate-400 animate-pulse text-center p-8">Loading history...</div>;
    }

    if (history.length === 0) {
        return <div className="text-slate-500 italic text-center p-8">No history recorded yet.</div>;
    }

    return (
        <div className="w-full max-w-2xl bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-2">
                <h3 className="text-xl font-semibold text-slate-200">
                    {selectedDate ? `History for ${selectedDate}` : 'Recent History'}
                </h3>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="bg-slate-700 text-slate-200 px-3 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="space-y-4">
                {history.map((record) => (
                    <div key={record.id} className="flex justify-between items-center bg-slate-700/30 p-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/20 text-blue-300 p-3 rounded-full font-bold min-w-[3.5rem] text-center text-lg">
                                {Math.round(record.temperature)}°
                            </div>
                            <div className="flex flex-col text-left gap-1">
                                <span className="font-medium text-slate-200 text-lg">{getWeatherDescription(record.conditionCode)}</span>
                                <span className="text-xs text-slate-400">
                                    {record.timestamp ? new Date(record.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right text-sm text-slate-400 flex flex-col items-end gap-1">
                            <div className="font-medium text-slate-300">{record.location}</div>
                            <div className="text-xs bg-slate-800/80 px-2 py-1 rounded">Hum: {record.humidity}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;
