import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService } from '../services';
import type { SettingsFormData, SettingsFilterParams } from '../types';

const QUERY_KEY = 'settings';

/**
 * Hook to fetch all settings
 */
export const useSettingsList = (params?: SettingsFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => SettingsService.getAll(params),
  });
};

/**
 * Hook to fetch single settings
 */
export const useSettings = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => SettingsService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create settings
 */
export const useCreateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SettingsFormData) => SettingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

/**
 * Hook to update settings
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SettingsFormData> }) =>
      SettingsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

/**
 * Hook to delete settings
 */
export const useDeleteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SettingsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
