import { useState, useEffect } from 'react';

interface ViewportInfo {
  height: number;
  offsetTop: number;
}

/**
 * Simple hook to track visual viewport changes (keyboard open/close on mobile)
 * Returns viewport height and offset top for adjusting layout
 */
export function useKeyboardViewport(): ViewportInfo {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>(() => {
    // Initialize with current values
    if (typeof window !== 'undefined' && window.visualViewport) {
      return {
        height: window.visualViewport.height,
        offsetTop: window.visualViewport.offsetTop,
      };
    }
    return {
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
      offsetTop: 0,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      // Fallback for browsers without visualViewport support
      const updateFromWindow = () => {
        setViewportInfo({
          height: window.innerHeight,
          offsetTop: 0,
        });
      };

      window.addEventListener('resize', updateFromWindow);
      updateFromWindow();

      return () => {
        window.removeEventListener('resize', updateFromWindow);
      };
    }

    const updateViewport = () => {
      setViewportInfo({
        height: window.visualViewport!.height,
        offsetTop: window.visualViewport!.offsetTop,
      });
    };

    // Initialize
    updateViewport();

    // Listen to viewport changes
    window.visualViewport.addEventListener('resize', updateViewport);
    window.visualViewport.addEventListener('scroll', updateViewport);

    return () => {
      window.visualViewport!.removeEventListener('resize', updateViewport);
      window.visualViewport!.removeEventListener('scroll', updateViewport);
    };
  }, []);

  return viewportInfo;
}

