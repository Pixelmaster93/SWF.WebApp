import api from './api';

export const poopService = {
    // GET /Poop?pageNumber=1&pageSize=10
    getPoops: async (pageNumber = 1, pageSize = 10) => {
        const response = await api.get(`/Poop?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    },

    // GET /Poop/filter?userId=...&dateFrom=...&dateTo=...
    filterPoops: async (userId, dateFrom, dateTo) => {
        let query = `/Poop/filter?userId=${userId}`;
        if (dateFrom) query += `&dateFrom=${dateFrom}`;
        if (dateTo) query += `&dateTo=${dateTo}`;

        const response = await api.get(query);
        return response.data;
    },

    // GET /Poop/{id}
    getPoopById: async (id) => {
        const response = await api.get(`/Poop/${id}`);
        return response.data;
    },

    // POST /Poop
    createPoop: async (poopData) => {
        const response = await api.post('/Poop', poopData);
        return response.data;
    },

    // DELETE /Poop/{id}
    deletePoop: async (id) => {
        const response = await api.delete(`/Poop/${id}`);
        return response.data;
    }
};
