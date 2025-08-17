/* eslint-disable @typescript-eslint/no-explicit-any */
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false';

type EventPayload = {
  type: string;
  requestId?: string | null;
  context?: Record<string, any>;
};

let queue: EventPayload[] = [];
let flushing = false;
let flushTimer: any = null;
const FLUSH_MS = 3000;
const MAX_BATCH = 50;

const getBackendUrl = () => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  return `${base}/api/analytics/track`;
};

const getClientSessionId = (): string => {
  try {
    const key = 'qm_client_session_id';
    let sid = localStorage.getItem(key);
    if (!sid) {
      sid = (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2));
      localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    // SSR or blocked storage
    return 'no-storage';
  }
};

const enqueue = (evt: EventPayload) => {
  if (!ANALYTICS_ENABLED) return;
  queue.push({
    ...evt,
    context: { ...evt.context, source: 'client', clientSessionId: getClientSessionId() },
  });
  if (queue.length >= MAX_BATCH) {
    void flush();
  } else {
    schedule();
  }
};

const schedule = () => {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_MS);
};

export const flush = async () => {
  if (flushing || queue.length === 0) return;
  flushing = true;
  const batch = queue.splice(0, MAX_BATCH);
  try {
    await fetch(getBackendUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(batch),
      keepalive: true,
    });
  } catch {
    // best effort; requeue a few items
    queue = batch.concat(queue).slice(0, 500);
  } finally {
    flushing = false;
  }
};

export const track = (type: string, context?: Record<string, any>) => enqueue({ type, context });

export const trackPageView = (path: string, referrer?: string | null) =>
  track('page_view', { pagePath: path, referrer: referrer || document.referrer || null });

export const trackFeature = (featureKey: string, extra?: Record<string, any>) =>
  track('feature', { featureKey, ...(extra || {}) });

export const trackApiError = (info: { url: string; method?: string; status?: number; durationMs?: number; requestId?: string | null; message?: string; }) =>
  track('error', { scope: 'api', ...info });

export const trackClientError = (error: { message: string; stack?: string; source?: string; colno?: number; lineno?: number; filename?: string; reason?: any; }) =>
  track('error', { scope: 'client', ...error });

export const startHeartbeat = () => {
  if (!ANALYTICS_ENABLED) return () => {};
  let active = true;
  const onVisibility = () => {
    active = document.visibilityState === 'visible';
    track('heartbeat', { visible: active });
  };
  const interval = setInterval(() => {
    if (active) track('heartbeat', { visible: true });
  }, 30000);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('beforeunload', () => { void flush(); }, { capture: true });
  return () => {
    clearInterval(interval);
    document.removeEventListener('visibilitychange', onVisibility);
  };
};

export const initGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (event) => {
    try {
      trackClientError({ message: event.message, filename: (event as any).filename, lineno: (event as any).lineno, colno: (event as any).colno, source: 'window.onerror', stack: (event.error && event.error.stack) || undefined });
    } catch {}
  });
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    try {
      trackClientError({ message: event.reason?.message || 'unhandledrejection', reason: event.reason, source: 'unhandledrejection', stack: event.reason?.stack });
    } catch {}
  });
};


