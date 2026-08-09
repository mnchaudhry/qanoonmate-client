'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { posthog } from '@/lib/posthog';

function PostHogPageViewTracker(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname;
      const searchString = searchParams?.toString();
      if (searchString) {
        url = `${url}?${searchString}`;
      }

      posthog.capture('$pageview', {
        $current_url: url,
        path: pathname,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageViewTracker />
    </Suspense>
  );
}
