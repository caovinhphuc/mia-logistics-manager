import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomerService } from '../services';
import type {
  Customer,
  CustomerFormData,
  CustomerFilterParams,
} from '../types';

const QUERY_KEY = 'customer';

/**
 * Hook to fetch all customer
 */
export const useCustomerList = (params?: CustomerFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => CustomerService.getAll(params),
  });
};

/**
 * Hook to fetch single customer
 */
export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => CustomerService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) =>
      CustomerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerFormData> }) =>
      CustomerService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CustomerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
