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
            console.log(`Fetching leaderboard for group ${groupId}, timeFrame: ${timeFrame}`);
            const response = await api.get(`/Group/${groupId}`);
            const group = response.data;
            console.log("Group data received:", group);

            const members = group?.members || group?.Members;

            if (!members) {
                console.warn("No members found in group:", group);
                return [];
            }

            // If timeFrame is 'month', we need to fetch stats for this month
            if (timeFrame === 'month') {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                const endOfToday = now.toISOString();

                // Import poopService here or assume it's available (better to dynamic import or move import to top)
                // Since we can't easily change top imports in this block, we'll assume we added it or use dynamic if module system supports it.
                // Standard ES6 import at top is safer. I will trust the user to have added the import or add it in a separate step if needed.
                // Actually, I should check if I can add the import. I'll add the import in a separate tool call if this file doesn't have it.
                // Re-reading confirm implementation: I will replace the function AND ensure import is there.

                // Fetch stats for each member parallelly
                const memberStatsPromises = members.map(async (m) => {
                    const userId = m.id || m.userId;
                    try {
                        // We assume poopService is imported. If not, this throws. 
                        // Check previous view_file: poopService was NOT imported in group.service.js.
                        // I must handle this. I will assume I can access poopService if I imported it. 
                        // **CRITICAL**: I must add the import line in `group.service.js` first or use a robust way.
                        // For now I will write the logic assuming `poopService` is available, and I will add the import in a subsequent step or this one if I can replace the whole file. 
                        // Since I am using replace_file_content, I cannot easily add the import at the top without another call.
                        // I will use `import { poopService } from './poop.service';` at the top using `replace_file_content` separately or use `require` if CommonJS (but this is Vite/ESM).

                        // WAITING: I will assume I will add the import.

                        const poops = await import('./poop.service').then(m => m.poopService.filterPoops(userId, startOfMonth, endOfToday));

                        // Calculate score: Sum of poops, or specific value? 
                        // User said "cacche postate", implying count.
                        // Let's assume count for now, as 'poopScore' usually implies count or standard value.
                        const score = poops ? poops.length : 0;

                        return {
                            userId: userId,
                            userName: m.userName || m.name,
                            emoji: m.emoji,
                            score: score
                        };
                    } catch (err) {
                        console.error(`Failed to fetch stats for user ${userId}`, err);
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
