import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateOrder_items } from '../hooks';
import type { Order_itemsFormData } from '../types';

export const Order_itemsForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Order_itemsFormData>();
  const { mutate: create, isPending } = useCreateOrder_items();

  const onSubmit = (data: Order_itemsFormData) => {
    create(data, {
      onSuccess: () => {
        alert('Order_items created successfully!');
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
        {isPending ? 'Creating...' : 'Create Order_items'}
      </Button>
    </Box>
  );
};
