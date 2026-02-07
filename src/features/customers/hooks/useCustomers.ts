import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomersService } from '../services';
import type {
  Customers,
  CustomersFormData,
  CustomersFilterParams,
} from '../types';

const QUERY_KEY = 'customers';

/**
 * Hook to fetch all customers
 */
export const useCustomersList = (params?: CustomersFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => CustomersService.getAll(params),
  });
};

/**
 * Hook to fetch single customers
 */
export const useCustomers = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => CustomersService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create customers
 */
export const useCreateCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomersFormData) =>
      CustomersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update customers
 */
export const useUpdateCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomersFormData> }) =>
      CustomersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete customers
 */
export const useDeleteCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CustomersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
