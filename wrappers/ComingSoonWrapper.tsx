"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ReleaseChannel } from '@/lib/enums';
import { isFeatureEnabled, FeatureGate } from '@/utils/featureFlags';
import LaunchPage from '@/components/launch-page';

interface ComingSoonWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  estimatedDate?: string;
  features?: string[];
  showNotifyButton?: boolean;
  enabled?: boolean; // Toggle to enable/disable the coming soon overlay
  gate?: FeatureGate; // Optional gate to auto-enable based on user's releaseChannel
}


const ComingSoonWrapper: React.FC<ComingSoonWrapperProps> = ({ children, enabled = true, gate }) => {
  const user = useSelector((s: RootState) => s.auth.user as any);
  const userChannel: ReleaseChannel | undefined = user?.releaseChannel as ReleaseChannel | undefined;
  const gatedEnabled = gate ? !isFeatureEnabled(userChannel, gate) : enabled;
  // If disabled, just render children without any wrapper
  if (!gatedEnabled) {
    return <>{children}</>;
  }

  return (
    <LaunchPage
    // title={title}
    // description={description}
    // estimatedDate={estimatedDate}
    // launchAt={process.env.NEXT_PUBLIC_LAUNCH_AT || '2025-08-20T00:00:00Z'}
    // features={features}
    // showNotifyButton={showNotifyButton}
    >
      {/* {children} */}
    </LaunchPage>
  );
};

export default ComingSoonWrapper;
