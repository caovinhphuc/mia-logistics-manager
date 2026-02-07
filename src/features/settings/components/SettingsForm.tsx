import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateSettings } from '../hooks';
import type { SettingsFormData } from '../types';

export const SettingsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>();
  const { mutate: create, isPending } = useCreateSettings();

  const onSubmit = (data: SettingsFormData) => {
    create(data, {
      onSuccess: () => {
        alert('Settings created successfully!');
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
        {isPending ? 'Creating...' : 'Create Settings'}
      </Button>
    </Box>
  );
};
