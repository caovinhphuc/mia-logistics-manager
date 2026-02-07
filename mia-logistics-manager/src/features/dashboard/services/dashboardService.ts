import { apiService } from '../../../services'
import type {
  DashboardAlert,
  DashboardData,
  DashboardFilterParams,
  DeliveryMetrics,
  OrderMetrics,
  WarehouseMetrics,
} from '../types'

export class DashboardService {
  private static BASE_URL = '/api/dashboard'

  /**
   * Get complete dashboard data with fallback to mock data
   */
  static async getDashboardData(params?: DashboardFilterParams): Promise<DashboardData> {
    try {
      const response = await apiService.get<{ data: DashboardData }>(`${this.BASE_URL}`, { params })
      return (response as any).data || this.getMockDashboardData()
    } catch (error) {
      console.warn('Failed to fetch dashboard data, using mock data:', error)
      return this.getMockDashboardData()
    }
  }

  /**
   * Get order metrics with fallback to mock data
   */
  static async getOrderMetrics(params?: DashboardFilterParams): Promise<OrderMetrics> {
    try {
      const response = await apiService.get<{ data: OrderMetrics }>(
        `${this.BASE_URL}/metrics/orders`,
        { params }
      )
      return (response as any).data || this.getMockOrderMetrics()
    } catch (error) {
      console.warn('Failed to fetch order metrics, using mock data:', error)
      return this.getMockOrderMetrics()
    }
  }

  /**
   * Get delivery metrics with fallback to mock data
   */
  static async getDeliveryMetrics(params?: DashboardFilterParams): Promise<DeliveryMetrics> {
    try {
      const response = await apiService.get<{ data: DeliveryMetrics }>(
        `${this.BASE_URL}/metrics/deliveries`,
        { params }
      )
      return (response as any).data || this.getMockDeliveryMetrics()
    } catch (error) {
      console.warn('Failed to fetch delivery metrics, using mock data:', error)
      return this.getMockDeliveryMetrics()
    }
  }

  /**
   * Get warehouse metrics with fallback to mock data
   */
  static async getWarehouseMetrics(params?: DashboardFilterParams): Promise<WarehouseMetrics> {
    try {
      const response = await apiService.get<{ data: WarehouseMetrics }>(
        `${this.BASE_URL}/metrics/warehouse`,
        { params }
      )
      return (response as any).data || this.getMockWarehouseMetrics()
    } catch (error) {
      console.warn('Failed to fetch warehouse metrics, using mock data:', error)
      return this.getMockWarehouseMetrics()
    }
  }

  /**
   * Get active alerts with fallback to mock data
   */
  static async getAlerts(): Promise<DashboardAlert[]> {
    try {
      const response = await apiService.get<{ data: DashboardAlert[] }>(`${this.BASE_URL}/alerts`)
      return (response as any).data || this.getMockAlerts()
    } catch (error) {
      console.warn('Failed to fetch alerts, using mock data:', error)
      return this.getMockAlerts()
    }
  }

  /**
   * Dismiss alert
   */
  static async dismissAlert(alertId: string): Promise<void> {
    try {
      await apiService.delete(`${this.BASE_URL}/alerts/${alertId}`)
    } catch (error) {
      console.error('Failed to dismiss alert:', error)
      throw error
    }
  }

  // ========================================
  // MOCK DATA FOR DEVELOPMENT
  // ========================================

  private static getMockDashboardData(): DashboardData {
    return {
      stats: {
        totalOrders: 248,
        activeDeliveries: 32,
        completedToday: 85,
        pendingItems: 156,
        averageDeliveryTime: 45,
        onTimePercentage: 94,
      },
      orderMetrics: this.getMockOrderMetrics(),
      deliveryMetrics: this.getMockDeliveryMetrics(),
      warehouseMetrics: this.getMockWarehouseMetrics(),
      topRoutes: [
        {
          routeId: 'route-001',
          routeName: 'Hà Nội - Hải Phòng',
          completedDeliveries: 156,
          averageTime: 120,
          successRate: 98,
        },
        {
          routeId: 'route-002',
          routeName: 'Hà Nội - Hưng Yên',
          completedDeliveries: 142,
          averageTime: 60,
          successRate: 96,
        },
      ],
      recentOrders: [
        {
          orderId: 'ORD-001',
          customerName: 'Công ty ABC',
          status: 'delivered',
          destination: 'Hà Nội',
          estimatedDelivery: '2026-02-08 14:30',
        },
        {
          orderId: 'ORD-002',
          customerName: 'Cửa hàng XYZ',
          status: 'in_transit',
          destination: 'Hải Phòng',
          estimatedDelivery: '2026-02-08 16:45',
        },
        {
          orderId: 'ORD-003',
          customerName: 'Nhà máy DEF',
          status: 'pending',
          destination: 'Hưng Yên',
          estimatedDelivery: '2026-02-09 09:00',
        },
      ],
      alerts: this.getMockAlerts(),
    }
  }

  private static getMockOrderMetrics(): OrderMetrics {
    return {
      total: 248,
      pending: 32,
      processing: 48,
      completed: 156,
      cancelled: 8,
      delayed: 4,
    }
  }

  private static getMockDeliveryMetrics(): DeliveryMetrics {
    return {
      inTransit: 28,
      delivered: 156,
      failed: 3,
      returnedToWarehouse: 5,
      averageTime: 45,
    }
  }

  private static getMockWarehouseMetrics(): WarehouseMetrics {
    return {
      totalItems: 5432,
      lowStockItems: 24,
      outOfStockItems: 3,
      utilizationRate: 76,
    }
  }

  private static getMockAlerts(): DashboardAlert[] {
    return [
      {
        id: 'alert-001',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Item SKU-123 is running low. Current stock: 5 units',
        severity: 'warning',
        timestamp: new Date().toISOString(),
        actionUrl: '/inventory/sku-123',
      },
      {
        id: 'alert-002',
        type: 'delivery',
        title: 'Delayed Delivery',
        message: 'Order ORD-045 is delayed by 30 minutes. Est. delivery: 15:45',
        severity: 'warning',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
    ]
  }
}
