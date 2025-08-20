import { APIClient } from './axios';
import { AppDispatch, RootState } from '../store';
import { refreshToken as refreshTokenThunk, logout as logoutThunk } from '../reducers/authSlice';
import { track, trackApiError } from '@/utils/analytics';

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

export const setupInterceptors = (store: { getState: () => RootState; dispatch: AppDispatch }) => {
    // Request interceptor to add auth token
    APIClient.interceptors.request.use(
        (config) => {
            // Attach access token from Redux state if available
            const state = store.getState();
            const token = state.auth?.token;
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            (config as any).metadata = { startedAt: Date.now() };
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    APIClient.interceptors.response.use(
        (response) => {
            try {
                const startedAt = (response.config as any).metadata?.startedAt as number | undefined;
                const duration = startedAt ? Date.now() - startedAt : undefined;
                const reqId = response.headers?.['x-request-id'] as string | undefined;
                if (!response.config.url?.includes('/analytics/en12')) {
                    track('api_call', {
                        url: response.config.url,
                        method: response.config.method,
                        status: response.status,
                        durationMs: duration,
                        requestId: reqId || null,
                    });
                }
            } catch { }
            return response;
        },
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
            try {
                const startedAt = (originalRequest as any)?.metadata?.startedAt as number | undefined;
                const duration = startedAt ? Date.now() - startedAt : undefined;
                const status = error?.response?.status;
                const reqId = error?.response?.headers?.['x-request-id'] as string | undefined;
                if (!originalRequest?.url?.includes('/analytics/en12')) {
                    trackApiError({ url: originalRequest?.url, method: originalRequest?.method, status, durationMs: duration, requestId: reqId || null, message: error?.message });
                }
            } catch { }
            return Promise.reject(error);
        }
    );
};
