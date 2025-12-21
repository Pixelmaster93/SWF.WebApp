import axios from 'axios';
import { User } from 'oidc-client-ts';

const API_URL = 'https://swf.api.dinonerd.it';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get token from storage (oidc-client-ts stores it in sessionStorage by default)
export const getUser = () => {
    const oidcStorage = sessionStorage.getItem(`oidc.user:https://auth.dinonerd.it/realms/ShitWithFriend:swf-web`);
    if (!oidcStorage) {
        return null;
    }
    return User.fromStorageString(oidcStorage);
};

// Helper to get current User ID
export const getUserId = () => {
    const user = getUser();
    return user?.profile?.sub || null;
};

api.interceptors.request.use(
    (config) => {
        const user = getUser();
        if (user && user.access_token) {
            config.headers.Authorization = `Bearer ${user.access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
