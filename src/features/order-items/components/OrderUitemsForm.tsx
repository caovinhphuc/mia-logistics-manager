import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateOrderUitems } from '../hooks';
import type { OrderUitemsFormData } from '../types';

export const OrderUitemsForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OrderUitemsFormData>();
  const { mutate: create, isPending } = useCreateOrderUitems();

  const onSubmit = (data: OrderUitemsFormData) => {
    create(data, {
      onSuccess: () => {
        alert('OrderUitems created successfully!');
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
        {isPending ? 'Creating...' : 'Create OrderUitems'}
      </Button>
    </Box>
  );
};
