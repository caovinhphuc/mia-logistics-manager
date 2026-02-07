import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalyticsService } from '../services';
import type {
  Analytics,
  AnalyticsFormData,
  AnalyticsFilterParams,
} from '../types';

const QUERY_KEY = 'analytics';

/**
 * Hook to fetch all analytics
 */
export const useAnalyticsList = (params?: AnalyticsFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => AnalyticsService.getAll(params),
  });
};

/**
 * Hook to fetch single analytics
 */
export const useAnalytics = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => AnalyticsService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create analytics
 */
export const useCreateAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnalyticsFormData) =>
      AnalyticsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update analytics
 */
export const useUpdateAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AnalyticsFormData> }) =>
      AnalyticsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete analytics
 */
export const useDeleteAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AnalyticsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
