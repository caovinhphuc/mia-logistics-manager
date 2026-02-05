import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'outlined';
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  return (
    <Button variant={getVariant()} {...props}>
      {children}
    </Button>
  );
};
