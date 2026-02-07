// useLayoutConfig.jsx - Hook to manage the layout configuration dialog
import { useState, useCallback } from 'react';

/**
 * Custom hook to manage layout configuration dialog
 * @returns {Object} - Configuration state and handlers
 */
const useLayoutConfig = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const openLayoutConfig = useCallback(() => {
    setIsConfigOpen(true);
  }, []);

  const closeLayoutConfig = useCallback(() => {
    setIsConfigOpen(false);
  }, []);

  const toggleLayoutConfig = useCallback(() => {
    setIsConfigOpen(prev => !prev);
  }, []);

  return {
    isConfigOpen,
    openLayoutConfig,
    closeLayoutConfig,
    toggleLayoutConfig
  };
};

export default useLayoutConfig;
