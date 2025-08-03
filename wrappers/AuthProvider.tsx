import { getProfile } from '@/store/reducers/authSlice';
import { setToken } from '@/store/reducers/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { getAuth, removeAuth } from '@/utils/localStorage';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const authData = getAuth();
    if (authData) {
      try {
        // Set initial credentials from localStorage
        dispatch(setToken(authData.token || ''));

        // Fetch fresh profile data from server
        if (authData.user?.id) {
          dispatch(getProfile());
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        removeAuth();
      }
    }
  }, []);

  // Refresh profile data periodically when logged in
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        dispatch(getProfile());
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}

export default AuthProvider