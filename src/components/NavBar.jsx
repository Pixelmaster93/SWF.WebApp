import React from 'react';
import { Home, Gamepad2, Trophy, Crown } from 'lucide-react';

const NavBar = ({ view, setView }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home', color: 'text-amber-600' },
        { id: 'games', icon: Gamepad2, label: 'Giochi', color: 'text-indigo-600' },
        { id: 'month', icon: Trophy, label: 'Mese', color: 'text-amber-600' },
        { id: 'year', icon: Crown, label: 'Anno', color: 'text-amber-600' },
    ];

    return (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3 z-20 pb-safe">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex flex-col items-center ${view === item.id ? item.color : 'text-gray-400'}`}
                >
                    <item.icon size={20} />
                    <span className="text-[10px] mt-1 font-bold">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default NavBar;
