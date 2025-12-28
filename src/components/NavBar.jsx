import React from 'react';
import { Home, Gamepad2, Trophy, Crown, Settings } from 'lucide-react';

const NavBar = ({ view, setView }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home', color: 'text-amber-600' },
        { id: 'games', icon: Gamepad2, label: 'Giochi', color: 'text-indigo-600' },
        { id: 'achievements', icon: Trophy, label: 'Trofei', color: 'text-yellow-600' },
        { id: 'rank', icon: Crown, label: 'Classifica', color: 'text-amber-600' }, // Renamed from Month/Year to generic Rank? Or keep Month.
        // Let's keep Month but maybe rename label to be shorter or clearer if we have space.
        // Actually, let's Replace 'Month' and 'Year' with 'Rank' (Classifica) which inside has Tabs, 
        // OR just add Achievements. 5 items fits well.
        // Current: Home, Games, Month, Year, Settings.
        // Proposal: Home, Games, Trofei, Classifica (Month), Settings. 
        // I will replace 'year' with 'achievements' and rename 'month' to 'rank' (Classifica) to merge them?
        // App.jsx supports 'month' and 'year'. 
        // Let's just replace 'year' with 'achievements' for now to fit the bar. users can switch month/year inside the leaderboard view.
        // Wait, Leaderboard.jsx has toggle? Yes, it has "Mese Scorso" / "In Corso".
        // So I'll replace 'month' and 'year' with single 'month' (labeled Classifica) and 'achievements'.
        { id: 'month', icon: Crown, label: 'Classifica', color: 'text-amber-600' },
        { id: 'settings', icon: Settings, label: 'Profilo', color: 'text-gray-600' },
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
