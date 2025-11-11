import type { Invoices } from '../types';

/**
 * Format invoices name
 */
export const formatInvoicesName = (invoices: Invoices): string => {
  return invoices.name.toUpperCase();
};

/**
 * Check if invoices is active
 */
export const isInvoicesActive = (invoices: Invoices): boolean => {
  return invoices.status === 'active';
};
