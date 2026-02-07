interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Order {
  id: string;
  platform: string;
  createdAt: string;
  deadline: string;
  sla: 'P1' | 'P2' | 'P3' | 'P4';
  priority: number;
  timeRemaining: string;
  productCode: string;
  productDetails: string;
  quantity: number;
  location: string;
  complexity: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'processing' | 'completed';
  shippingProvider: string;
  assignedTo?: number;
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  role: 'senior' | 'regular' | 'junior';
  status: 'active' | 'inactive';
  skills: string[];
  performance: number;
  slaRate: number;
  maxLoad: number;
  currentLoad: number;
  area: string;
  avatar?: string;
  notes?: string;
}

export interface Activity {
  timestamp: string;
  orderId: string;
  activityType: string;
  employeeId: number;
  employeeName: string;
  notes: string;
}

class GoogleSheetsApiService {
  private baseUrl: string;
  private isDevelopment: boolean;

  constructor() {
    // URL Google Apps Script Web App của bạn
    this.baseUrl = 'https://script.google.com/macros/s/AKfycbwXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private async makeRequest<T>(params: Record<string, any>): Promise<ApiResponse<T>> {
    // Mock data for development
    if (this.isDevelopment) {
      return this.getMockResponse<T>(params);
    }

    try {
      const url = new URL(this.baseUrl);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async getMockResponse<T>(params: Record<string, any>): Promise<ApiResponse<T>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const { action } = params;

    switch (action) {
      case 'getOrders':
        return {
          success: true,
          data: this.getMockOrders(params) as T
        };

      case 'getEmployees':
        return {
          success: true,
          data: this.getMockEmployees() as T
        };

      case 'getActivities':
        return {
          success: true,
          data: this.getMockActivities() as T
        };

      case 'updateOrderStatus':
        return {
          success: true,
          message: `Order ${params.orderId} status updated to ${params.status}`
        };

      case 'assignOrder':
        return {
          success: true,
          message: `Order ${params.orderId} assigned to employee ${params.employeeId}`
        };

      case 'autoAssignOrders':
        return {
          success: true,
          message: 'Auto-assigned 5 orders successfully',
          data: { totalAssigned: 5 } as T
        };

      case 'logActivity':
        return {
          success: true,
          message: 'Activity logged successfully'
        };

      default:
        return {
          success: false,
          error: 'Invalid action'
        };
    }
  }

  private getMockOrders(filters: any): Order[] {
    const now = new Date();
    const orders: Order[] = [
      {
        id: 'SO09032025:0845553',
        platform: 'Shopee',
        createdAt: now.toISOString(),
        deadline: new Date(now.getTime() + 2*60*60*1000).toISOString(),
        sla: 'P1',
        priority: 95,
        timeRemaining: '01:15:20',
        productCode: 'MG0324_28',
        productDetails: 'Larita Rota MG0324_28 L Pink, Mia Luggage Tag S Orange',
        quantity: 1,
        location: 'A3-01, B1-03',
        complexity: 'Medium',
        status: 'processing',
        shippingProvider: 'GHN',
        assignedTo: 1,
        assignedAt: new Date(now.getTime() - 30*60*1000).toISOString(),
        startedAt: new Date(now.getTime() - 20*60*1000).toISOString(),
      },
      {
        id: 'SO09032025:0845561',
        platform: 'Shopee',
        createdAt: now.toISOString(),
        deadline: new Date(now.getTime() + 4*60*60*1000).toISOString(),
        sla: 'P2',
        priority: 85,
        timeRemaining: '02:15:30',
        productCode: 'MG0524_20',
        productDetails: 'Larita Aly MG0524_20 S Yellow, Mia Luggage Tag S Orange',
        quantity: 1,
        location: 'A1-02, B1-03',
        complexity: 'Medium',
        status: 'pending',
        shippingProvider: 'J&T Express',
      },
      {
        id: '580061404380694844',
        platform: 'TikTok',
        createdAt: now.toISOString(),
        deadline: new Date(now.getTime() + 12*60*60*1000).toISOString(),
        sla: 'P3',
        priority: 70,
        timeRemaining: '05:10:40',
        productCode: 'SET_MIX',
        productDetails: 'Larita Lusy AH1024_24 M Blue, Mia Luggage Tag S Orange, Mia Cover City',
        quantity: 3,
        location: 'A2-01, B1-03, B1-02',
        complexity: 'High',
        status: 'pending',
        shippingProvider: 'J&T Express',
      }
    ];

    // Apply filters
    let filteredOrders = orders;

    if (filters.platform && filters.platform !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.platform === filters.platform);
    }

    if (filters.sla && filters.sla !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.sla === filters.sla);
    }

