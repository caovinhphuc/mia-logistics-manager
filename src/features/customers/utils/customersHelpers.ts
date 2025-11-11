import type { Customers } from '../types';

/**
 * Format customers name
 */
export const formatCustomersName = (customers: Customers): string => {
  return customers.name.toUpperCase();
};

/**
 * Check if customers is active
 */
export const isCustomersActive = (customers: Customers): boolean => {
  return customers.status === 'active';
};
