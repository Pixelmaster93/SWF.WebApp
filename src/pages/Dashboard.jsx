import React, { useState } from 'react';
import { ChevronDown, Home, Crown, Trophy } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { poopService } from '../services/poop.service';

const Dashboard = ({ currentUser, currentGroup, groups, onChangeGroup, groupLeaderboard }) => {
    const [anim, setAnim] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const poopMutation = useMutation({
        mutationFn: poopService.createPoop,
        onSuccess: () => {
            // Invalidate relevant queries to update score
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['groupLeaderboard'] });
        }
    });

    const handlePoop = () => {
        if (navigator.vibrate) navigator.vibrate(200);
        setAnim(true);
        poopMutation.mutate({}); // Send empty body if DTO allows, or add defaults
        setTimeout(() => setAnim(false), 2000);
    };

    const getLeaderStyle = (uid) => {
        // Logic to highlight leaders (simplified for now as we might not have full leader info yet)
        // We can implement this fully when we have the leaderboard data structure defined
        return 'border-l-4 border-amber-400 bg-white';
    };

    const getLeaderIcon = (uid) => {
        return null; // Implement later
    };

    if (!currentGroup) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Nessun Gruppo Selezionato</h2>
                    <p className="text-gray-500 mb-4">Unisciti a un gruppo per iniziare!</p>
                    <button onClick={() => onChangeGroup('hub')} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold">Gestisci Gruppi</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto pb-20 bg-gray-50">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-1 font-bold text-lg text-amber-900 active:opacity-50">
                        {currentGroup.name} <ChevronDown size={16} />
                    </button>
                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 border border-gray-100 overflow-hidden">
                                <div className="p-2 text-xs text-gray-400 uppercase font-bold">Cambia Gruppo</div>
                                {groups.map(g => (
                                    <button key={g.id} onClick={() => { onChangeGroup(g.id); setIsMenuOpen(false) }} className={`w-full text-left p-3 text-sm font-bold ${g.id === currentGroup.id ? 'bg-amber-50 text-amber-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                                        {g.name}
                                    </button>
                                ))}
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button onClick={() => onChangeGroup('hub')} className="w-full text-left p-3 text-sm font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                                        <Home size={14} /> Gestisci Gruppi
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="bg-amber-100 px-3 py-1 rounded-full text-amber-800 font-mono text-sm font-bold">
                    {currentUser.poopScore} pt
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
                <button
                    onClick={handlePoop}
                    disabled={poopMutation.isPending}
                    className={`w-48 h-48 rounded-full border-8 border-amber-200 bg-gradient-to-b from-amber-400 to-amber-600 shadow-2xl flex flex-col items-center justify-center transform transition-all active:scale-90 ${anim ? 'animate-pulse' : ''}`}
                >
                    <span className="text-6xl mb-2">{currentUser.emoji}</span>
                    <span className="text-white font-bold text-lg uppercase">PUSH</span>
                </button>
                <p className="mt-4 text-gray-400 text-sm italic text-center">I tuoi punti valgono<br />in tutti i gruppi!</p>
            </div>

            <div className="px-4">
                <h3 className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-wide">Classifica Recente</h3>
                <div className="space-y-3">
                    {groupLeaderboard?.map((entry, idx) => (
                        <div key={idx} className={`p-3 rounded-xl shadow-sm flex items-center gap-3 transition-all ${getLeaderStyle(entry.userId)}`}>
                            <div className="relative">
                                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-xl border border-gray-200">{entry.emoji}</div>
                                <div className="absolute -top-2 -right-2">{getLeaderIcon(entry.userId)}</div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <span className="font-bold">{entry.userName}</span>
                                </p>
                                <p className="text-xs opacity-80">{entry.score} PT</p>
                            </div>
                        </div>
                    ))}
                    {(!groupLeaderboard || groupLeaderboard.length === 0) && <div className="text-center text-gray-400 text-sm py-4">Silenzio in questo gruppo...</div>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
