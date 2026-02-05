import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps } from '@mui/material';

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  return <MuiCheckbox {...props} />;
};
