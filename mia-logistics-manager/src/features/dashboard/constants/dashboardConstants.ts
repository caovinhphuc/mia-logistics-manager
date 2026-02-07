export const Dashboard_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const Dashboard_MESSAGES = {
  CREATE_SUCCESS: 'Dashboard created successfully',
  UPDATE_SUCCESS: 'Dashboard updated successfully',
  DELETE_SUCCESS: 'Dashboard deleted successfully',
  CREATE_ERROR: 'Failed to create dashboard',
  UPDATE_ERROR: 'Failed to update dashboard',
  DELETE_ERROR: 'Failed to delete dashboard',
};
