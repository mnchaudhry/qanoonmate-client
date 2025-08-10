"use client";

import React from 'react';
import ComingSoon from '@/components/ui/coming-soon';

interface ComingSoonWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  estimatedDate?: string;
  features?: string[];
  showNotifyButton?: boolean;
  enabled?: boolean; // Toggle to enable/disable the coming soon overlay
}

/**
 * ComingSoonWrapper - Wraps any page content with a "Coming Soon" overlay
 * 
 * @example
 * // Wrap a complete page
 * <ComingSoonWrapper 
 *   title="Advanced Analytics"
 *   description="Get detailed insights into your legal queries and case performance."
 *   estimatedDate="Q2 2024"
 *   features={["Real-time analytics", "Custom reports", "Data visualization", "Export functionality"]}
 * >
 *   <YourPageContent />
 * </ComingSoonWrapper>
 * 
 * @example
 * // Conditional wrapper (useful for feature flags)
 * <ComingSoonWrapper enabled={!isFeatureEnabled}>
 *   <YourPageContent />
 * </ComingSoonWrapper>
 */
const ComingSoonWrapper: React.FC<ComingSoonWrapperProps> = ({
  children,
  title,
  description,
  estimatedDate,
  features,
  showNotifyButton = true,
  enabled = true
}) => {
  // If disabled, just render children without any wrapper
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ComingSoon
      title={title}
      description={description}
      estimatedDate={estimatedDate}
      features={features}
      showNotifyButton={showNotifyButton}
    >
      {children}
    </ComingSoon>
  );
};

export default ComingSoonWrapper;
