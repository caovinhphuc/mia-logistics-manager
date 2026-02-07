import type { Customer } from '../types';

/**
 * Format customer name
 */
export const formatCustomerName = (customer: Customer): string => {
  return customer.name.toUpperCase();
};

/**
 * Check if customer is active
 */
export const isCustomerActive = (customer: Customer): boolean => {
  return customer.status === 'active';
};
