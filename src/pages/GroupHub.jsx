import React, { useState } from 'react';
import { LogOut, Users, Plus, Search, ChevronDown, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/group.service';

const GroupHub = ({ currentUser, myGroups, onSelectGroup, onLogout }) => {
    const [view, setView] = useState('list');
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupPass, setNewGroupPass] = useState('');

    const [joinPass, setJoinPass] = useState('');
    const [selectedJoinGroup, setSelectedJoinGroup] = useState(null);

    const queryClient = useQueryClient();

    const createGroupMutation = useMutation({
        mutationFn: groupService.createGroup,
        onSuccess: async (data) => {
            try {
                // Add creator as Admin
                await groupService.addMember(data.id, currentUser.id, 'Admin');
            } catch (error) {
                console.error("Failed to add creator as admin", error);
                // We don't block success here, but maybe alert?
            }
            queryClient.invalidateQueries({ queryKey: ['myGroups'] });
            setView('list');
            setNewGroupName('');
            setNewGroupPass('');
            onSelectGroup(data.id); // Auto select new group
        }
    });

    const joinGroupMutation = useMutation({
        mutationFn: ({ groupId, password }) => groupService.joinGroup(groupId, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myGroups'] });
            setView('list');
            setJoinPass('');
            setSelectedJoinGroup(null);
            setSearch('');
            setSearchResults([]);
        },
        onError: (error) => {
            alert("Errore durante l'accesso al gruppo. Verifica la password.");
        }
    });

    const searchGroupsMutation = useMutation({
        mutationFn: groupService.getGroupByName,
        onSuccess: (data) => {
            // API returns a single group or null/error? 
            // Assuming it returns an object if found, or throws. 
            // If it returns a list, fine. If single object, wrap in array.
            if (data) {
                setSearchResults(Array.isArray(data) ? data : [data]);
            } else {
                setSearchResults([]);
            }
        },
        onError: () => {
            setSearchResults([]);
        }
    });

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (e.target.value.length > 2) {
            searchGroupsMutation.mutate(e.target.value);
        } else {
            setSearchResults([]);
        }
    };

    const handleCreate = () => {
        if (!newGroupName.trim()) return;
        createGroupMutation.mutate({ name: newGroupName, password: newGroupPass }); // Adjust DTO if needed
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-amber-600 text-white p-6 pb-10 rounded-b-3xl shadow-lg relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div><h1 className="text-2xl font-black">Ciao, {currentUser.name}</h1><p className="text-amber-200 text-sm">Gestisci i tuoi gruppi.</p></div>
                    <button onClick={onLogout} className="bg-amber-800 p-2 rounded-full text-amber-200 hover:bg-amber-900"><LogOut size={18} /></button>
                </div>
            </div>

            <div className="flex-1 -mt-8 px-4 overflow-y-auto pb-6">
                {view === 'list' && (
                    <>
                        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
                            <h2 className="text-gray-500 font-bold text-xs uppercase mb-3 flex items-center gap-2"><Users size={14} /> I Tuoi Gruppi</h2>
                            <div className="space-y-2">
                                {myGroups?.map(g => (
                                    <button key={g.id} onClick={() => onSelectGroup(g.id)} className="w-full flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-colors active:scale-98">
                                        <span className="font-bold text-gray-800">{g.name}</span><span className="text-amber-600"><ChevronDown className="-rotate-90" size={20} /></span>
                                    </button>
                                ))}
                                {(!myGroups || myGroups.length === 0) && <p className="text-center text-gray-400 py-4 text-sm">Non sei in nessun gruppo.</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setView('create')} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 text-gray-600 font-bold hover:bg-gray-50"><div className="bg-green-100 p-3 rounded-full text-green-600"><Plus size={24} /></div>Crea Nuovo</button>
                            <button onClick={() => setView('join')} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 text-gray-600 font-bold hover:bg-gray-50"><div className="bg-blue-100 p-3 rounded-full text-blue-600"><Search size={24} /></div>Cerca</button>
                        </div>
                    </>
                )}

                {view === 'create' && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="font-bold text-xl mb-4">Crea Gruppo</h2>
                        <input className="w-full p-3 bg-gray-50 rounded-lg mb-3 border border-gray-200" placeholder="Nome" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                        {/* Password field kept but functionality depends on API support for private groups */}
                        <input className="w-full p-3 bg-gray-50 rounded-lg mb-6 border border-gray-200" placeholder="Password (opzionale)" type="password" value={newGroupPass} onChange={e => setNewGroupPass(e.target.value)} />
                        <div className="flex gap-2"><button onClick={() => setView('list')} className="flex-1 py-3 text-gray-500 font-bold">Annulla</button><button onClick={handleCreate} disabled={createGroupMutation.isPending} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg">Crea</button></div>
                    </div>
                )}

                {view === 'join' && (
                    <div className="bg-white rounded-2xl shadow-md p-6 min-h-[300px]">
                        <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-xl">Cerca</h2><button onClick={() => setView('list')} className="text-gray-400"><X size={20} /></button></div>
                        <div className="relative mb-4"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input className="w-full p-3 pl-10 bg-gray-50 rounded-lg border border-gray-200" placeholder="Cerca gruppo..." value={search} onChange={handleSearch} /></div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {searchResults.map(g => (
                                <div key={g.id} className="p-3 border border-gray-100 rounded-xl flex justify-between items-center">
                                    <div><div className="font-bold text-gray-800">{g.name}</div><div className="text-xs text-gray-400">ID: {g.id.substring(0, 8)}...</div></div>
                                    <button onClick={() => setSelectedJoinGroup(g)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold hover:bg-blue-200">Entra</button>
                                </div>
                            ))}
                            {search.length > 2 && searchResults.length === 0 && <p className="text-center text-gray-400 text-sm">Nessun gruppo trovato.</p>}
                        </div>
                    </div>
                )}
            </div>

            {selectedJoinGroup && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="font-bold text-lg mb-2">Entra in {selectedJoinGroup.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">Inserisci la password del gruppo per entrare.</p>
                        <input className="w-full p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200" placeholder="Password" type="password" value={joinPass} onChange={e => setJoinPass(e.target.value)} />
                        <div className="flex gap-2">
                            <button onClick={() => { setSelectedJoinGroup(null); setJoinPass(''); }} className="flex-1 py-3 text-gray-500 font-bold">Annulla</button>
                            <button onClick={() => joinGroupMutation.mutate({ groupId: selectedJoinGroup.id, password: joinPass })} disabled={joinGroupMutation.isPending} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Entra</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupHub;
