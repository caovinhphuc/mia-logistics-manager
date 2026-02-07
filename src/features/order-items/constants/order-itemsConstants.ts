export const Order-items_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const Order-items_MESSAGES = {
  CREATE_SUCCESS: 'OrderUitems created successfully',
  UPDATE_SUCCESS: 'OrderUitems updated successfully',
  DELETE_SUCCESS: 'OrderUitems deleted successfully',
  CREATE_ERROR: 'Failed to create order-items',
  UPDATE_ERROR: 'Failed to update order-items',
  DELETE_ERROR: 'Failed to delete order-items',
};
