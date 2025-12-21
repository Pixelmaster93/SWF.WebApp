import React from 'react';
import { Gamepad2 } from 'lucide-react';

const GAMES_CONFIG = {
    fly: { name: 'Schiaccia Mosca', unit: 'pt', sort: 'desc' },
    clicker: { name: 'Speed Clicker', unit: 'click', sort: 'desc' },
    math: { name: 'Math Quiz', unit: 'risp', sort: 'desc' },
    memory: { name: 'Memory', unit: 'pt', sort: 'desc' },
    mine: { name: 'Campo Minato', unit: 'pt', sort: 'desc' },
    sudoku: { name: 'Sudoku', unit: 'time', sort: 'asc' },
    react: { name: 'Riflessi', unit: 'pt', sort: 'desc' },
    simon: { name: 'Simon Says', unit: 'pt', sort: 'desc' },
    snake: { name: 'Snake', unit: 'pt', sort: 'desc' },
};

const GameSelection = ({ onSelectGame }) => {
    const games = Object.entries(GAMES_CONFIG);
    return (
        <div className="p-4 pb-24 overflow-y-auto h-full bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sala Giochi 🕹️</h2>
            <div className="grid grid-cols-1 gap-4">
                {games.map(([id, game]) => (
                    <div key={id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 active:scale-98 transition-transform">
                        <div className="p-3 rounded-full bg-gray-100 text-gray-600"><Gamepad2 /></div>
                        <div className="flex-1"><h3 className="font-bold text-gray-800">{game.name}</h3></div>
                        <button onClick={() => onSelectGame(id)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold">PLAY</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameSelection;
export { GAMES_CONFIG };
