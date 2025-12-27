import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Trophy, Medal } from 'lucide-react';
import { highScoreService } from '../services/highscore.service';
import LoadingScreen from '../components/LoadingScreen';

const GameLeaderboard = ({ gameId, gameName, gameIcon, onClose }) => {
    // 0 = All Time, 1 = Monthly (Not supported by API yet?), let's assume API has optional params
    // API: getHighScoresByGame(gameId)
    // We can filter client side if needed, or just show top 50

    const { data: scores, isLoading } = useQuery({
        queryKey: ['gameHighScores', gameId],
        queryFn: () => highScoreService.getHighScoresByGame(gameId),
        enabled: !!gameId,
    });

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg leading-tight">{gameName}</h2>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Classifica Globale</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <LoadingScreen />
                        </div>
                    ) : (
                        scores && scores.length > 0 ? (
                            <div className="space-y-1">
                                {scores.map((score, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full text-sm
                                            ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800 flex items-center gap-2">
                                                <span>{score.userName || 'Anonimo'}</span>
                                                {index < 3 && <Medal size={14} className={
                                                    index === 0 ? 'text-yellow-500' :
                                                        index === 1 ? 'text-gray-400' :
                                                            'text-orange-500'
                                                } />}
                                            </div>
                                            <div className="text-xs text-gray-400">{new Date(score.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="font-mono font-bold text-lg text-indigo-600">
                                            {score.score}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                <Trophy size={48} className="mb-3 opacity-20" />
                                <p>Nessun punteggio ancora registrato.</p>
                                <p className="text-sm mt-1">Sii il primo!</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameLeaderboard;
