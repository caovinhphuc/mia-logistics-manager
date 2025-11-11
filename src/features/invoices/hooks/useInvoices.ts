import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InvoicesService } from '../services';
import type {
  Invoices,
  InvoicesFormData,
  InvoicesFilterParams,
} from '../types';

const QUERY_KEY = 'invoices';

/**
 * Hook to fetch all invoices
 */
export const useInvoicesList = (params?: InvoicesFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => InvoicesService.getAll(params),
  });
};

/**
 * Hook to fetch single invoices
 */
export const useInvoices = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => InvoicesService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create invoices
 */
export const useCreateInvoices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoicesFormData) =>
      InvoicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update invoices
 */
export const useUpdateInvoices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InvoicesFormData> }) =>
      InvoicesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete invoices
 */
export const useDeleteInvoices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => InvoicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
