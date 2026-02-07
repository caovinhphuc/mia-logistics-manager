// Dữ liệu đơn hàng ưu tiên giả lập (dùng cho dashboard demo)

export const mockPriorityOrders = [
  {
    id: "SO11032025:0845550",
    location: "HN-20-15-PD02",
    timeLeft: "01:25:18",
    sla: "P1", // Cấp độ SLA
    detail: "Valinice Yari ID2041_24 M Orange(1)",
    status: "pending", // Trạng thái xử lý
    productType: "vali", // Loại sản phẩm
    complexity: "đơn giản", // Mức độ phức tạp
    assignedTo: null, // Nhân viên đã được gán (nếu có)
    suggestedStaff: 2, // Gợi ý nhân sự phù hợp
    priority: 95, // Mức độ ưu tiên
  },
  {
    id: "SO11032025:0845552",
    location: "290-B-05-A2",
    timeLeft: "01:45:32",
    sla: "P1",
    detail: "Balore Rio BR0224_23 M Black(1)",
    status: "pending",
    productType: "mix",
    complexity: "trung bình",
    assignedTo: null,
    suggestedStaff: 1,
    priority: 92,
  },
];
