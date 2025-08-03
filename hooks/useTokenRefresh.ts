import { useEffect, useRef } from 'react';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from '@/store/reducers/authSlice';

// Optional: Only needed if you want proactive token refresh before expiry.
// Not required if you rely on API client 401/refresh logic.
export const useTokenRefresh = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            // Refresh token every 14 minutes (assuming 15-minute token expiry)
            const refreshInterval = 14 * 60 * 1000;

            const scheduleRefresh = () => {
                if (refreshTimeoutRef.current) {
                    clearTimeout(refreshTimeoutRef.current);
                }
                refreshTimeoutRef.current = setTimeout(() => {
                    dispatch(refreshToken());
                    scheduleRefresh();
                }, refreshInterval);
            };

            scheduleRefresh();

            return () => {
                if (refreshTimeoutRef.current) {
                    clearTimeout(refreshTimeoutRef.current);
                }
            };
        }
    }, [isAuthenticated]);

    return {
        refreshToken
    };
}; 