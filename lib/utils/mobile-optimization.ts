import { useEffect, useState } from 'react';

/**
 * Hook to detect mobile devices
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to detect tablet devices
 */
export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkIsTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkIsTablet();
    window.addEventListener('resize', checkIsTablet);

    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);

  return isTablet;
}

/**
 * Hook to detect desktop devices
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return isDesktop;
}

/**
 * Get responsive grid columns based on screen size
 */
export function getResponsiveGridCols(isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return 'grid-cols-1';
  if (isTablet) return 'grid-cols-2';
  return 'grid-cols-3';
}

/**
 * Get responsive padding based on screen size
 */
export function getResponsivePadding(isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return 'p-4';
  if (isTablet) return 'p-6';
  return 'p-8';
}

/**
 * Get responsive text size based on screen size
 */
export function getResponsiveTextSize(isMobile: boolean, size: 'sm' | 'md' | 'lg' | 'xl'): string {
  if (isMobile) {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'md': return 'text-sm';
      case 'lg': return 'text-base';
      case 'xl': return 'text-lg';
      default: return 'text-sm';
    }
  }
  
  switch (size) {
    case 'sm': return 'text-sm';
    case 'md': return 'text-base';
    case 'lg': return 'text-lg';
    case 'xl': return 'text-xl';
    default: return 'text-base';
  }
}

/**
 * Get responsive button size based on screen size
 */
export function getResponsiveButtonSize(isMobile: boolean): 'sm' | 'md' | 'lg' {
  return isMobile ? 'sm' : 'md';
}

/**
 * Get responsive spacing based on screen size
 */
export function getResponsiveSpacing(isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return 'space-y-4';
  if (isTablet) return 'space-y-6';
  return 'space-y-8';
}

/**
 * Check if device supports touch
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

/**
 * Get optimal image size based on device
 */
export function getOptimalImageSize(isMobile: boolean, isTablet: boolean): { width: number; height: number } {
  if (isMobile) return { width: 200, height: 200 };
  if (isTablet) return { width: 300, height: 300 };
  return { width: 400, height: 400 };
}

/**
 * Get responsive modal size
 */
export function getResponsiveModalSize(isMobile: boolean): string {
  return isMobile ? 'w-full h-full' : 'w-full max-w-2xl';
}

/**
 * Get responsive card layout
 */
export function getResponsiveCardLayout(isMobile: boolean): string {
  return isMobile ? 'flex-col' : 'flex-row';
}

/**
 * Get responsive form layout
 */
export function getResponsiveFormLayout(isMobile: boolean): string {
  return isMobile ? 'grid-cols-1' : 'grid-cols-2';
}

/**
 * Get responsive sidebar behavior
 */
export function getResponsiveSidebarBehavior(isMobile: boolean): { 
  position: string; 
  width: string; 
  overlay: boolean 
} {
  if (isMobile) {
    return {
      position: 'fixed',
      width: 'w-full',
      overlay: true
    };
  }
  
  return {
    position: 'sticky',
    width: 'w-80',
    overlay: false
  };
}

/**
 * Get responsive navigation behavior
 */
export function getResponsiveNavigationBehavior(isMobile: boolean): {
  type: 'drawer' | 'tabs' | 'sidebar';
  orientation: 'horizontal' | 'vertical';
} {
  if (isMobile) {
    return {
      type: 'drawer',
      orientation: 'vertical'
    };
  }
  
  return {
    type: 'sidebar',
    orientation: 'vertical'
  };
}

/**
 * Get responsive table behavior
 */
export function getResponsiveTableBehavior(isMobile: boolean): {
  layout: 'table' | 'cards';
  scrollable: boolean;
} {
  if (isMobile) {
    return {
      layout: 'cards',
      scrollable: false
    };
  }
  
  return {
    layout: 'table',
    scrollable: true
  };
}

/**
 * Get responsive chart size
 */
export function getResponsiveChartSize(isMobile: boolean, isTablet: boolean): { 
  width: number; 
  height: number 
} {
  if (isMobile) return { width: 300, height: 200 };
  if (isTablet) return { width: 500, height: 300 };
  return { width: 700, height: 400 };
}

/**
 * Get responsive breakpoint classes
 */
export function getResponsiveClasses(isMobile: boolean, isTablet: boolean): {
  container: string;
  grid: string;
  text: string;
  spacing: string;
  padding: string;
} {
  return {
    container: isMobile ? 'max-w-full' : isTablet ? 'max-w-4xl' : 'max-w-6xl',
    grid: getResponsiveGridCols(isMobile, isTablet),
    text: isMobile ? 'text-sm' : 'text-base',
    spacing: getResponsiveSpacing(isMobile, isTablet),
    padding: getResponsivePadding(isMobile, isTablet)
  };
}
