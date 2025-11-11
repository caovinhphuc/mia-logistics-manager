export const Reports_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const Reports_MESSAGES = {
  CREATE_SUCCESS: 'Reports created successfully',
  UPDATE_SUCCESS: 'Reports updated successfully',
  DELETE_SUCCESS: 'Reports deleted successfully',
  CREATE_ERROR: 'Failed to create reports',
  UPDATE_ERROR: 'Failed to update reports',
  DELETE_ERROR: 'Failed to delete reports',
};
