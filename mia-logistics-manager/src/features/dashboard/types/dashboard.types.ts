/**
 * Dashboard Types - Logistics Metrics & Analytics
 */

// Main Dashboard Statistics
export interface DashboardStats {
  totalOrders: number
  activeDeliveries: number
  completedToday: number
  pendingItems: number
  averageDeliveryTime: number // in minutes
  onTimePercentage: number // 0-100
}

// Order Metrics
export interface OrderMetrics {
  total: number
  pending: number
  processing: number
  completed: number
  cancelled: number
  delayed: number
}

// Delivery Metrics
export interface DeliveryMetrics {
  inTransit: number
  delivered: number
  failed: number
  returnedToWarehouse: number
  averageTime: number
}

// Warehouse Metrics
export interface WarehouseMetrics {
  totalItems: number
  lowStockItems: number
  outOfStockItems: number
  utilizationRate: number // percentage
}

// Complete Dashboard Data
export interface DashboardData {
  stats: DashboardStats
  orderMetrics: OrderMetrics
  deliveryMetrics: DeliveryMetrics
  warehouseMetrics: WarehouseMetrics
  topRoutes: RoutePerformance[]
  recentOrders: RecentOrder[]
  alerts: DashboardAlert[]
}

// Route Performance
export interface RoutePerformance {
  routeId: string
  routeName: string
  completedDeliveries: number
  averageTime: number
  successRate: number
}

// Recent Order Summary
export interface RecentOrder {
  orderId: string
  customerName: string
  status: OrderStatus
  destination: string
  estimatedDelivery: string
}

// Alert Types
export interface DashboardAlert {
  id: string
  type: AlertType
  title: string
  message: string
  severity: AlertSeverity
  timestamp: string
  actionUrl?: string
}

export type AlertType = 'delivery' | 'inventory' | 'vehicle' | 'system'
export type AlertSeverity = 'info' | 'warning' | 'error'
export type OrderStatus = 'pending' | 'processing' | 'in_transit' | 'delivered' | 'failed'

// Filter & Query Params
export interface DashboardFilterParams {
  dateRange?: {
    startDate: string
    endDate: string
  }
  warehouseId?: string
  region?: string
}
