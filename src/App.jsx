import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './pages/LandingPage';
import LoginScreen from './pages/LoginScreen';
import Dashboard from './pages/Dashboard';
import GroupHub from './pages/GroupHub';
import SettingsView from './pages/SettingsView';
import GameSelection from './pages/GameSelection';
import Leaderboard from './pages/Leaderboard';
import NavBar from './components/NavBar';
import GameWrapper from './components/Games/GameWrapper';
import { useUser } from './hooks/useUser';
import { getUserId } from './services/api';
import { groupService } from './services/group.service';
import { highScoreService } from './services/highscore.service';
import { gameService } from './services/game.service';
import { GAMES_CONFIG } from './pages/GameSelection';
import {
    GameMinesweeper, GameSudoku, GameSnake, GameFlySwatter,
    GameClicker, GameMath, GameMemory, GameReaction, GameSimon
} from './components/Games/MiniGames';
import GameLeaderboard from './pages/GameLeaderboard';

function App() {
    const auth = useAuth();
    const queryClient = useQueryClient();
    const { profile, isLoading: isProfileLoading, createProfile } = useUser(auth.isAuthenticated);
    const [view, setView] = useState('loading'); // loading, landing, createProfile, app, grouphub
    const [appView, setAppView] = useState('home'); // home, games, month, year
    const [currentGroupId, setCurrentGroupId] = useState(null);
    const [activeGame, setActiveGame] = useState(null);
    const [activeLeaderboardGame, setActiveLeaderboardGame] = useState(null);

    // ... (queries) ...

    const handleGameEnd = async (score, forceExit = false) => {
        if (forceExit) {
            setActiveGame(null);
            setAppView('games');
            return;
        }
        if (score === null || score === undefined) return;

        console.log("Game Ended", activeGame, score);
        console.log("Available Games:", availableGames);

        // Find the backend Game ID
        const gameConfig = GAMES_CONFIG[activeGame];
        // Weak matching: ignore case and maybe trimmed
        const backendGame = availableGames?.find(g => g.name.toLowerCase() === gameConfig.name.toLowerCase());

        if (!backendGame) {
            console.log(`Game ${gameConfig.name} not found on backend. Creating it...`);
            try {
                // Determine unit and sort based on config
                // Backend CreateGameDto: { name, description, unit, isSortAscending, icon? }
                const newGame = await gameService.createGame({
                    name: gameConfig.name,
                    description: `${gameConfig.name} mini game`,
                    unit: gameConfig.unit,
                    isSortAscending: gameConfig.sort === 'asc'
                });
                console.log("Created new game:", newGame);

                // Invalidate games query to fetch the new ID for future use
                queryClient.invalidateQueries({ queryKey: ['games'] });

                // Now try to submit score again with new ID
                await createScoreMutation.mutateAsync({
                    gameId: newGame.id,
                    score: score,
                    groupId: currentGroupId,
                    userId: profile?.id
                });
            } catch (err) {
                console.error("Failed to create missing game or submit score:", err);
            }
            return;
        }

        try {
            await createScoreMutation.mutateAsync({
                gameId: backendGame.id, // Use GUID from backend
                score: score,
                groupId: currentGroupId,
                userId: profile?.id
            });
        } catch (e) {
            // Already logged in onError
        }
    };
    const { data: myGroups, isLoading: isGroupsLoading } = useQuery({
        queryKey: ['myGroups', getUserId()],
        queryFn: async () => {
            const currentUserId = getUserId();
            const res = await groupService.getGroups(0, 50, currentUserId);
            return res;
        },
        enabled: !!profile,
    });

    // Fetch available games to get their IDs
    const { data: availableGames } = useQuery({
        queryKey: ['games'],
        queryFn: async () => {
            const res = await gameService.getGames(0, 100);
            return res;
        },
        enabled: !!profile
    });

    // Fetch leaderboard for current group
    const { data: groupLeaderboard } = useQuery({
        queryKey: ['groupLeaderboard', currentGroupId],
        queryFn: async () => {
            // "Classifica Recente" implies monthly or short-term activity
            const res = await groupService.getGroupLeaderboard(currentGroupId, 'month');
            console.log("App.jsx: groupLeaderboard fetched:", res);
            return res;
        },
        enabled: !!currentGroupId,
    });

    useEffect(() => {
        if (auth.isLoading) {
            setView('loading');
        } else if (!auth.isAuthenticated) {
            setView('landing');
        } else if (isProfileLoading) {
            setView('loading');
        } else if (!profile) {
            setView('createProfile');
        } else {
            // Authenticated and has profile
            if (myGroups && myGroups.length > 0) {
                if (!currentGroupId) {
                    setCurrentGroupId(myGroups[0].id);
                }
                setView('app');
            } else if (myGroups && myGroups.length === 0) {
                setView('grouphub');
            } else {
                // If myGroups is null/undefined but profile exists (fallback)
                setView('grouphub');
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, isProfileLoading, profile, myGroups]);

    const handleCreateProfile = async (name, emoji) => {
        try {
            await createProfile({ name, emoji }); // API expects CreateUserRequestDto {name, emoji}
        } catch (error) {
            console.error("Failed to create profile", error);
            alert("Errore durante la creazione del profilo.");
        }
    };

    const createScoreMutation = useMutation({
        mutationFn: highScoreService.createHighScore,
        onSuccess: () => {
            console.log("Score saved successfully");
        },
        onError: (err) => {
            console.error("Failed to save score", err);
        }
    });

    // ... existing useState ...



    const currentGroup = myGroups?.find(g => g.id === currentGroupId);

    if (view === 'loading') return <LoadingScreen />;
    if (view === 'landing') return <LandingPage onLogin={() => auth.signinRedirect()} />;
    if (view === 'createProfile') return <LoginScreen onLogin={handleCreateProfile} initialName={auth.user?.profile?.preferred_username || auth.user?.profile?.name || ''} />;

    if (view === 'grouphub') {
        return (
            <div className="h-screen w-full max-w-md mx-auto bg-gray-50 relative shadow-2xl">
                <GroupHub
                    currentUser={profile}
                    myGroups={myGroups}
                    onSelectGroup={(gid) => { setCurrentGroupId(gid); setView('app'); }}
                    onLogout={async () => {
                        await auth.signoutRedirect();
                    }}
                />
            </div>
        );
    }

    if (activeGame) {
        let GameComponent = null;
        switch (activeGame) {
            case 'mine': GameComponent = <GameMinesweeper />; break;
            case 'sudoku': GameComponent = <GameSudoku />; break;
            case 'snake': GameComponent = <GameSnake />; break;
            case 'fly': GameComponent = <GameFlySwatter />; break;
            case 'clicker': GameComponent = <GameClicker />; break;
            case 'math': GameComponent = <GameMath />; break;
            case 'memory': GameComponent = <GameMemory />; break;
            case 'react': GameComponent = <GameReaction />; break;
            case 'simon': GameComponent = <GameSimon />; break;
            default: GameComponent = <div>Gioco non trovato</div>;
        }

        const backendGame = availableGames?.find(g => g.name === GAMES_CONFIG[activeGame].name);

        return (
            <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col relative overflow-hidden shadow-2xl">
                <GameWrapper
                    gameId={activeGame}
                    backendGameId={backendGame?.id}
                    onEnd={handleGameEnd}
                    currentGroup={currentGroup}
                >
                    {GameComponent}
                </GameWrapper>
            </div>
        );
    }

    return (
        <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col font-sans relative overflow-hidden shadow-2xl">
            {appView === 'home' && (
                <Dashboard
                    currentUser={profile}
                    currentGroup={currentGroup}
                    groups={myGroups}
                    onChangeGroup={(gid) => gid === 'hub' ? setView('grouphub') : setCurrentGroupId(gid)}
                    groupLeaderboard={groupLeaderboard}
                />
            )}

            {appView === 'games' && (
                <GameSelection
                    onSelectGame={(id) => setActiveGame(id)}
                    onShowLeaderboard={(id) => setActiveLeaderboardGame(id)}
                />
            )}

            {appView === 'month' && <Leaderboard timeFrame="month" currentGroup={currentGroup} currentUser={profile} />}

            {appView === 'year' && <Leaderboard timeFrame="year" currentGroup={currentGroup} currentUser={profile} />}



            {appView === 'settings' && (
                <SettingsView
                    onLogout={async () => {
                        await auth.signoutRedirect();
                    }}
                />
            )}

            {activeLeaderboardGame && (
                <GameLeaderboard
                    gameId={availableGames?.find(g => g.name.toLowerCase() === GAMES_CONFIG[activeLeaderboardGame].name.toLowerCase())?.id}
                    gameName={GAMES_CONFIG[activeLeaderboardGame].name}
                    gameIcon={GAMES_CONFIG[activeLeaderboardGame].icon}
                    onClose={() => setActiveLeaderboardGame(null)}
                />
            )}

            <NavBar view={appView} setView={setAppView} />
        </div>
    );
}

export default App;
