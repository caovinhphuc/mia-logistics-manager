// Đây là mô tả cấu trúc một đơn hàng (Order)

// ⚠ JavaScript không hỗ trợ type nên chỉ có thể mô tả bằng comment
// Nếu bạn cần kiểm tra runtime thì phải dùng thêm thư viện như PropTypes hoặc Zod (tùy)

export const exampleOrder = {
  id: "SO11032025:0845550",
  location: "HN-20-15-PD02",
  timeLeft: "01:25:18",
  sla: "P1", // "P1" | "P2" | "P3" | "P4"
  detail: "Tên sản phẩm chi tiết...",
  status: "pending", // "pending" | "processing" | "completed"
  productType: "vali",
  complexity: "đơn giản",
  assignedTo: null, // hoặc là số staff id
  suggestedStaff: 2,
  priority: 95,
};
