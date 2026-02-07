// Mô tả cấu trúc một nhân viên (Staff) dùng cho dashboard xử lý đơn

/**
 * @typedef {Object} Staff
 * @property {number} id                 Mã nhân viên
 * @property {string} name              Tên nhân viên
 * @property {string} [role]            Vai trò ('picker', 'packer', ...)
 * @property {number} currentLoad       Số đơn hiện đang xử lý
 * @property {number} maxCapacity       Số đơn tối đa có thể nhận
 * @property {string} [area]            Khu vực phụ trách (nếu có)
 * @property {number} [performance]     Hiệu suất %
 */

// 👉 Ví dụ nhân viên mẫu (nếu cần import để test)
export const exampleStaff = {
  id: 1,
  name: "Nguyễn Văn A",
  role: "picker",
  currentLoad: 2,
  maxCapacity: 5,
  area: "zoneA",
  performance: 85,
};
