import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import React, { ReactNode } from 'react'

const TokenRefreshProvider = ({ children }: { children: ReactNode }) => {
    useTokenRefresh(); // This will handle automatic token refresh
    return <>{children}</>;
};


export default TokenRefreshProvider