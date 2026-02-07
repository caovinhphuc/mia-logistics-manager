export const Customers_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const Customers_MESSAGES = {
  CREATE_SUCCESS: 'Customers created successfully',
  UPDATE_SUCCESS: 'Customers updated successfully',
  DELETE_SUCCESS: 'Customers deleted successfully',
  CREATE_ERROR: 'Failed to create customers',
  UPDATE_ERROR: 'Failed to update customers',
  DELETE_ERROR: 'Failed to delete customers',
};
