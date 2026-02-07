import { useState, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { success, error: showErrorToast } = useToast();

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);

        if (response.success) {
          setState({
            data: response.data || response,
            loading: false,
            error: null,
          });

          if (options?.showSuccessToast && response.message) {
            success('Success', response.message);
          }

          options?.onSuccess?.(response.data || response);
          return response.data || response;
        } else {
          const errorMessage = response.error || 'Operation failed';
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          });

          if (options?.showErrorToast !== false) {
            showErrorToast('Error', errorMessage);
          }

          options?.onError?.(errorMessage);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        if (options?.showErrorToast !== false) {
          showErrorToast('Error', errorMessage);
        }

        options?.onError?.(errorMessage);
        return null;
      }
    },
    [apiFunction, options, success, showErrorToast]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useOrders() {
  return useApi(
    (filters?: any) => import('../services/googleSheetsApi').then(({ googleSheetsApi }) =>
      googleSheetsApi.getOrders(filters)
    )
  );
}

export function useEmployees() {
  return useApi(
    () => import('../services/googleSheetsApi').then(({ googleSheetsApi }) =>
      googleSheetsApi.getEmployees()
    )
  );
}

export function useActivities() {
  return useApi(
    (filters?: any) => import('../services/googleSheetsApi').then(({ googleSheetsApi }) =>
      googleSheetsApi.getActivities(filters)
    )
  );
}
