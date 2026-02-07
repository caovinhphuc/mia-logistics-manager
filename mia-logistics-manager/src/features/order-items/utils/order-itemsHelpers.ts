import type { OrderUitems } from '../types';

/**
 * Format order-items name
 */
export const formatOrderUitemsName = (order-items: OrderUitems): string => {
  return order-items.name.toUpperCase();
};

/**
 * Check if order-items is active
 */
export const isOrderUitemsActive = (order-items: OrderUitems): boolean => {
  return order-items.status === 'active';
};
