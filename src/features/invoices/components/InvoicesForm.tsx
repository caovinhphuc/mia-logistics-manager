import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { useCreateInvoices } from '../hooks';
import type { InvoicesFormData } from '../types';

export const InvoicesForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoicesFormData>();
  const { mutate: create, isPending } = useCreateInvoices();

  const onSubmit = (data: InvoicesFormData) => {
    create(data, {
      onSuccess: () => {
        alert('Invoices created successfully!');
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
        {isPending ? 'Creating...' : 'Create Invoices'}
      </Button>
    </Box>
  );
};
