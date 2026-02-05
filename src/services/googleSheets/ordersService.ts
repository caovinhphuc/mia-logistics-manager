// src/services/googleSheets/ordersService.ts
import { SHEETS_CONFIG } from '../../config/sheetsConfig';
import { v4 as uuidv4 } from 'uuid';
import { BaseGoogleSheetsService } from './baseService';

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoordinates?: string;
  deliveryCoordinates?: string;
  carrierId?: string;
  carrierName?: string;
  totalWeight: number;
  totalVolume: number;
  packageCount: number;
  serviceLevel: string;
  estimatedCost?: number;
  actualCost?: number;
  distance?: number;
  estimatedDuration?: number;
  status: 'PENDING' | 'CONFIRMED' | 'PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  scheduledPickup?: string;
  scheduledDelivery?: string;
  actualPickup?: string;
  actualDelivery?: string;
}

export class OrdersService extends BaseGoogleSheetsService {
  async createOrder(orderData: Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      orderId: `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.addRecord(SHEETS_CONFIG.SHEETS.ORDERS, order as unknown as Record<string, unknown>);
    return order as unknown as Order;
  }

  async getOrders(limit?: number): Promise<Order[]> {
    return this.getRecords<Order>(SHEETS_CONFIG.SHEETS.ORDERS, limit);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((order) => order.orderId === orderId) || null;
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    return this.updateRecord(
      SHEETS_CONFIG.SHEETS.ORDERS,
      orderId,
      'orderId',
      updates as unknown as Record<string, unknown>
    ) as unknown as Promise<Order>;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return this.updateOrder(orderId, { status });
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    return this.deleteRecord(SHEETS_CONFIG.SHEETS.ORDERS, orderId, 'orderId');
  }

  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter((order) => order.status === status);
  }

  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
  }
}
