import axios from "axios";

import store from '../store';
import { refreshToken as refreshTokenThunk, logout as logoutThunk } from '../reducers/authSlice';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api'

export const APIClient = axios.create({
    baseURL: BASE_URL, withCredentials: true, headers: { "Content-Type": "application/json", },
});
export const FormDataAPI = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "multipart/form-data", },
});

// --- CSRF Token Management ---
let csrfToken: string | null = null;
export const fetchAndSetCSRFToken = async () => {
    try {
        const { data } = await APIClient.get('/auth/csrf-token');
        csrfToken = data?.csrfToken;
        if (csrfToken) {
            APIClient.defaults.headers['X-CSRF-Token'] = csrfToken;
        }
    } catch (err) {
        // Optionally handle error
    }
};

// --- Token/Session Management ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

APIClient.interceptors.request.use(
    (config) => {
        // Attach access token from Redux state if available
        const state = store.getState();
        const token = state.auth?.token;
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

APIClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return APIClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const result = await store.dispatch(refreshTokenThunk() as any);
                const newToken = result?.payload?.data?.token;
                if (newToken) {
                    store.dispatch({ type: 'auth/setToken', payload: newToken });
                    processQueue(null, newToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return APIClient(originalRequest);
                } else {
                    processQueue('Refresh failed', null);
                    store.dispatch(logoutThunk());
                    return Promise.reject(error);
                }
            } catch (err) {
                processQueue(err, null);
                store.dispatch(logoutThunk());
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default APIClient;