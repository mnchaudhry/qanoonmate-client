"use client"

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UserRole } from '@/lib/enums';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { logout } from '@/store/reducers/authSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

interface AuthFlowGuardProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    requireAuthFlow?: boolean; // For pages that require being in auth flow (OTP, change password, etc.)
}

const AuthFlowGuard: React.FC<AuthFlowGuardProps> = ({ children, allowedRoles = [UserRole.CLIENT, UserRole.LAWYER], requireAuthFlow = false }) => {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

  const [showAlreadyLoggedInModal, setShowAlreadyLoggedInModal] = useState(false);

    // Get role from URL query
    const roleParam = searchParams.get('role');
    const urlRole = Object.values(UserRole).includes(roleParam as UserRole) ? roleParam as UserRole : null;

    useEffect(() => {
        if (isLoading) return;

        // If user is already authenticated and trying to access auth pages
        if (isAuthenticated && user && pathname.startsWith('/auth/')) {
            // Show modal for already logged in users
            setShowAlreadyLoggedInModal(true);
            return;
        }

        // For pages that require auth flow (OTP, change password, etc.)
        if (requireAuthFlow && !isAuthenticated) {
            // Check if user has OTP email in localStorage (indicating they're in signup flow)
            const otpEmail = localStorage.getItem('OTP_EMAIL');
            if (!otpEmail) {
                // No OTP email means they're trying to access directly, redirect to signin
                router.push('/auth/sign-in');
                return;
            }
        }

        // If role is specified in URL and user is not authenticated, ensure role is valid
        if (urlRole && !allowedRoles.includes(urlRole)) {
            router.push('/auth/sign-in');
            return;
        }
    }, [isAuthenticated, user, isLoading, pathname, requireAuthFlow, allowedRoles, urlRole, router]);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            setShowAlreadyLoggedInModal(false);

      // If this was a protected auth flow page, redirect to signin
      if (requireAuthFlow) {
        router.push('/auth/sign-in');
      } else {
        // Otherwise redirect to home
        router.push('/');
      }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

  const handleStayLoggedIn = () => {
    setShowAlreadyLoggedInModal(false);
    // User chooses to stay logged in, redirect them to their dashboard
    if (user?.role === UserRole.LAWYER) {
      router.push('/lawyer/dashboard');
    } else if (user?.role === UserRole.CLIENT) {
      router.push('/client/dashboard');
    } else {
      router.push('/');
    }
  };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <>
            {children}

            {/* Already Logged In Modal */}
            <Dialog open={showAlreadyLoggedInModal} onOpenChange={setShowAlreadyLoggedInModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Already Logged In</DialogTitle>
                        <DialogDescription>
                            You are already logged in as a {user?.role?.toLowerCase()}.
                            Would you like to logout and continue with this action, or go back to your dashboard?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={handleStayLoggedIn}
                            className="w-full sm:w-auto"
                        >
                            Go Back to Dashboard
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="w-full sm:w-auto"
                        >
                            Logout & Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AuthFlowGuard;
