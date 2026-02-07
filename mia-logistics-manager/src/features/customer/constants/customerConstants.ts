export const Customer_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const Customer_MESSAGES = {
  CREATE_SUCCESS: 'Customer created successfully',
  UPDATE_SUCCESS: 'Customer updated successfully',
  DELETE_SUCCESS: 'Customer deleted successfully',
  CREATE_ERROR: 'Failed to create customer',
  UPDATE_ERROR: 'Failed to update customer',
  DELETE_ERROR: 'Failed to delete customer',
};
