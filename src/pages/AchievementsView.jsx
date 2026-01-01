import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Lock, Trophy } from 'lucide-react';
import { gamificationService } from '../services/gamification.service';
import { getAvatarUrl } from '../utils/avatarHelper';

const AchievementCard = ({ ach }) => {
    const [imgError, setImgError] = React.useState(false);

    const isUnlocked = ach.isUnlocked;
    const isSecret = ach.isSecret && !ach.isUnlocked;
    const isDescriptionSecret = ach.description === '???';

    return (
        <div
            className={`bg-white rounded-xl shadow-sm p-4 flex flex-col items-center text-center border-2 transition-all ${isUnlocked ? 'border-amber-400' : 'border-gray-100 grayscale opacity-80'}`}
        >
            <div className="w-20 h-20 mb-3 relative flex items-center justify-center">
                {isSecret ? (
                    <div className="bg-gray-200 rounded-full p-4">
                        <Lock size={32} className="text-gray-400" />
                    </div>
                ) : imgError ? (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-full">
                        <span className="text-gray-400 font-bold text-xs">WIP</span>
                    </div>
                ) : (
                    <img
                        src={getAvatarUrl(ach.code)}
                        alt={ach.name}
                        className="w-full h-full object-contain drop-shadow-md"
                        onError={() => setImgError(true)}
                    />
                )}
            </div>

            <h3 className="font-bold text-sm text-gray-800 mb-1">
                {ach.name}
            </h3>
            <p className="text-xs text-gray-500">
                {isDescriptionSecret ? '🔒 Secret' : ach.description}
            </p>

            {isUnlocked && (
                <span className="mt-2 text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">
                    SBLOCCATO
                </span>
            )}
        </div>
    );
};

const AchievementsView = () => {
    const { data: achievements, isLoading } = useQuery({
        queryKey: ['achievements'],
        queryFn: gamificationService.getAchievements,
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 text-gray-400">
                Caricamento Achievements...
            </div>
        );
    }

    // Mock data if API is empty or not yet implemented
    const list = achievements || [];

    return (
        <div className="flex-1 bg-gray-50 overflow-y-auto pb-20 p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Trophy className="text-amber-500" /> Achievements
            </h1>

            <div className="grid grid-cols-2 gap-4">
                {list.map((ach) => (
                    <AchievementCard key={ach.code} ach={ach} />
                ))}

                {list.length === 0 && (
                    <div className="col-span-2 text-center text-gray-400 py-10">
                        Nessun achievement trovato.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsView;
