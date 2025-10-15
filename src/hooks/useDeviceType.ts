import { useCallback, useEffect, useRef, useState } from 'react';

interface DeviceTypeRefs {
  isMobile: Readonly<boolean>;
  isDesktop: Readonly<boolean>;
  cleanupDeviceTypeListener: () => void;
}

const MOBILE_BREAKPOINT_QUERY = '(max-width: 768px)';

/**
 * React hook that provides booleans indicating whether the client is on a
 * mobile or desktop view based on a breakpoint. The media query listener is
 * initialized once on mount; it is not created during render so it cannot
 * trigger state updates during render.
 */
export function useDeviceType(): DeviceTypeRefs {
  const [isMobileMatch, setMobileMatch] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
    }
    return false;
  });

  // Keep MQL and the listener in refs so they persist across renders without
  // changing the hook's behavior or causing re-renders.
  const mqlRef = useRef<MediaQueryList | null>(null);
  const listenerRef = useRef<((e: MediaQueryListEvent) => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    const mql = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    mqlRef.current = mql;

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      // Support both event and direct MediaQueryList object
      const matches = 'matches' in e ? e.matches : mql.matches;
      setMobileMatch(Boolean(matches));
    };

    listenerRef.current = handler as (e: MediaQueryListEvent) => void;

    // Ensure state reflects current value
    setMobileMatch(mql.matches);

    // Add listener (use modern API if available, fallback to addListener)
    if ('addEventListener' in mql) {
      mql.addEventListener('change', handler as EventListener);
    } else {
      // Older browsers: use legacy addListener if available
      type LegacyMql = { addListener?: (h: (e: MediaQueryListEvent) => void) => void };
      const legacy = mql as unknown as LegacyMql;
      if (legacy.addListener) legacy.addListener(handler);
    }

    return () => {
      const current = mqlRef.current;
      if (current) {
        if ('removeEventListener' in current) {
          current.removeEventListener('change', handler as EventListener);
        } else {
          type LegacyMql = { removeListener?: (h: (e: MediaQueryListEvent) => void) => void };
          const legacyCurrent = current as unknown as LegacyMql;
          if (legacyCurrent.removeListener) legacyCurrent.removeListener(handler);
        }
        mqlRef.current = null;
      }
    };
  }, []);

  const cleanupDeviceTypeListener = useCallback(() => {
    const current = mqlRef.current;
    const listener = listenerRef.current;
    if (current && listener) {
      if ('removeEventListener' in current) {
        current.removeEventListener('change', listener as EventListener);
      } else {
        type LegacyMql = { removeListener?: (h: (e: MediaQueryListEvent) => void) => void };
        const legacyCurrent = current as unknown as LegacyMql;
        if (legacyCurrent.removeListener) legacyCurrent.removeListener(listener);
      }
      mqlRef.current = null;
    }
  }, []);

  return {
    isMobile: isMobileMatch,
    isDesktop: !isMobileMatch,
    cleanupDeviceTypeListener,
  };
}
