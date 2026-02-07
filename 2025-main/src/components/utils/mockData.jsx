// Mock data generator for warehouse dashboard
export const generateMockData = () => {
  // Sample orders data structure
  const orders = [
    {
      id: "SO11032025:0845550",
      name: "SO11032025:0845550",
      location: "HN-20-15-PD02",
      timeLeft: "01:25:18",
      sla: { code: "P1", color: "bg-red-100 text-red-800" },
      detail: "Valinice Yari ID2041_24 M Orange(1)",
      status: "pending",
      productType: "vali",
      complexity: "đơn giản",
      assignedTo: null,
      suggestedStaff: 2,
      priority: 95,
      customer: "Khách hàng A",
      transporter: "Giao hàng nhanh",
      createdAt: new Date(2025, 2, 22, 9, 30, 15),
      dueDate: new Date(2025, 2, 22, 15, 30, 0),
      ecom_recipient_code: "HN-20-15-PD02",
      amount_total: "699000",
      phone: "0901234567"
    },
    {
      id: "SO11032025:0845552",
      name: "SO11032025:0845552",
      location: "290-B-05-A2",
      timeLeft: "01:45:32",
      sla: { code: "P1", color: "bg-red-100 text-red-800" },
      detail: "Balore Rio BR0224_23 M Black(1), Mia Luggage Tag S Black(1)",
      status: "processing",
      productType: "mix",
      complexity: "trung bình",
      assignedTo: 1,
      suggestedStaff: 1,
      priority: 92,
      customer: "Khách hàng B",
      transporter: "Viettel Post",
      createdAt: new Date(2025, 2, 22, 8, 15, 0),
      dueDate: new Date(2025, 2, 22, 16, 0, 0),
      ecom_recipient_code: "290-B-05-A2",
      amount_total: "850000",
      phone: "0902345678"
    },
    {
      id: "SO11032025:0845554",
      name: "SO11032025:0845554",
      location: "300-C-01-B1",
      timeLeft: "02:15:45",
      sla: { code: "P2", color: "bg-yellow-100 text-yellow-800" },
      detail: "Cerave Kem dưỡng ẩm 7ml S Blue/White(2)",
      status: "pending",
      productType: "phụ kiện",
      complexity: "đơn giản",
      assignedTo: null,
      suggestedStaff: 3,
      priority: 78,
      customer: "Khách hàng C",
      transporter: "GHTK",
      createdAt: new Date(2025, 2, 22, 10, 0, 0),
      dueDate: new Date(2025, 2, 22, 17, 0, 0),
      ecom_recipient_code: "300-C-01-B1",
      amount_total: "450000",
      phone: "0903456789"
    },
    {
      id: "SO11032025:0845556",
      name: "SO11032025:0845556",
      location: "250-A-02-C3",
      timeLeft: "03:30:12",
      sla: { code: "P3", color: "bg-green-100 text-green-800" },
      detail: "Mia Pack-it shoes bag II S Orange(1), The Travel Star Clearguard Cover_20 S Black(1)",
      status: "completed",
      productType: "balo",
      complexity: "trung bình",
      assignedTo: 2,
      suggestedStaff: 2,
      priority: 65,
      customer: "Khách hàng D",
      transporter: "J&T Express",
      createdAt: new Date(2025, 2, 22, 7, 45, 0),
      dueDate: new Date(2025, 2, 22, 18, 0, 0),
      ecom_recipient_code: "250-A-02-C3",
      amount_total: "320000",
      phone: "0904567890"
    },
    {
      id: "SO11032025:0845558",
      name: "SO11032025:0845558",
      location: "300-D-02-A1",
      timeLeft: "04:15:33",
      sla: { code: "P2", color: "bg-yellow-100 text-yellow-800" },
      detail: "Balore Zaino BK0125_16 S Black(1), Mia Pack-it shoes bag II S Orange(1)",
      status: "overdue",
      productType: "mix",
      complexity: "phức tạp",
      assignedTo: 4,
      suggestedStaff: 4,
      priority: 88,
      customer: "Khách hàng E",
      transporter: "Shopee Express",
      createdAt: new Date(2025, 2, 21, 16, 30, 0),
      dueDate: new Date(2025, 2, 22, 12, 0, 0),
      ecom_recipient_code: "300-D-02-A1",
      amount_total: "550000",
      phone: "0905678901"
    }
  ];

  // Sample staff data structure
  const staff = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Trưởng ca",
      area: "A",
      skills: ["vali", "balo", "đóng gói"],
      status: "busy",
      currentOrder: "SO11032025:0845552",
      assignedOrders: ["SO11032025:0845552"],
      orderCount: 25,
      handlingP1: true,
      efficiency: 98,
      maxCapacity: 10,
      currentLoad: 1
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Nhân viên",
      area: "B",
      skills: ["vali", "phụ kiện"],
      status: "active",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 22,
      handlingP1: true,
      efficiency: 95,
      maxCapacity: 8,
      currentLoad: 0
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Nhân viên",
      area: "C",
      skills: ["balo", "phụ kiện", "đóng gói"],
      status: "active",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 18,
      handlingP1: false,
      efficiency: 88,
      maxCapacity: 8,
      currentLoad: 0
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "Nhân viên",
      area: "A",
      skills: ["vali", "QC", "đóng gói"],
      status: "busy",
      currentOrder: "SO11032025:0845558",
      assignedOrders: ["SO11032025:0845558"],
      orderCount: 20,
      handlingP1: false,
      efficiency: 92,
      maxCapacity: 9,
      currentLoad: 1
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      role: "Nhân viên",
      area: "B",
      skills: ["balo", "phụ kiện"],
      status: "active",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 15,
      handlingP1: false,
      efficiency: 90,
      maxCapacity: 7,
      currentLoad: 0
    }
  ];

  // Sample inventory data (if needed)
  const inventory = [
    {
      id: 1,
      product: "Valinice Yari",
      location: "HN-20-15",
      quantity: 45,
      reserved: 12
    },
    {
      id: 2,
      product: "Balore Rio",
      location: "290-B-05",
      quantity: 32,
      reserved: 8
    },
    {
      id: 3,
      product: "Cerave Kem dưỡng ẩm",
      location: "300-C-01",
      quantity: 150,
      reserved: 25
    }
  ];

  return {
    orders,
    staff,
    inventory,
    lastUpdated: new Date(),
    metrics: {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      processingOrders: orders.filter(o => o.status === 'processing').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      overdueOrders: orders.filter(o => o.status === 'overdue').length,
      p1Orders: orders.filter(o => o.sla?.code === 'P1').length,
      p2Orders: orders.filter(o => o.sla?.code === 'P2').length,
      staffUtilization: Math.round((staff.filter(s => s.status === 'busy').length / staff.length) * 100),
      avgPickingTime: 3.5,
      slaCompliance: 92
    }
  };
};

export default generateMockData;
