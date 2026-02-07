//SettingsTab.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';

// Tab Cài Đặt
const SettingsTab = ({ themeClasses = {}, darkMode = false }) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isDarkMode, setDarkMode] = useState(darkMode);

  // Define CSS classes based on theme
  const buttonSecondaryClass = themeClasses?.buttonSecondary ||
    `border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`;

  const buttonPrimaryClass = themeClasses?.buttonPrimary ||
    `bg-blue-500 text-white hover:bg-blue-600`;

  const cardClass = themeClasses?.card ||
    `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const inputClass = themeClasses?.input ||
    `${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`;

  // Update time periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Cài đặt hệ thống</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Khôi phục mặc định
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <CheckCircle className="h-4 w-4 mr-1" /> Lưu cài đặt
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">Cài đặt chung</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chế độ hiển thị
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={darkMode}
                  onChange={() => setDarkMode(true)}
                />
                <span>Tối</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!darkMode}
                  onChange={() => setDarkMode(false)}
                />
                <span>Sáng</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tự động làm mới dữ liệu
            </label>
            <div className="flex items-center">
              <select className={`p-2 rounded mr-2 w-40 ${inputClass}`}>
                <option value="30">30 giây</option>
                <option value="60">1 phút</option>
                <option value="300">5 phút</option>
                <option value="600">10 phút</option>
                <option value="0">Tắt</option>
              </select>
              <span className="text-sm text-gray-400">
                Cập nhật lần cuối: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
            <select className={`p-2 rounded w-full ${inputClass}`}>
              <option value="vi">Tiếng Việt</option>
              <option value="en">Tiếng Anh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Múi giờ</label>
            <select className={`p-2 rounded w-full ${inputClass}`}>
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
              <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SLA Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">Cài đặt SLA</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              P1 - Gấp (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="2"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng ưu tiên cao nhất
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              P2 - Cảnh báo (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="4"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng ưu tiên trung bình
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              P3 - Bình thường (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="8"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng ưu tiên thấp
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              P4 - Chờ xử lý (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="24"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng không ưu tiên
            </p>
          </div>
        </div>
      </div>

      {/* Pareto Principle Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Cài đặt nguyên tắc 80/20 Pareto
          </h3>
          <button
            className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
          >
            Đặt lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tỷ lệ phân bổ nhân viên (Top 20%)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                className="w-full"
                value="20"
              />
              <span className="ml-2 w-8">20%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              % nhân viên hiệu suất cao được ưu tiên phân công
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tỷ lệ khối lượng công việc
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="70"
                max="90"
                step="5"
                className="w-full"
                value="80"
              />
              <span className="ml-2 w-8">80%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              % khối lượng công việc được phân cho nhóm hiệu suất cao
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tỷ lệ Picking/Packing/QC
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className={`p-2 rounded w-16 ${inputClass}`}
                value="45"
              />
              <span>/</span>
              <input
                type="number"
                className={`p-2 rounded w-16 ${inputClass}`}
                value="30"
              />
              <span>/</span>
              <input
                type="number"
                className={`p-2 rounded w-16 ${inputClass}`}
                value="15"
              />
              <span>%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Tỷ lệ phân bổ nhân sự theo vai trò (10% còn lại: Logistics)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hiệu suất tối ưu
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="70"
                max="100"
                step="5"
                className="w-full"
                value="85"
              />
              <span className="ml-2 w-8">85%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              % hiệu suất tối ưu sau phân ca (đảm bảo dự phòng 15%)
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-900 bg-opacity-10 rounded border border-blue-800">
          <h4 className="text-sm font-medium mb-2">
            Lưu ý về nguyên tắc 80/20:
          </h4>
          <ul className="text-sm space-y-1">
            <li>
              • Phân bổ top 20% nhân viên để xử lý 80% khối lượng công việc quan
              trọng
            </li>
            <li>• Tối ưu hóa 20% quy trình chiếm 80% thời gian xử lý</li>
            <li>• Tập trung vào 20% khu vực kho được sử dụng 80% thời gian</li>
            <li>• Khung giờ cao điểm (20% thời gian) phát sinh 80% đơn hàng</li>
          </ul>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">Cài đặt thông báo</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked />
              <span>Thông báo khi đơn hàng trễ deadline</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="immediately">Ngay lập tức</option>
              <option value="5min">5 phút trước</option>
              <option value="15min">15 phút trước</option>
              <option value="30min">30 phút trước</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked />
              <span>Thông báo khi khu vực kho quá tải</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="80">Trên 80%</option>
              <option value="90">Trên 90%</option>
              <option value="100">Trên 100%</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked />
              <span>Thông báo khi nhân viên đạt hiệu suất cao</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Thông báo khi có sự kiện đặc biệt</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="1day">1 ngày trước</option>
              <option value="3days">3 ngày trước</option>
              <option value="1week">1 tuần trước</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Thông báo email các báo cáo tổng hợp</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
            </select>
          </div>        </div>
      </div>
    </div>
  );
};

// ==================== EXPORTS ====================
export default SettingsTab;
