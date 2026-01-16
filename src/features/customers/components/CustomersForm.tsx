import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateCustomers } from '../hooks';
import type { CustomersFormData } from '../types';

export const CustomersForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomersFormData>();
  const { mutate: create, isPending } = useCreateCustomers();

  const onSubmit = (data: CustomersFormData) => {
    create(data, {
      onSuccess: () => {
        alert('Customers created successfully!');
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        fullWidth
        {...register('name', { required: 'Name is required' })}
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Customers'}
      </Button>
    </Box>
  );
};
