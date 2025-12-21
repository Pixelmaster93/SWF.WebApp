import React, { useState } from 'react';
import { Crown, EyeOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { groupService } from '../services/group.service';

const Leaderboard = ({ timeFrame, currentGroup, currentUser }) => {
    const [monthMode, setMonthMode] = useState('previous'); // 'previous' or 'current'

    // Fetch leaderboard data
    // If timeFrame is 'month', we might need to handle 'current' vs 'previous'
    // For now, assuming API handles 'month' as current month. 
    // If we want previous month, we might need an API param.
    // The prototype logic for "current month" was "Secret Leaderboard" (hidden).

    const { data: leaderboard } = useQuery({
        queryKey: ['leaderboard', currentGroup?.id, timeFrame, monthMode],
        queryFn: () => groupService.getGroupLeaderboard(currentGroup?.id, timeFrame), // API needs to support mode if needed
        enabled: !!currentGroup,
    });

    // Prototype logic: 
    // Month Current -> Hidden (Secret)
    // Month Previous -> Visible
    // Year -> Visible

    // Let's simplify for now:
    // If timeFrame === 'month' and monthMode === 'current', show "Secret" UI (unless we want to show it).
    // The prototype showed "Classifica Segreta" for current month.

    const showHidden = timeFrame === 'month' && monthMode === 'current';

    // Mocking data if API not ready or empty
    const sortedUsers = leaderboard || [];
    const currentWinner = sortedUsers[0];

    return (
        <div className="flex-1 bg-amber-50 overflow-y-auto pb-20">
            <div className="bg-white p-4 border-b border-gray-100 sticky top-0 z-20 text-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Classifica Gruppo</span>
                <h3 className="font-black text-amber-800 text-lg">{currentGroup?.name}</h3>
            </div>

            {timeFrame === 'month' && (
                <div className="p-4 flex gap-2 justify-center">
                    <button onClick={() => setMonthMode('previous')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${monthMode === 'previous' ? 'bg-amber-600 text-white' : 'bg-white text-amber-600 border border-amber-200'}`}>📅 Mese Scorso</button>
                    <button onClick={() => setMonthMode('current')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${monthMode === 'current' ? 'bg-amber-600 text-white' : 'bg-white text-amber-600 border border-amber-200'}`}>⏳ In Corso</button>
                </div>
            )}

            {!showHidden && (
                <div className="bg-amber-800 p-6 text-center text-white rounded-b-3xl shadow-lg mb-6 relative mx-4 mt-2">
                    <h2 className="text-xs font-bold mb-1 uppercase tracking-widest opacity-80">{timeFrame === 'year' ? 'Campione Anno' : 'Vincitore Scorso Mese'}</h2>
                    {currentWinner ? (
                        <>
                            <div className="relative inline-block mt-4">
                                <Crown className="w-10 h-10 text-yellow-400 absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce" />
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl border-4 border-yellow-400 shadow-xl mx-auto">{currentWinner.emoji}</div>
                            </div>
                            <h1 className="text-xl font-bold mt-2">{currentWinner.userName}</h1>
                            <p className="text-amber-200 font-mono text-sm">{currentWinner.score} PT</p>
                        </>
                    ) : (
                        <p className="mt-4 opacity-50">Nessun dato.</p>
                    )}
                </div>
            )}

            {showHidden && (
                <div className="p-6 flex flex-col items-center justify-center text-center mt-4">
                    <div className="bg-gray-200 p-6 rounded-full mb-4"><EyeOff className="w-12 h-12 text-gray-500" /></div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Classifica Segreta</h2>
                    <p className="text-gray-500 text-sm mb-8 px-4">Per mantenere la suspense, la classifica del gruppo è oscurata fino a fine mese!</p>
                    <div className="bg-white p-6 rounded-2xl shadow-md w-full border-l-4 border-amber-500">
                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Il tuo punteggio totale</p>
                        <div className="text-3xl font-mono font-black text-amber-600">{currentUser.poopScore} PT</div>
                    </div>
                </div>
            )}

            {!showHidden && (
                <div className="px-4">
                    <div className="space-y-2">
                        {sortedUsers.map((user, index) => (
                            <div key={user.userId} className={`flex items-center p-3 rounded-xl shadow-sm ${index === 0 ? 'bg-white border-2 border-yellow-400' : 'bg-white'}`}>
                                <div className="w-6 font-bold text-gray-400 text-center mr-2 text-sm">#{index + 1}</div>
                                <div className="text-2xl mr-3">{user.emoji}</div>
                                <div className="flex-1"><h4 className="font-bold text-gray-800 text-sm">{user.userName}</h4></div>
                                <div className="font-mono font-bold text-gray-700">{user.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
