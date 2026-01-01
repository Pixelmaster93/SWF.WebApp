import React, { useState } from 'react';
import { LogOut, User, Calendar, Search, X, Lock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { poopService } from '../services/poop.service';
import { userService } from '../services/user.service';
import { gamificationService } from '../services/gamification.service';
import { getAvatarUrl } from '../utils/avatarHelper';

const SettingsView = ({ onLogout, currentUser }) => {
    const queryClient = useQueryClient();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [selectedAvatarCode, setSelectedAvatarCode] = useState(null);

    const openAvatarModal = () => {
        setSelectedAvatarCode(currentUser?.avatarCode || 'DEFAULT_1');
        setIsAvatarModalOpen(true);
    };

    // ... (existing code)

    return (
        <div className="flex flex-col h-full bg-gray-50 p-4 overflow-y-auto">
            {/* ... */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    <img
                        src={getAvatarUrl(currentUser?.avatarCode)}
                        alt="Current Avatar"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/avatars/POOP_1.png'; }}
                    />
                    <button
                        onClick={openAvatarModal}
                        className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full shadow-md hover:bg-amber-600 transition-colors"
                    >
                        <User size={16} />
                    </button>
                </div>
                {/* ... */}
            </div>

            {/* ... (rest of UI) ... */}

            {/* Avatar Selector Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col p-4 shadow-2xl relative">
                        <button
                            onClick={() => setIsAvatarModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Scegli Avatar</h2>
                        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 p-2">
                            {/* Default Avatar */}
                            <button
                                onClick={() => setSelectedAvatarCode('DEFAULT_1')}
                                className={`p-2 rounded-xl border-2 flex flex-col items-center gap-2 ${selectedAvatarCode === 'DEFAULT_1' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-100'}`}
                            >
                                <img src="/avatars/POOP_1.png" className="w-12 h-12" />
                            </button>

                            {achievements?.filter(a => a.isUnlocked).map(ach => (
                                <button
                                    key={ach.code}
                                    type="button"
                                    onClick={() => setSelectedAvatarCode(ach.code)}
                                    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95 ${selectedAvatarCode === ach.code ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-100 hover:bg-gray-50'}`}
                                >
                                    <img
                                        src={getAvatarUrl(ach.code)}
                                        alt={ach.name}
                                        className="w-12 h-12 object-contain"
                                    />
                                </button>
                            ))}
                            {(!achievements || achievements.every(a => !a.isUnlocked)) && (
                                <div className="col-span-3 text-center text-gray-400 text-sm py-4">
                                    Sblocca achievement per ottenere nuovi avatar!
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => updateAvatarMutation.mutate(selectedAvatarCode)}
                                disabled={updateAvatarMutation.isPending || selectedAvatarCode === currentUser.avatarCode}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${updateAvatarMutation.isPending || selectedAvatarCode === currentUser.avatarCode
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
                                    }`}
                            >
                                {updateAvatarMutation.isPending ? 'Salvataggio...' : 'Conferma Avatar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    // Fetch achievements to populate selector
    const { data: achievements } = useQuery({
        queryKey: ['achievements'],
        queryFn: gamificationService.getAchievements,
        enabled: isAvatarModalOpen // Only fetch when modal opens
    });

    const updateAvatarMutation = useMutation({
        mutationFn: async (newAvatarCode) => {
            // Include name to satisfy potential validation
            const payload = {
                name: currentUser.name,
                avatarCode: newAvatarCode || 'DEFAULT_1' // Ensure we don't send null if backend dislikes it
            };
            return await userService.updateUser(currentUser.id, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setIsAvatarModalOpen(false);
            alert("Avatar aggiornato!");
        },
        onError: (err) => {
            console.error("Failed to update avatar", err);
            alert("Errore durante l'aggiornamento dell'avatar: " + (err.response?.data?.title || err.message));
        }
    });

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

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    <img
                        src={getAvatarUrl(currentUser?.avatarCode)}
                        alt="Current Avatar"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/avatars/POOP_1.png'; }}
                    />
                    <button
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full shadow-md hover:bg-amber-600 transition-colors"
                    >
                        <User size={16} />
                    </button>
                </div>
                <h2 className="mt-2 font-bold text-lg text-gray-800">{currentUser?.name || 'Utente'}</h2>
            </div>

            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                        onClick={goToProfile}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <User size={20} />
                            <span className="font-medium">Gestisci Profilo Keycloak</span>
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
                                            <div className="text-lg text-amber-600">💩</div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-700">Sganciata!</span>
                                                <span className="text-xs text-gray-400">{new Date(poop.dateTime).toLocaleString()}</span>
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

            {/* Avatar Selector Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col p-4 shadow-2xl relative">
                        <button
                            onClick={() => setIsAvatarModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Scegli Avatar</h2>
                        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 p-2">
                            {/* Default Avatar */}
                            <button
                                onClick={() => updateAvatarMutation.mutate(null)}
                                className={`p-2 rounded-xl border-2 flex flex-col items-center gap-2 ${!currentUser.avatarCode ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}
                            >
                                <img src="/avatars/POOP_1.png" className="w-12 h-12" />
                            </button>

                            {achievements?.filter(a => a.isUnlocked).map(ach => (
                                <button
                                    key={ach.code}
                                    type="button"
                                    disabled={updateAvatarMutation.isPending}
                                    onClick={() => {
                                        console.log("Selecting avatar:", ach.code);
                                        updateAvatarMutation.mutate(ach.code);
                                    }}
                                    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95 ${currentUser.avatarCode === ach.code ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:bg-gray-50'} ${updateAvatarMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <img
                                        src={getAvatarUrl(ach.code)}
                                        alt={ach.name}
                                        className="w-12 h-12 object-contain"
                                    />
                                </button>
                            ))}
                            {(!achievements || achievements.every(a => !a.isUnlocked)) && (
                                <div className="col-span-3 text-center text-gray-400 text-sm py-4">
                                    Sblocca achievement per ottenere nuovi avatar!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsView;
