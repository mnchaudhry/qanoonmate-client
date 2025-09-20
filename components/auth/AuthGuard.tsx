'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SignInModal from './SignInModal';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  customMessage?: string;
  showBenefits?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = null,
  requireAuth = true,
  customMessage,
  showBenefits = true
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { showSignInModal, modalConfig, handleSignInSuccess, handleSignInCancel } = useAuthGuard();

  // If authentication is not required, render children directly
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If user is authenticated, render children
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // If user is not authenticated, show fallback or nothing
  return (
    <>
      {fallback}
      <SignInModal
        isOpen={showSignInModal}
        onClose={handleSignInCancel}
        onSuccess={handleSignInSuccess}
        title={modalConfig.title || customMessage || "Sign In Required"}
        description={modalConfig.description || "Please sign in to access this feature"}
        showBenefits={modalConfig.showBenefits !== undefined ? modalConfig.showBenefits : showBenefits}
      />
    </>
  );
};

export default AuthGuard;
