export const Invoices_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const Invoices_MESSAGES = {
  CREATE_SUCCESS: 'Invoices created successfully',
  UPDATE_SUCCESS: 'Invoices updated successfully',
  DELETE_SUCCESS: 'Invoices deleted successfully',
  CREATE_ERROR: 'Failed to create invoices',
  UPDATE_ERROR: 'Failed to update invoices',
  DELETE_ERROR: 'Failed to delete invoices',
};
