import React, { useState } from 'react';
import { RotateCcw, X, CornerUpLeft } from 'lucide-react';
import { GAMES_CONFIG } from '../../pages/GameSelection';
import GameLeaderboard from '../../pages/GameLeaderboard';

const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const formatScore = (gameId, value) => {
    if (GAMES_CONFIG[gameId].unit === 'time') return formatTime(value);
    return value;
};

const GameSummaryScreen = ({ gameId, backendGameId, score, onReplay, onExit, currentGroup }) => {
    const config = GAMES_CONFIG[gameId];

    return (
        <div className="absolute inset-0 bg-white z-50 flex flex-col overflow-hidden">
            <div className="bg-amber-600 text-white p-6 text-center shrink-0">
                <h2 className="text-2xl font-bold mb-2">{config.name}</h2>
                <p className="text-amber-200 text-sm uppercase font-bold">Partita Finita</p>
                <div className="text-5xl font-black mt-4 font-mono drop-shadow-md">{formatScore(gameId, score)}</div>
            </div>
            <div className="p-4 flex gap-4 justify-center shrink-0 bg-gray-50 border-b border-gray-200">
                <button onClick={onReplay} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"><RotateCcw size={20} /> Rigioca</button>
                <button onClick={onExit} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform"><X size={20} /> Esci</button>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
                {backendGameId && (
                    <GameLeaderboard
                        gameId={backendGameId}
                        gameName={config.name}
                        isEmbedded={true}
                    />
                )}
            </div>
        </div>
    );
};

const GameWrapper = ({ onEnd, children, gameId, backendGameId, currentGroup }) => {
    const [gameOverState, setGameOverState] = useState(null);

    const handleGameEnd = (score) => {
        setGameOverState({ score });
        onEnd(score);
    };

    if (gameOverState) {
        return (
            <GameSummaryScreen
                gameId={gameId}
                backendGameId={backendGameId}
                score={gameOverState.score}
                currentGroup={currentGroup}
                onReplay={() => setGameOverState(null)}
                onExit={() => onEnd(null, true)}
            />
        );
    }

    return (
        <div className="flex-1 relative flex flex-col">
            <button
                onClick={() => onEnd(null, true)}
                className="absolute top-2 right-2 z-40 bg-gray-900/10 hover:bg-gray-900/20 p-2 rounded-full text-gray-700 transition-colors"
            >
                <CornerUpLeft size={24} />
            </button>
            {React.cloneElement(children, { onEnd: handleGameEnd })}
        </div>
    );
};

export default GameWrapper;
