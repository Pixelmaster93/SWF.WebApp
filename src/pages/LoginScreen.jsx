import React, { useState } from 'react';

const EMOJI_OPTIONS = [
    '💩', '🚽', '🧻', '🪠', '🦠', '🧼', '🧴', '🚿', '🛁', '🤢',
    '🤮', '🥵', '🥶', '😵', '😖', '😤', '🤥', '🤡', '💀', '👻',
    '👺', '👽', '🤖', '🦄', '🦁', '🐯', '🦖', '🐙', '🦕', '🦈',
    '🦋', '🐌', '🐞', '🐜', '🐝', '🦟', '🦗', '🦂', '🐢', '🐍',
    '🍕', '🍔', '🍟', '🌭', '🌮', '🌯', '🍺', '🍷', '☕', '🍩'
];

const LoginScreen = ({ onLogin, initialName = '' }) => {
    const [name, setName] = useState(initialName);
    const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);

    return (
        <div className="h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-6 font-sans">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-white/50 flex flex-col items-center">
                <div className="bg-amber-500 w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg mb-6 rotate-3">
                    {selectedEmoji}
                </div>

                <h1 className="text-3xl font-black text-amber-900 mb-1 tracking-tight">Shit With Friends</h1>
                <p className="text-amber-700/60 mb-8 font-medium">Benvenuto nel Club.</p>

                <div className="w-full space-y-4">
                    {/* Only show name input if no initial name provided (fallback) */}
                    {!initialName && (
                        <div>
                            <label className="block text-xs font-bold text-amber-800 uppercase mb-2 ml-1">Il tuo Nome</label>
                            <input
                                type="text"
                                placeholder="Es. Marco"
                                className="w-full p-4 bg-white rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:outline-none transition-colors font-bold text-gray-700 text-lg text-center"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    {initialName && (
                        <div className="text-center mb-2">
                            <p className="text-sm font-bold text-amber-900/60 uppercase">Ciao,</p>
                            <h2 className="text-2xl font-black text-amber-900">{initialName}</h2>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-amber-800 uppercase mb-2 ml-1">Scegli Avatar</label>
                        <div className="grid grid-cols-6 gap-2 p-2 bg-white/50 rounded-2xl border border-amber-100 max-h-40 overflow-y-auto">
                            {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setSelectedEmoji(emoji)}
                                    className={`aspect-square flex items-center justify-center text-2xl rounded-xl transition-all ${selectedEmoji === emoji ? 'bg-amber-400 shadow-md scale-110' : 'hover:bg-white hover:shadow-sm'}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={!name.trim()}
                        onClick={() => onLogin(name, selectedEmoji)}
                        className="w-full py-4 bg-amber-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-amber-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        ENTRA NEL CLUB
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
