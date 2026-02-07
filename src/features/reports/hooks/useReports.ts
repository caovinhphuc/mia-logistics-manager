import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportsService } from '../services';
import type {
  Reports,
  ReportsFormData,
  ReportsFilterParams,
} from '../types';

const QUERY_KEY = 'reports';

/**
 * Hook to fetch all reports
 */
export const useReportsList = (params?: ReportsFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => ReportsService.getAll(params),
  });
};

/**
 * Hook to fetch single reports
 */
export const useReports = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => ReportsService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create reports
 */
export const useCreateReports = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReportsFormData) =>
      ReportsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update reports
 */
export const useUpdateReports = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReportsFormData> }) =>
      ReportsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete reports
 */
export const useDeleteReports = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReportsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
