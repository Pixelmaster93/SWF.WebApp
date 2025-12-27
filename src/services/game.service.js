import api from './api';

export const gameService = {
    // GET /Game?pageNumber=0&pageSize=10
    getGames: async (pageNumber = 0, pageSize = 10) => {
        const response = await api.get(`/Game?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    },

    // GET /Game/{id}
    getGameById: async (id) => {
        const response = await api.get(`/Game/${id}`);
        return response.data;
    },

    // POST /Game
    createGame: async (gameData) => {
        const response = await api.post('/Game', gameData);
        return response.data;
    },

    // PUT /Game/{id}
    updateGame: async (id, gameData) => {
        const response = await api.put(`/Game/${id}`, gameData);
        return response.data;
    },

    // DELETE /Game/{id}
    deleteGame: async (id) => {
        const response = await api.delete(`/Game/${id}`);
        return response.data;
    }
};
