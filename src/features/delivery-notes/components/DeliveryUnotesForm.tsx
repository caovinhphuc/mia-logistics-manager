import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateDeliveryUnotes } from '../hooks';
import type { DeliveryUnotesFormData } from '../types';

export const DeliveryUnotesForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryUnotesFormData>();
  const { mutate: create, isPending } = useCreateDeliveryUnotes();

  const onSubmit = (data: DeliveryUnotesFormData) => {
    create(data, {
      onSuccess: () => {
        alert('DeliveryUnotes created successfully!');
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
        {isPending ? 'Creating...' : 'Create DeliveryUnotes'}
      </Button>
    </Box>
  );
};
