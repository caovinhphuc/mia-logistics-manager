import type { Reports } from '../types';

/**
 * Format reports name
 */
export const formatReportsName = (reports: Reports): string => {
  return reports.name.toUpperCase();
};

/**
 * Check if reports is active
 */
export const isReportsActive = (reports: Reports): boolean => {
  return reports.status === 'active';
};
