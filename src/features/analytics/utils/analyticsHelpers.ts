import type { Analytics } from '../types';

/**
 * Format analytics name
 */
export const formatAnalyticsName = (analytics: Analytics): string => {
  return analytics.name.toUpperCase();
};

/**
 * Check if analytics is active
 */
export const isAnalyticsActive = (analytics: Analytics): boolean => {
  return analytics.status === 'active';
};
