import api from './api';

export const gamificationService = {
    // GET /User/achievements
    // Assuming backend endpoint is /User/achievements returning list of { code, name, description, isUnlocked }
    // User requested "GET /achievements" but usually it's user specific. 
    // If endpoint is strictly /achievements, how do we know unlock status?
    // I'll assume /User/achievements or similar. Let's try /User/achievements based on typical REST.
    // Spec said: "GET /achievements (che deve tornare lista completa + stato sblocco per l'utente)" 
    // So likely the backend handles the context.
    getAchievements: async () => {
        const response = await api.get('/achievements');
        return response.data;
    },

    // PUT /User/avatar
    updateAvatar: async (avatarCode) => {
        const response = await api.put('/User/avatar', { avatarCode });
        return response.data;
    }
};
