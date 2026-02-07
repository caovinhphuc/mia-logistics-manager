import type { Settings } from '../types';

/**
 * Format settings name
 */
export const formatSettingsName = (settings: Settings): string => {
  return settings.name.toUpperCase();
};

/**
 * Check if settings is active
 */
export const isSettingsActive = (settings: Settings): boolean => {
  return settings.status === 'active';
};
