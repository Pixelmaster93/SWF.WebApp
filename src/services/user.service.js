import api from './api';

export const userService = {
    // GET /User?pageNumber=1&pageSize=10
    getUsers: async (pageNumber = 1, pageSize = 10) => {
        const response = await api.get(`/User?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    },

    // GET /User/{id}
    getUserById: async (id) => {
        const response = await api.get(`/User/${id}`);
        return response.data;
    },

    // GET /User/username/{username}
    getUserByUsername: async (username) => {
        const response = await api.get(`/User/username/${username}`);
        return response.data;
    },

    // POST /User
    createUser: async (userData) => {
        const response = await api.post('/User', userData);
        return response.data;
    },

    // PUT /User/{id}
    updateUser: async (id, userData) => {
        const response = await api.put(`/User/${id}`, userData);
        return response.data;
    },

    // DELETE /User/{id}
    deleteUser: async (id) => {
        const response = await api.delete(`/User/${id}`);
        return response.data;
    }
};
