import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateReports } from '../hooks';
import type { ReportsFormData } from '../types';

export const ReportsForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportsFormData>();
  const { mutate: create, isPending } = useCreateReports();

  const onSubmit = (data: ReportsFormData) => {
    create(data, {
      onSuccess: () => {
        alert('Reports created successfully!');
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
        {isPending ? 'Creating...' : 'Create Reports'}
      </Button>
    </Box>
  );
};
