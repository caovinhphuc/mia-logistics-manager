//HistoryTab.jsx

import React from 'react';
import { RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';



//Component cho tab lịch sử hoạt động
const HistoryTab = ({ themeClasses, darkMode }) => {
  // Mock data cho lịch sử hoạt động
  const activityHistory = [
    {
      time: "10:30 AM",
      type: "order",
      action: "Tạo đơn hàng mới #12345",
      user: "Nguyễn Văn A"
    },
    {
      time: "10:15 AM",
      type: "picking",
      action: "Hoàn thành picking đơn #12344",
      user: "Trần Thị B"
    },
    {
      time: "09:45 AM",
      type: "staff",
      action: "Cập nhật thông tin nhân viên",
      user: "Admin"
    },
    {
      time: "09:30 AM",
      type: "sla",
      action: "Cảnh báo SLA quá hạn đơn #12343",
      user: "System"
    }
  ];

  const cardClass = darkMode
    ? "bg-gray-800 border-gray-700 text-white"
    : "bg-white border-gray-200 text-gray-900";

  const inputClass = darkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-900";

  const buttonSecondaryClass = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300";

  return (
    <div className={`p-4 rounded-lg border ${cardClass}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Lịch sử hoạt động</h3>
        <div className="flex space-x-2">
          <select className={`px-3 py-1 rounded text-sm ${inputClass}`}>
            <option value="all">Tất cả</option>
            <option value="order">Đơn hàng</option>
            <option value="staff">Nhân viên</option>
            <option value="sla">SLA</option>
            <option value="picking">Picking</option>
          </select>
          <button
            className={`px-3 py-1 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <RefreshCw size={16} className="mr-1" /> Làm mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Thời gian
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Loại
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Hành động
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Người thực hiện
              </th>
            </tr>
          </thead>
          <tbody>
            {activityHistory.map((log, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-2 text-sm">{log.time}</td>
                <td className="py-2 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      log.type === "order"
                        ? "bg-blue-500 bg-opacity-20 text-blue-400"
                        : log.type === "staff"
                        ? "bg-green-500 bg-opacity-20 text-green-400"
                        : log.type === "sla"
                        ? "bg-red-500 bg-opacity-20 text-red-400"
                        : "bg-purple-500 bg-opacity-20 text-purple-400"
                    }`}
                  >
                    {log.type === "order"
                      ? "Đơn hàng"
                      : log.type === "staff"
                      ? "Nhân viên"
                      : log.type === "sla"
                      ? "SLA"
                      : "Picking"}
                  </span>
                </td>
                <td className="py-2 text-sm">{log.action}</td>
                <td className="py-2 text-sm">{log.user}</td>
              </tr>
            ))}
          </tbody>
        </table>      </div>
    </div>
  );
};

// ==================== PROP TYPES ====================
HistoryTab.propTypes = {
  themeClasses: PropTypes.object,
  darkMode: PropTypes.bool
};
// ==================== EXPORTS ====================
export default HistoryTab;
