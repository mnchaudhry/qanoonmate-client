"use client";
import { useEffect } from 'react';
import { flush, initGlobalErrorHandlers, startHeartbeat, trackPageView } from '@/utils/analytics';
import { usePathname } from 'next/navigation';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initGlobalErrorHandlers();
    const stop = startHeartbeat();
    return () => {
      stop();
      void flush();
    };
  }, []);

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}


