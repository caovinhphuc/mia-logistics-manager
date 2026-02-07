import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order_itemsService } from '../services';
import type {
  Order_items,
  Order_itemsFormData,
  Order_itemsFilterParams,
} from '../types';

const QUERY_KEY = 'order_items';

/**
 * Hook to fetch all order_items
 */
export const useOrder_itemsList = (params?: Order_itemsFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => Order_itemsService.getAll(params),
  });
};

/**
 * Hook to fetch single order_items
 */
export const useOrder_items = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => Order_itemsService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create order_items
 */
export const useCreateOrder_items = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Order_itemsFormData) =>
      Order_itemsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update order_items
 */
export const useUpdateOrder_items = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order_itemsFormData> }) =>
      Order_itemsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete order_items
 */
export const useDeleteOrder_items = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Order_itemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
