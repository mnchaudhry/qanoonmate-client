'use client';

import { useEffect, ReactNode } from 'react';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { initPostHog, posthog } from '@/lib/posthog';
import PostHogPageView from './PostHogPageView';

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
