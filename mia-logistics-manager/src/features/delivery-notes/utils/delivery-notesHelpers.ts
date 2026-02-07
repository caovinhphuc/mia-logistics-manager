import type { DeliveryUnotes } from '../types';

/**
 * Format delivery-notes name
 */
export const formatDeliveryUnotesName = (delivery-notes: DeliveryUnotes): string => {
  return delivery-notes.name.toUpperCase();
};

/**
 * Check if delivery-notes is active
 */
export const isDeliveryUnotesActive = (delivery-notes: DeliveryUnotes): boolean => {
  return delivery-notes.status === 'active';
};
