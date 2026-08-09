'use client';

import { useEffect, ReactNode } from 'react';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { initPostHog, posthog } from '@/lib/posthog';
import PostHogPageView from './PostHogPageView';

function PostHogAuthSync(): null {
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (user?._id) {
      if ((posthog as any).__loaded) {
        posthog.register({
          user_email: user.email,
          user_role: user.role || 'client',
          user_id: user._id,
          is_authenticated: true,
        });
        posthog.identify(user._id, {
          email: user.email,
          role: user.role,
          name: (user as any).fullName || (user as any).name || (user as any).username,
        });
      }
    } else {
      if ((posthog as any).__loaded) {
        posthog.register({
          user_email: undefined,
          user_role: 'guest',
          user_id: undefined,
          is_authenticated: false,
        });
      }
    }
  }, [user]);

  return null;
}

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      <PostHogAuthSync />
      {children}
    </PHProvider>
  );
}
