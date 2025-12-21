import React from 'react';
import { LogOut, User } from 'lucide-react';

const SettingsView = ({ onLogout }) => {
    const goToProfile = () => {
        const keycloakBaseUrl = "https://auth.dinonerd.it";
        const realm = "shitwithfriends";
        const clientId = "shitwithfriends-frontend";

        const currentUrl = window.location.origin;
        const accountUrl = `${keycloakBaseUrl}/realms/${realm}/account?referrer=${clientId}&referrer_uri=${encodeURIComponent(currentUrl)}`;

        window.location.href = accountUrl;
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-4">Impostazioni</h1>

            <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                        onClick={goToProfile}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <User size={20} />
                            <span className="font-medium">Gestisci Profilo</span>
                        </div>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors text-red-600"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={20} />
                            <span className="font-medium">Esci</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 py-4">
                Version 1.0.0
            </div>
        </div>
    );
};

export default SettingsView;
