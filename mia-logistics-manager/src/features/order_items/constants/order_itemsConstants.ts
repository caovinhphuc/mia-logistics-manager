export const Order_items_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const Order_items_MESSAGES = {
  CREATE_SUCCESS: 'Order_items created successfully',
  UPDATE_SUCCESS: 'Order_items updated successfully',
  DELETE_SUCCESS: 'Order_items deleted successfully',
  CREATE_ERROR: 'Failed to create order_items',
  UPDATE_ERROR: 'Failed to update order_items',
  DELETE_ERROR: 'Failed to delete order_items',
};
