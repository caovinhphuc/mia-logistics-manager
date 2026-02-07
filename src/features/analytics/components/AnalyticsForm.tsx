import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateAnalytics } from '../hooks';
import type { AnalyticsFormData } from '../types';

export const AnalyticsForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<AnalyticsFormData>();
  const { mutate: create, isPending } = useCreateAnalytics();

  const onSubmit = (data: AnalyticsFormData) => {
    create(data, {
      onSuccess: () => {
        alert('Analytics created successfully!');
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
        {isPending ? 'Creating...' : 'Create Analytics'}
      </Button>
    </Box>
  );
};
