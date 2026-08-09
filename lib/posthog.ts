import posthog from 'posthog-js';

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

export const initPostHog = () => {
  if (typeof window === 'undefined') return;

  (window as any).posthog = posthog;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-ph-mask]',
    },
    person_profiles: 'identified_only',
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') {
        ph.debug(true);
      }
    },
  });
};

export const posthogCapture = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[PostHog Track]%c ${eventName}`, 'color: #0080FF; font-weight: bold;', 'color: #333;', properties || {});
    }

    if (typeof window !== 'undefined' && (posthog as any).__loaded) {
      posthog.capture(eventName, properties);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[PostHog] Failed to capture event "${eventName}":`, error);
    }
  }
};

export const posthogIdentify = (userId: string, userProperties?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && (posthog as any).__loaded) {
      posthog.identify(userId, userProperties);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[PostHog] Failed to identify user "${userId}":`, error);
    }
  }
};

export const posthogReset = () => {
  try {
    if (typeof window !== 'undefined' && (posthog as any).__loaded) {
      posthog.reset();
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[PostHog] Failed to reset identity:', error);
    }
  }
};

export { posthog };
