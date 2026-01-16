/**
 * Activity Monitor Hook
 * Theo dõi hoạt động người dùng để reset session timer
 */

import { useEffect, useCallback, useRef } from 'react';
import sessionManager from '../services/sessionManager';

/**
 * useActivityMonitor Hook
 * Monitor user activities and update session
 */
const useActivityMonitor = (enabled = true) => {
  const isEnabled = useRef(enabled);

  useEffect(() => {
    isEnabled.current = enabled;
  }, [enabled]);

  const updateActivity = useCallback(() => {
    if (isEnabled.current) {
      sessionManager.updateActivity();
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // List of events to monitor
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Throttle function to avoid too many updates
    let throttleTimer = null;
    const throttledUpdate = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 30000); // Update every 30 seconds at most
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, throttledUpdate, { passive: true });
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, throttledUpdate);
      });
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [enabled, updateActivity]);

  return { updateActivity };
};

export default useActivityMonitor;