    if (filters.status && filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    if (filters.employeeId) {
      filteredOrders = filteredOrders.filter(order => order.assignedTo === parseInt(filters.employeeId));
    }

    return filteredOrders;
  }

  private getMockEmployees(): Employee[] {
    return [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        joinDate: '2024-01-01',
        role: 'senior',
        status: 'active',
        skills: ['Vali', 'Đơn phức tạp'],
        performance: 45,
        slaRate: 98,
        maxLoad: 8,
        currentLoad: 5,
        area: 'Khu A - Vali',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0901234568',
        joinDate: '2024-02-01',
        role: 'senior',
        status: 'active',
        skills: ['Vali cao cấp', 'Đơn quốc tế'],
        performance: 42,
        slaRate: 97,
        maxLoad: 8,
        currentLoad: 4,
        area: 'Khu B - Phụ kiện'
      },
      {
        id: 3,
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        phone: '0901234569',
        joinDate: '2024-03-01',
        role: 'regular',
        status: 'active',
        skills: ['Phụ kiện', 'Đơn Shopee'],
        performance: 35,
        slaRate: 95,
        maxLoad: 6,
        currentLoad: 4,
        area: 'Khu C - Đặc biệt'
      }
    ];
  }

  private getMockActivities(): Activity[] {
    const now = new Date();
    return [
      {
        timestamp: new Date(now.getTime() - 30*60*1000).toISOString(),
        orderId: 'SO09032025:0845553',
        activityType: 'assign',
        employeeId: 1,
        employeeName: 'Nguyễn Văn A',
        notes: 'Gán đơn cho nhân viên senior'
      },
      {
        timestamp: new Date(now.getTime() - 20*60*1000).toISOString(),
        orderId: 'SO09032025:0845553',
        activityType: 'start_picking',
        employeeId: 1,
        employeeName: 'Nguyễn Văn A',
        notes: 'Bắt đầu soạn hàng'
      },
      {
        timestamp: new Date(now.getTime() - 5*60*1000).toISOString(),
        orderId: 'AUTO_ASSIGN',
        activityType: 'auto_assign',
        employeeId: 0,
        employeeName: 'System',
        notes: 'Tự động phân bổ 3 đơn hàng'
      }
    ];
  }

  // Orders API
  async getOrders(filters?: {
    employeeId?: number;
    platform?: string;
    sla?: string;
    status?: string;
  }): Promise<ApiResponse<Order[]>> {
    return this.makeRequest({
      action: 'getOrders',
      ...filters
    });
  }

  async updateOrderStatus(orderId: string, status: string, employeeId?: number): Promise<ApiResponse> {
    return this.makeRequest({
      action: 'updateOrderStatus',
      orderId,
      status,
      employeeId
    });
  }

  async assignOrder(orderId: string, employeeId: number, assignedBy?: number): Promise<ApiResponse> {
    return this.makeRequest({
      action: 'assignOrder',
      orderId,
      employeeId,
      assignedBy
    });
  }

  async autoAssignOrders(): Promise<ApiResponse> {
    return this.makeRequest({
      action: 'autoAssignOrders'
    });
  }

  // Employees API
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.makeRequest({
      action: 'getEmployees'
    });
  }

  // Activities API
  async getActivities(filters?: {
    employeeId?: number;
    isManager?: boolean;
    filter?: string;
    orderFilter?: string;
    sortDirection?: 'asc' | 'desc';
  }): Promise<ApiResponse<Activity[]>> {
    return this.makeRequest({
      action: 'getActivities',
      ...filters
    });
  }

  async logActivity(activity: {
    orderId: string;
    activityType: string;
    employeeId: number;
    notes?: string;
    timestamp?: string;
  }): Promise<ApiResponse> {
    return this.makeRequest({
      action: 'logActivity',
      ...activity
    });
  }
}

export const googleSheetsApi = new GoogleSheetsApiService();
