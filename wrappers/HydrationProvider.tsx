import React, { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { usePathname } from 'next/navigation';
import { hydrateAuth } from '@/store/reducers/authSlice';

const publicRoutes = [
    '/',
    '/auth',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/verify-otp',
    '/auth/new-password',
];


const HydrationProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const pathname = usePathname();
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
    useEffect(() => {
        dispatch(hydrateAuth({ silent: isPublic }));
    }, [dispatch, isPublic]);
    return <>{children}</>;
};


export default HydrationProvider