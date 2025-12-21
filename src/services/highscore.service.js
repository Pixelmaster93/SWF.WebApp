import api from './api';

export const highScoreService = {
    // GET /HighScore/game/{gameId}?pageNumber=1&pageSize=10
    getHighScoresByGame: async (gameId, pageNumber = 1, pageSize = 10) => {
        const response = await api.get(`/HighScore/game/${gameId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    },

    // GET /HighScore/game/{gameId}/user/{userId}
    getHighScoresByUser: async (gameId, userId, pageNumber = 1, pageSize = 10) => {
        const response = await api.get(`/HighScore/game/${gameId}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    },

    // GET /HighScore/{id}
    getHighScoreById: async (id) => {
        const response = await api.get(`/HighScore/${id}`);
        return response.data;
    },

    // POST /HighScore
    createHighScore: async (scoreData) => {
        const response = await api.post('/HighScore', scoreData);
        return response.data;
    },

    // PUT /HighScore/{id}
    updateHighScore: async (id, scoreData) => {
        const response = await api.put(`/HighScore/${id}`, scoreData);
        return response.data;
    },

    // DELETE /HighScore/{id}
    deleteHighScore: async (id) => {
        const response = await api.delete(`/HighScore/${id}`);
        return response.data;
    }
};
