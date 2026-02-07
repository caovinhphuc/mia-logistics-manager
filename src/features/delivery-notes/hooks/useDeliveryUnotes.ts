import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliveryUnotesService } from '../services';
import type {
  DeliveryUnotes,
  DeliveryUnotesFormData,
  DeliveryUnotesFilterParams,
} from '../types';

const QUERY_KEY = 'delivery-notes';

/**
 * Hook to fetch all delivery-notes
 */
export const useDeliveryUnotesList = (params?: DeliveryUnotesFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => DeliveryUnotesService.getAll(params),
  });
};

/**
 * Hook to fetch single delivery-notes
 */
export const useDeliveryUnotes = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => DeliveryUnotesService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create delivery-notes
 */
export const useCreateDeliveryUnotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeliveryUnotesFormData) =>
      DeliveryUnotesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update delivery-notes
 */
export const useUpdateDeliveryUnotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryUnotesFormData> }) =>
      DeliveryUnotesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete delivery-notes
 */
export const useDeleteDeliveryUnotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeliveryUnotesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
