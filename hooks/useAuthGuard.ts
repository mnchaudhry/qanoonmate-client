'use client';

import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

interface AuthGuardOptions {
  redirectTo?: string;
  showSignInModal?: boolean;
  customMessage?: string;
  showBenefits?: boolean;
}

export const useAuthGuard = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    title?: string;
    description?: string;
    showBenefits?: boolean;
  }>({});
  
  const router = useRouter();

  const requireAuth = useCallback((
    action: () => void,
    options: AuthGuardOptions = {}
  ) => {
    const {
      redirectTo,
      showSignInModal: showModal = true,
      customMessage
    } = options;

    if (isAuthenticated && user) {
      // User is authenticated, proceed with action
      action();
      return;
    }

    // User is not authenticated
    if (showModal) {
      // Show sign-in modal
      setPendingAction(() => action);
      setModalConfig({
        title: customMessage ? "Sign In Required" : "Sign In Required",
        description: customMessage || "Please sign in to continue with your request",
        showBenefits: options.showBenefits !== undefined ? options.showBenefits : true
      });
      setShowSignInModal(true);
    } else if (redirectTo) {
      // Redirect to sign-in page
      router.push(redirectTo);
    } else {
      // Default redirect to sign-in page
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, user, router]);

  const handleSignInSuccess = useCallback(() => {
    setShowSignInModal(false);
    if (pendingAction) {
      // Execute the pending action after successful sign-in
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleSignInCancel = useCallback(() => {
    setShowSignInModal(false);
    setPendingAction(null);
  }, []);

  return {
    isAuthenticated,
    user,
    showSignInModal,
    modalConfig,
    requireAuth,
    handleSignInSuccess,
    handleSignInCancel
  };
};
