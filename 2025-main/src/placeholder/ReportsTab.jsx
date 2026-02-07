// ReportsTab.jsx - Tab báo cáo mới
import React from 'react';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

const ReportsTab = ({ themeClasses,  metrics }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Báo cáo & Thống kê
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem và xuất báo cáo chi tiết về hoạt động kho
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Báo cáo đơn hàng */}
        <div className={`${themeClasses.surface} rounded-lg border ${themeClasses.border} p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Báo cáo đơn hàng</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thống kê chi tiết về đơn hàng theo thời gian
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tổng đơn:</span>
              <span className="font-medium">{metrics.orders.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Hoàn thành:</span>
              <span className="font-medium text-green-600">{metrics.orders.completed}</span>
            </div>
            <div className="flex justify-between">
              <span>Đang xử lý:</span>
              <span className="font-medium text-yellow-600">{metrics.orders.processing}</span>
            </div>
          </div>
        </div>

        {/* Báo cáo nhân sự */}
        <div className={`${themeClasses.surface} rounded-lg border ${themeClasses.border} p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Báo cáo nhân sự</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Hiệu suất và năng suất nhân viên
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Nhân viên hoạt động:</span>
              <span className="font-medium">{metrics.staff.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Hiệu suất trung bình:</span>
              <span className="font-medium text-blue-600">{metrics.performance.efficiency}%</span>
            </div>
            <div className="flex justify-between">
              <span>Tỷ lệ SLA:</span>
              <span className="font-medium text-green-600">{metrics.performance.slaRate}%</span>
            </div>
          </div>
        </div>

        {/* Báo cáo theo thời gian */}
        <div className={`${themeClasses.surface} rounded-lg border ${themeClasses.border} p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-semibold">Báo cáo theo thời gian</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Phân tích xu hướng theo ngày/tuần/tháng
          </p>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              📈 Báo cáo ngày
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              📊 Báo cáo tuần
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              📋 Báo cáo tháng
            </button>
          </div>
        </div>
      </div>

      {/* Demo thông báo */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 dark:text-blue-200 font-medium">
            🎉 Tab "Báo cáo" đã được thêm thành công!
          </span>
        </div>
        <p className="text-blue-700 dark:text-blue-300 mt-1 text-sm">
          Đây là ví dụ về cách thêm tab mới vào hệ thống. Bạn có thể thay đổi nội dung theo nhu cầu.
        </p>
      </div>
    </div>
  );
};

export default ReportsTab;
