import { useQuery } from '@tanstack/react-query'
import { DashboardService } from '../services'
import type { DashboardFilterParams } from '../types'

const QUERY_KEYS = {
  all: ['dashboard'] as const,
  main: ['dashboard', 'main'] as const,
  metrics: ['dashboard', 'metrics'] as const,
  alerts: ['dashboard', 'alerts'] as const,
}

/**
 * Hook to fetch complete dashboard data
 */
export const useDashboardData = (params?: DashboardFilterParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.main, params],
    queryFn: () => DashboardService.getDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

/**
 * Hook to fetch order metrics
 */
export const useOrderMetrics = (params?: DashboardFilterParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.metrics, 'orders', params],
    queryFn: () => DashboardService.getOrderMetrics(params),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch delivery metrics
 */
export const useDeliveryMetrics = (params?: DashboardFilterParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.metrics, 'deliveries', params],
    queryFn: () => DashboardService.getDeliveryMetrics(params),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch warehouse metrics
 */
export const useWarehouseMetrics = (params?: DashboardFilterParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.metrics, 'warehouse', params],
    queryFn: () => DashboardService.getWarehouseMetrics(params),
    staleTime: 10 * 60 * 1000, // 10 minutes (less frequent updates)
  })
}

/**
 * Hook to fetch active alerts
 */
export const useDashboardAlerts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.alerts,
    queryFn: () => DashboardService.getAlerts(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  })
}
