import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderUitemsService } from '../services';
import type {
  OrderUitems,
  OrderUitemsFormData,
  OrderUitemsFilterParams,
} from '../types';

const QUERY_KEY = 'order-items';

/**
 * Hook to fetch all order-items
 */
export const useOrderUitemsList = (params?: OrderUitemsFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => OrderUitemsService.getAll(params),
  });
};

/**
 * Hook to fetch single order-items
 */
export const useOrderUitems = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => OrderUitemsService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create order-items
 */
export const useCreateOrderUitems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderUitemsFormData) =>
      OrderUitemsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update order-items
 */
export const useUpdateOrderUitems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OrderUitemsFormData> }) =>
      OrderUitemsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete order-items
 */
export const useDeleteOrderUitems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => OrderUitemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
