import React, { useState } from 'react';
import { LogOut, User, Calendar, Search } from 'lucide-react';
import { poopService } from '../services/poop.service';

const SettingsView = ({ onLogout, currentUser }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const goToProfile = () => {
        const keycloakBaseUrl = "https://auth.dinonerd.it";
        const realm = "shitwithfriends";
        const clientId = "shitwithfriends-frontend";

        const currentUrl = window.location.origin;
        const accountUrl = `${keycloakBaseUrl}/realms/${realm}/account?referrer=${clientId}&referrer_uri=${encodeURIComponent(currentUrl)}`;

        window.location.href = accountUrl;
    };

    const fetchHistory = async () => {
        if (!currentUser?.id) return;
        if (!startDate || !endDate) {
            alert("Seleziona entrambe le date");
            return;
        }

        setLoadingHistory(true);
        try {
            // Ensure dates are ISO strings or compatible with API
            // API likely expects filtered query params. poopService.filterPoops(userId, from, to)
            const res = await poopService.filterPoops(currentUser.id, new Date(startDate).toISOString(), new Date(endDate).toISOString());
            setHistory(res || []);
            setHasSearched(true);
        } catch (error) {
            console.error("Failed to fetch history", error);
            alert("Errore nel recupero della cronologia");
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-4 overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-4">Impostazioni</h1>

            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                        onClick={goToProfile}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <User size={20} />
                            <span className="font-medium">Gestisci Profilo</span>
                        </div>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors text-red-600"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={20} />
                            <span className="font-medium">Esci</span>
                        </div>
                    </button>
                </div>

                {/* Cronologia Cacche */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-amber-600" />
                        Cronologia Cacche
                    </h2>

                    <div className="flex flex-col gap-3 mb-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">Dal</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="p-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">Al</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="p-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                        <button
                            onClick={fetchHistory}
                            disabled={loadingHistory}
                            className="bg-amber-100 text-amber-800 font-bold py-2 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            {loadingHistory ? 'Caricamento...' : <><Search size={18} /> Cerca</>}
                        </button>
                    </div>

                    {/* Results List */}
                    {hasSearched && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {history.length > 0 ? (
                                history.map((poop, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="text-lg">{currentUser?.emoji || '💩'}</div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-700">Sganciata!</span>
                                                <span className="text-xs text-gray-400">{new Date(poop.date).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4 text-sm">
                                    Nessuna attività trovata in questo periodo.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 py-4">
                Version 1.0.0
            </div>
        </div>
    );
};

export default SettingsView;
