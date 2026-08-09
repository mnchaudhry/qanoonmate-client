import posthog from 'posthog-js';

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
export const POSTHOG_DEV_ENABLED = process.env.NEXT_PUBLIC_POSTHOG_DEV_ENABLED === 'true';

const isDev = process.env.NODE_ENV === 'development';

export const initPostHog = () => {
  if (typeof window === 'undefined') return;

  (window as any).posthog = posthog;
  (window as any).__POSTHOG_EVENTS__ = (window as any).__POSTHOG_EVENTS__ || [];
  (window as any).getEvents = () => {
    console.table((window as any).__POSTHOG_EVENTS__);
    return (window as any).__POSTHOG_EVENTS__;
  };

  // In development, run in local console-only mode by default unless explicitly enabled
  if (isDev && !POSTHOG_DEV_ENABLED) {
    console.info(
      '%c[PostHog Dev Mode]%c Running in local console-only mode (zero cloud events). Type %cgetEvents()%c in console to view all recorded events.',
      'background: #0080FF; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'color: #666;',
      'color: #0080FF; font-weight: bold;',
      'color: #666;'
    );
    return;
  }

  if (!POSTHOG_KEY) return;

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
  });
};

export const posthogCapture = (eventName: string, properties?: Record<string, any>) => {
  const eventRecord = {
    timestamp: new Date().toLocaleTimeString(),
    event: eventName,
    properties: properties || {},
  };

  if (typeof window !== 'undefined') {
    (window as any).__POSTHOG_EVENTS__ = (window as any).__POSTHOG_EVENTS__ || [];
    (window as any).__POSTHOG_EVENTS__.push(eventRecord);
  }

  if (isDev) {
    console.log(
      `%c[PostHog Event]%c ${eventName}`,
      'background: #0080FF; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #333; font-weight: bold;',
      properties || {}
    );
  }

  // Only send to cloud if in production or dev cloud sending is explicitly enabled
  if ((!isDev || POSTHOG_DEV_ENABLED) && typeof window !== 'undefined' && (posthog as any).__loaded) {
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      if (isDev) {
        console.warn(`[PostHog] Failed to capture event "${eventName}":`, error);
      }
    }
  }
};

export const posthogIdentify = (userId: string, userProperties?: Record<string, any>) => {
  if (isDev) {
    console.log(
      `%c[PostHog Identify]%c User ${userId}`,
      'background: #10B981; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #333;',
      userProperties || {}
    );
  }

  if ((!isDev || POSTHOG_DEV_ENABLED) && typeof window !== 'undefined' && (posthog as any).__loaded) {
    try {
      posthog.identify(userId, userProperties);
    } catch (error) {
      if (isDev) {
        console.warn(`[PostHog] Failed to identify user "${userId}":`, error);
      }
    }
  }
};

export const posthogReset = () => {
  if (isDev) {
    console.log(
      '%c[PostHog Reset]%c Identity cleared',
      'background: #EF4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'color: #333;'
    );
  }

  if ((!isDev || POSTHOG_DEV_ENABLED) && typeof window !== 'undefined' && (posthog as any).__loaded) {
    try {
      posthog.reset();
    } catch (error) {
      if (isDev) {
        console.warn('[PostHog] Failed to reset identity:', error);
      }
    }
  }
};

export { posthog };
