import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateCustomer } from '../hooks';
import type { CustomerFormData } from '../types';

export const CustomerForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>();
  const { mutate: create, isPending } = useCreateCustomer();

  const onSubmit = (data: CustomerFormData) => {
    create(data, {
      onSuccess: () => {
        alert('Customer created successfully!');
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

      <Button
        type="submit"
        variant="contained"
        disabled={isPending}
      >
        {isPending ? 'Creating...' : 'Create Customer'}
      </Button>
    </Box>
  );
};
