import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status:
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'active'
    | 'inactive'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'small' | 'medium';
  label?: string;
}

export function StatusChip({ status, size = 'small', ...props }: StatusChipProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xử lý',
          color: 'warning' as const,
        };
      case 'in_progress':
        return {
          label: 'Đang xử lý',
          color: 'info' as const,
        };
      case 'completed':
        return {
          label: 'Hoàn thành',
          color: 'success' as const,
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'error' as const,
        };
      case 'active':
        return {
          label: 'Hoạt động',
          color: 'success' as const,
        };
      case 'inactive':
        return {
          label: 'Tạm dừng',
          color: 'default' as const,
        };
      case 'primary':
        return {
          label: props.label || 'Primary',
          color: 'primary' as const,
        };
      case 'secondary':
        return {
          label: props.label || 'Secondary',
          color: 'secondary' as const,
        };
      case 'info':
        return {
          label: props.label || 'Info',
          color: 'info' as const,
        };
      case 'success':
        return {
          label: props.label || 'Success',
          color: 'success' as const,
        };
      case 'warning':
        return {
          label: props.label || 'Warning',
          color: 'warning' as const,
        };
      case 'error':
        return {
          label: props.label || 'Error',
          color: 'error' as const,
        };
      default:
        return {
          label: props.label || status,
          color: 'default' as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={props.label || config.label}
      color={config.color}
      size={size}
      variant="outlined"
      {...props}
    />
  );
}
