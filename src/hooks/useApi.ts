import { useCallback, useEffect, useState } from "react";
import apiService from "../services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {},
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = true, onSuccess, onError } = options;

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(errorMessage);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    refetch: execute,
  };
}

// Specific hooks for common API calls
export function useLocations(spreadsheetId?: string) {
  return useApi(() => apiService.getLocations(spreadsheetId));
}

export function useCarriers() {
  return useApi(() => apiService.getCarriers());
}

export function useShipments() {
  return useApi(() => apiService.getShipments());
}

// Mutation hook for API calls that modify data
export function useApiMutation<T, P = any>(
  apiCall: (params: P) => Promise<T>,
  options: UseApiOptions = {},
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { onSuccess, onError } = options;

  const mutate = useCallback(
    async (params: P) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await apiCall(params);
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
        return data;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "Đã xảy ra lỗi";
        setState({ data: null, loading: false, error: errorMessage });
        onError?.(errorMessage);
        throw error;
      }
    },
    [apiCall, onSuccess, onError],
  );

  return {
    ...state,
    mutate,
  };
}
