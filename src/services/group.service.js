import api from './api';

export const groupService = {
    // GET /Group?pageNumber=1&pageSize=10
    getGroups: async (pageNumber = 1, pageSize = 10, userId = null) => {
        let url = `/Group?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        if (userId) {
            url += `&userId=${userId}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    // GET /Group/{id}
    getGroupById: async (id) => {
        const response = await api.get(`/Group/${id}`);
        return response.data;
    },

    // GET /Group/name/{name}
    getGroupByName: async (name) => {
        const response = await api.get(`/Group/name/${name}`);
        return response.data;
    },

    // POST /Group
    createGroup: async (groupData) => {
        // groupData: { name, password, ... }
        const response = await api.post('/Group', groupData);
        return response.data;
    },

    // PUT /Group/{id}
    updateGroup: async (id, groupData) => {
        // Body: UpdateFroupRequest (typo in API doc preserved?) No, usage is UpdateGameRequestDto style usually.
        // The user doc says "UpdateFroupRequest" is the body type name, but passing JSON matching it is key.
        const response = await api.put(`/Group/${id}`, groupData);
        return response.data;
    },

    // DELETE /Group/{id}
    deleteGroup: async (id) => {
        const response = await api.delete(`/Group/${id}`);
        return response.data;
    },

    // POST /Group/{groupId}/Member
    addMember: async (groupId, userId, role) => {
        const response = await api.post(`/Group/${groupId}/Member`, { userId, role });
        return response.data;
    },

    // POST /Group/Join
    joinGroup: async (groupId, password) => {
        const response = await api.post(`/Group/Join`, { groupId, password });
        return response.data;
    },

    // Helper to get leaderboard from group members
    getGroupLeaderboard: async (groupId, timeFrame = 'all') => {
        try {
            console.log(`Fetching leaderboard for group ${groupId}`);
            const response = await api.get(`/Group/${groupId}`);
            const group = response.data;
            console.log("Group data received:", group);

            const members = group?.members || group?.Members;

            if (!members) {
                console.warn("No members found in group:", group);
                return [];
            }

            return members
                .map(m => ({
                    userId: m.id || m.userId,
                    userName: m.userName || m.name,
                    emoji: m.emoji,
                    score: m.poopScore || 0
                }))
                .sort((a, b) => b.score - a.score);
        } catch (error) {
            console.error("Failed to fetch group leaderboard", error);
            return [];
        }
    }
};
