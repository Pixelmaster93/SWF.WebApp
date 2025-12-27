import api from './api';
import { poopService } from './poop.service';

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
            console.log(`Fetching leaderboard for group ${groupId}, timeFrame: ${timeFrame}`);
            const response = await api.get(`/Group/${groupId}`);
            const group = response.data;
            console.log("Group data received:", group);

            const members = group?.members || group?.Members;

            if (!members) {
                console.warn("No members found in group:", group);
                return [];
            }

            // If timeFrame is 'month', fetch stats for this month
            if (timeFrame === 'month') {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                const endOfToday = now.toISOString();

                // Fetch stats for each member parallelly
                const memberStatsPromises = members.map(async (m) => {
                    const userId = m.id || m.userId;
                    try {
                        console.log(`[Leaderboard] Fetching poops for user ${m.userName} (${userId}) from ${startOfMonth} to ${endOfToday}`);
                        const poops = await poopService.filterPoops(userId, startOfMonth, endOfToday);
                        console.log(`[Leaderboard] User ${m.userName} poops found:`, poops?.length);

                        // Calculate score: Count of poops
                        const score = poops ? poops.length : 0;

                        return {
                            userId: userId,
                            userName: m.userName || m.name,
                            emoji: m.emoji,
                            score: score
                        };
                    } catch (err) {
                        console.error(`Failed to fetch monthly stats for user ${userId}`, err);
                        // Return user with 0 score instead of failing completely
                        return {
                            userId: userId,
                            userName: m.userName || m.name,
                            emoji: m.emoji,
                            score: 0
                        };
                    }
                });

                const results = await Promise.all(memberStatsPromises);
                return results.sort((a, b) => b.score - a.score);
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
