import React from 'react';

const LandingPage = ({ onLogin }) => {
    return (
        <div className="h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-6 font-sans">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-white/50 flex flex-col items-center text-center">
                <div className="bg-amber-500 w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg mb-6 rotate-3">
                    💩
                </div>

                <h1 className="text-4xl font-black text-amber-900 mb-2 tracking-tight">Shit With Friends</h1>
                <p className="text-amber-700/60 mb-8 font-medium text-lg">Il social network definitivo.</p>

                <button
                    onClick={onLogin}
                    className="w-full py-4 bg-amber-900 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-amber-800 active:scale-95 transition-all"
                >
                    LOGIN
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
