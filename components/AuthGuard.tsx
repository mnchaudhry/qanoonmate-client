import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/lib/enums';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
    redirectTo?: string;
    fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole, redirectTo = '/auth/login', fallback = <div>Loading...</div> }) => {

    //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    //////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
    useEffect(() => {
        if (isLoading) return;

        // Not authenticated or no user, always redirect to login
        if (!isAuthenticated || !user) {
            router.push(redirectTo);
            return;
        }

        // Role mismatch: only redirect if not already on correct role's section
        if (requiredRole && user.role !== requiredRole) {
            const path = pathname || '';
            if (user.role === UserRole.LAWYER && !path.startsWith('/lawyer')) {
                router.push('/lawyer/dashboard');
                return;
            }
            if (user.role === UserRole.CLIENT && !path.startsWith('/client')) {
                router.push('/client/dashboard');
                return;
            }
            if (user.role === UserRole.ADMIN && !path.startsWith('/admin')) {
                router.push('/admin/dashboard');
                return;
            }
            if (![UserRole.LAWYER, UserRole.CLIENT, UserRole.ADMIN].includes(user.role!)) {
                router.push('/');
                return;
            }
        }
    }, [isAuthenticated, user, requiredRole, redirectTo, router, isLoading, pathname]);

    //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
    if (isLoading || !isAuthenticated) {
        return <>{fallback}</>;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

///////////////////////////////////////////////////// GUARDS ////////////////////////////////////////////////////
export const ClietGuard: React.FC<Omit<AuthGuardProps, 'requiredRole'>> = (props) => (
    <AuthGuard {...props} requiredRole={UserRole.CLIENT} />
);

export const LawyerGuard: React.FC<Omit<AuthGuardProps, 'requiredRole'>> = (props) => (
    <AuthGuard {...props} requiredRole={UserRole.LAWYER} />
);

export const AdminGuard: React.FC<Omit<AuthGuardProps, 'requiredRole'>> = (props) => (
    <AuthGuard {...props} requiredRole={UserRole.ADMIN} />
);

export default AuthGuard; 