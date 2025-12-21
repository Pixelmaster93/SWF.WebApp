import React from 'react';
import { LogOut } from 'lucide-react';

const SettingsView = ({ onLogout }) => {
    return (
        <div className="flex flex-col h-full bg-gray-50 p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-4">Impostazioni</h1>

            <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
