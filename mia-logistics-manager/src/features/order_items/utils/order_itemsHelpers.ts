import type { Order_items } from '../types';

/**
 * Format order_items name
 */
export const formatOrder_itemsName = (order_items: Order_items): string => {
  return order_items.name.toUpperCase();
};

/**
 * Check if order_items is active
 */
export const isOrder_itemsActive = (order_items: Order_items): boolean => {
  return order_items.status === 'active';
};
