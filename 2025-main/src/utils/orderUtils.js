// 1. Hàm cập nhật hiệu suất nhân viên (dựa trên đơn đã gán)
export const updateStaffPerformance = (staffList, orders) => {
  return staffList.map((staff) => {
    const assignedOrdersCount = orders.filter(
      (o) => o.assignedTo === staff.id
    ).length;

    return {
      ...staff,
      currentLoad: Math.min(
        staff.maxCapacity,
        staff.currentLoad + assignedOrdersCount
      ),
    };
  });
};

// 2. Hàm tìm nhân viên phù hợp nhất cho 1 đơn hàng
export const findBestStaffForOrder = (order) => {
  // Mặc định: dùng gợi ý từ đơn hàng
  return order.suggestedStaff;
};

// 3. Hàm gán 1 đơn cho 1 nhân viên cụ thể
export const assignOrderToStaff = (orders, orderId, staffId) => {
  return orders.map((order) =>
    order.id === orderId ? { ...order, assignedTo: staffId } : order
  );
};

// 4. Hàm tự động phân bổ đơn hàng
export const autoAllocateOrders = (orders) => {
  return orders.map((order) => {
    if (order.assignedTo) return order;
    return {
      ...order,
      assignedTo: order.suggestedStaff,
    };
  });
};

export const performAutoAllocation = (orders, staffList) => {
  const updatedOrders = autoAllocateOrders(orders);
  const updatedStaff = updateStaffPerformance(staffList, updatedOrders);

  return { updatedOrders, updatedStaff };
};
