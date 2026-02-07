import React, { useState, useEffect } from 'react';
import { CheckCircle, RefreshCw, Settings, Monitor, Bell, Users, Shield, Clock } from 'lucide-react';

import { useTheme } from '../../hooks/useTheme'; // Import custom hook for theme management
import PropTypes from 'prop-types';


// ==================== SETTINGS TAB COMPONENT ====================
const SettingsTab = ({ themeClasses: propThemeClasses }) => {
   const { themeClasses: hookThemeClasses } = useTheme();
   // Combine theme classes from props and hook
   // This allows the component to use either the provided theme classes or the default ones from the hook

   const themeClasses = propThemeClasses || hookThemeClasses;

   // State management
   const [settings, setSettings] = useState({
      theme: 'light',
      autoRefresh: 30,
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      notifications: {
         overdueOrders: true,
         warehouseOverload: true,
         highPerformance: true,
         specialEvents: false,
         emailReports: false
      },
      sla: {
         p1Hours: 2,
         p2Hours: 4,
         p3Hours: 8,
         p4Hours: 24
      },
      pareto: {
         topPerformerRatio: 20,
         workloadRatio: 80,
         pickingRatio: 45,
         packingRatio: 30,
         qcRatio: 15,
         optimalEfficiency: 85
      }
   });

   const [lastUpdated, setLastUpdated] = useState(new Date());
   const [isDirty, setIsDirty] = useState(false);

   // Theme classes
   const cardClass = `p-6 rounded-xl border ${themeClasses.surface} ${themeClasses.border} shadow-sm`;
   const inputClass = `px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
   const buttonPrimaryClass = `px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2`;
   const buttonSecondaryClass = `px-4 py-2 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2`;

   // Event handlers
   const handleSettingChange = (section, key, value) => {
      setSettings(prev => ({
         ...prev,
         [section]: typeof prev[section] === 'object' ?
            { ...prev[section], [key]: value } : value
      }));
      setIsDirty(true);
   };

   const handleSave = () => {      localStorage.setItem('warehouseSettings', JSON.stringify(settings));
      setIsDirty(false);
      setLastUpdated(new Date());
      window.alert('Cài đặt đã được lưu thành công!');
   };const handleReset = () => {
      if (window.confirm('Bạn có chắc muốn khôi phục về cài đặt mặc định?')) {
         setSettings({
            theme: 'light',
            autoRefresh: 30,
            language: 'vi',
            timezone: 'Asia/Ho_Chi_Minh',
            notifications: {
               overdueOrders: true,
               warehouseOverload: true,
               highPerformance: true,
               specialEvents: false,
               emailReports: false
            },
            sla: {
               p1Hours: 2,
               p2Hours: 4,
               p3Hours: 8,
               p4Hours: 24
            },
            pareto: {
               topPerformerRatio: 20,
               workloadRatio: 80,
               pickingRatio: 45,
               packingRatio: 30,
               qcRatio: 15,
               optimalEfficiency: 85
            }
         });
         setIsDirty(true);
      }
   };

   // Load settings from localStorage on mount
   useEffect(() => {
      const savedSettings = localStorage.getItem('warehouseSettings');
      if (savedSettings) {
         setSettings(JSON.parse(savedSettings));
      }
   }, []);

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 mb-4 lg:mb-0">
               <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
               </div>
               <div>
                  <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>Cài đặt hệ thống</h1>
                  <p className={`text-sm ${themeClasses.text.muted}`}>
                     Quản lý cấu hình và thiết lập hệ thống kho vận
                  </p>
               </div>
            </div>

            <div className="flex flex-wrap gap-3">
               <button
                  onClick={handleReset}
                  className={buttonSecondaryClass}
               >
                  <RefreshCw size={16} />
                  Khôi phục mặc định
               </button>
               <button
                  onClick={handleSave}
                  disabled={!isDirty}
                  className={`${buttonPrimaryClass} ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                  <CheckCircle size={16} />
                  Lưu cài đặt
               </button>
            </div>
         </div>         {/* General Settings */}
         <div className={cardClass}>
            <div className="flex items-center gap-3 mb-4">
               <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
               <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Cài đặt chung</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     Chế độ hiển thị
                  </label>
                  <div className="flex items-center space-x-4">
                     <label className="flex items-center space-x-2">
                        <input
                           type="radio"
                           name="theme"
                           checked={settings.theme === 'dark'}
                           onChange={() => handleSettingChange('theme', null, 'dark')}
                           className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className={themeClasses.text.primary}>Tối</span>
                     </label>
                     <label className="flex items-center space-x-2">
                        <input
                           type="radio"
                           name="theme"
                           checked={settings.theme === 'light'}
                           onChange={() => handleSettingChange('theme', null, 'light')}
                           className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className={themeClasses.text.primary}>Sáng</span>
                     </label>
                  </div>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     Tự động làm mới dữ liệu
                  </label>
                  <div className="flex items-center">
                     <select
                        className={`p-2 rounded mr-2 w-40 ${inputClass}`}
                        value={settings.autoRefresh}
                        onChange={(e) => handleSettingChange('autoRefresh', null, parseInt(e.target.value))}
                     >
                        <option value="30">30 giây</option>
                        <option value="60">1 phút</option>
                        <option value="300">5 phút</option>
                        <option value="600">10 phút</option>
                        <option value="0">Tắt</option>
                     </select>                     <span className={`text-sm ${themeClasses.text.muted}`}>
                        Cập nhật lần cuối: {lastUpdated && lastUpdated instanceof Date ? lastUpdated.toLocaleTimeString() : '--:--'}
                     </span>
                  </div>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>Ngôn ngữ</label>
                  <select
                     className={`p-2 rounded w-full ${inputClass}`}
                     value={settings.language}
                     onChange={(e) => handleSettingChange('language', null, e.target.value)}
                  >
                     <option value="vi">Tiếng Việt</option>
                     <option value="en">Tiếng Anh</option>
                  </select>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>Múi giờ</label>
                  <select
                     className={`p-2 rounded w-full ${inputClass}`}
                     value={settings.timezone}
                     onChange={(e) => handleSettingChange('timezone', null, e.target.value)}
                  >
                     <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                     <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                     <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  </select>
               </div>
            </div>
         </div>         {/* SLA Settings */}
         <div className={cardClass}>
            <div className="flex items-center gap-3 mb-4">
               <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
               <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Cài đặt SLA</h3>
            </div>

            <div className="space-y-4">
               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     P1 - Gấp (thời gian xử lý tối đa)
                  </label>
                  <div className="flex items-center">
                     <input
                        type="number"
                        className={`p-2 rounded w-20 ${inputClass}`}
                        value={settings.sla.p1Hours}
                        onChange={(e) => handleSettingChange('sla', 'p1Hours', parseInt(e.target.value))}
                     />
                     <span className={`ml-2 ${themeClasses.text.primary}`}>giờ</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     Áp dụng cho đơn hàng ưu tiên cao nhất
                  </p>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     P2 - Cảnh báo (thời gian xử lý tối đa)
                  </label>
                  <div className="flex items-center">
                     <input
                        type="number"
                        className={`p-2 rounded w-20 ${inputClass}`}
                        value={settings.sla.p2Hours}
                        onChange={(e) => handleSettingChange('sla', 'p2Hours', parseInt(e.target.value))}
                     />
                     <span className={`ml-2 ${themeClasses.text.primary}`}>giờ</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     Áp dụng cho đơn hàng ưu tiên trung bình
                  </p>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     P3 - Bình thường (thời gian xử lý tối đa)
                  </label>
                  <div className="flex items-center">
                     <input
                        type="number"
                        className={`p-2 rounded w-20 ${inputClass}`}
                        value={settings.sla.p3Hours}
                        onChange={(e) => handleSettingChange('sla', 'p3Hours', parseInt(e.target.value))}
                     />
                     <span className={`ml-2 ${themeClasses.text.primary}`}>giờ</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     Áp dụng cho đơn hàng ưu tiên thấp
                  </p>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     P4 - Chờ xử lý (thời gian xử lý tối đa)
                  </label>
                  <div className="flex items-center">
                     <input
                        type="number"
                        className={`p-2 rounded w-20 ${inputClass}`}
                        value={settings.sla.p4Hours}
                        onChange={(e) => handleSettingChange('sla', 'p4Hours', parseInt(e.target.value))}
                     />
                     <span className={`ml-2 ${themeClasses.text.primary}`}>giờ</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     Áp dụng cho đơn hàng không ưu tiên
                  </p>
               </div>
            </div>
         </div>         {/* Pareto Principle Settings */}
         <div className={cardClass}>
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                     Cài đặt nguyên tắc 80/20 Pareto
                  </h3>
               </div>
               <button
                  className={buttonSecondaryClass}
                  onClick={() => {
                     setSettings(prev => ({
                        ...prev,
                        pareto: {
                           topPerformerRatio: 20,
                           workloadRatio: 80,
                           pickingRatio: 45,
                           packingRatio: 30,
                           qcRatio: 15,
                           optimalEfficiency: 85
                        }
                     }));
                     setIsDirty(true);
                  }}
               >
                  <RefreshCw size={14} />
                  Đặt lại
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     Tỷ lệ phân bổ nhân viên (Top 20%)
                  </label>
                  <div className="flex items-center">
                     <input
                        type="range"
                        min="10"
                        max="30"
                        step="5"
                        className="w-full"
                        value={settings.pareto.topPerformerRatio}
                        onChange={(e) => handleSettingChange('pareto', 'topPerformerRatio', parseInt(e.target.value))}
                     />
                     <span className={`ml-2 w-8 ${themeClasses.text.primary}`}>{settings.pareto.topPerformerRatio}%</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     % nhân viên hiệu suất cao được ưu tiên phân công
                  </p>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     Tỷ lệ khối lượng công việc
                  </label>
                  <div className="flex items-center">
                     <input
                        type="range"
                        min="70"
                        max="90"
                        step="5"
                        className="w-full"
                        value={settings.pareto.workloadRatio}
                        onChange={(e) => handleSettingChange('pareto', 'workloadRatio', parseInt(e.target.value))}
                     />
                     <span className={`ml-2 w-8 ${themeClasses.text.primary}`}>{settings.pareto.workloadRatio}%</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     % khối lượng công việc được phân cho nhóm hiệu suất cao
                  </p>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     Tỷ lệ Picking/Packing/QC
                  </label>
                  <div className="flex items-center space-x-2">
                     <input
                        type="number"
                        className={`p-2 rounded w-16 ${inputClass}`}
                        value={settings.pareto.pickingRatio}
                        onChange={(e) => handleSettingChange('pareto', 'pickingRatio', parseInt(e.target.value))}
                     />
                     <span className={themeClasses.text.primary}>/</span>
                     <input
                        type="number"
                        className={`p-2 rounded w-16 ${inputClass}`}
                        value={settings.pareto.packingRatio}
                        onChange={(e) => handleSettingChange('pareto', 'packingRatio', parseInt(e.target.value))}
                     />
                     <span className={themeClasses.text.primary}>/</span>
                     <input
                        type="number"
                        className={`p-2 rounded w-16 ${inputClass}`}
                        value={settings.pareto.qcRatio}
                        onChange={(e) => handleSettingChange('pareto', 'qcRatio', parseInt(e.target.value))}
                     />
                     <span className={themeClasses.text.primary}>%</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     Tỷ lệ phân bổ nhân sự theo vai trò (10% còn lại: Logistics)
                  </p>
               </div>

               <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                     Hiệu suất tối ưu
                  </label>
                  <div className="flex items-center">
                     <input
                        type="range"
                        min="70"
                        max="100"
                        step="5"
                        className="w-full"
                        value={settings.pareto.optimalEfficiency}
                        onChange={(e) => handleSettingChange('pareto', 'optimalEfficiency', parseInt(e.target.value))}
                     />
                     <span className={`ml-2 w-8 ${themeClasses.text.primary}`}>{settings.pareto.optimalEfficiency}%</span>
                  </div>
                  <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                     % hiệu suất tối ưu sau phân ca (đảm bảo dự phòng 15%)
                  </p>
               </div>
            </div>

            <div className={`mt-4 p-3 rounded border ${themeClasses.accent} ${themeClasses.border}`}>
               <h4 className={`text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                  Lưu ý về nguyên tắc 80/20:
               </h4>
               <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
                  <li>
                     • Phân bổ top 20% nhân viên để xử lý 80% khối lượng công việc quan trọng
                  </li>
                  <li>• Tối ưu hóa 20% quy trình chiếm 80% thời gian xử lý</li>
                  <li>• Tập trung vào 20% khu vực kho được sử dụng 80% thời gian</li>
                  <li>• Khung giờ cao điểm (20% thời gian) phát sinh 80% đơn hàng</li>
               </ul>
            </div>
         </div>         {/* Notification Settings */}
         <div className={cardClass}>
            <div className="flex items-center gap-3 mb-4">
               <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
               <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Cài đặt thông báo</h3>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <label className="flex items-center">
                     <input
                        type="checkbox"
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                        checked={settings.notifications.overdueOrders}
                        onChange={(e) => handleSettingChange('notifications', 'overdueOrders', e.target.checked)}
                     />
                     <span className={themeClasses.text.primary}>Thông báo khi đơn hàng trễ deadline</span>
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
                     <input
                        type="checkbox"
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                        checked={settings.notifications.warehouseOverload}
                        onChange={(e) => handleSettingChange('notifications', 'warehouseOverload', e.target.checked)}
                     />
                     <span className={themeClasses.text.primary}>Thông báo khi khu vực kho quá tải</span>
                  </label>
                  <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
                     <option value="80">Trên 80%</option>
                     <option value="90">Trên 90%</option>
                     <option value="100">Trên 100%</option>
                  </select>
               </div>

               <div className="flex items-center justify-between">
                  <label className="flex items-center">
                     <input
                        type="checkbox"
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                        checked={settings.notifications.highPerformance}
                        onChange={(e) => handleSettingChange('notifications', 'highPerformance', e.target.checked)}
                     />
                     <span className={themeClasses.text.primary}>Thông báo khi nhân viên đạt hiệu suất cao</span>
                  </label>
                  <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
                     <option value="daily">Hàng ngày</option>
                     <option value="weekly">Hàng tuần</option>
                  </select>
               </div>

               <div className="flex items-center justify-between">
                  <label className="flex items-center">
                     <input
                        type="checkbox"
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                        checked={settings.notifications.specialEvents}
                        onChange={(e) => handleSettingChange('notifications', 'specialEvents', e.target.checked)}
                     />
                     <span className={themeClasses.text.primary}>Thông báo khi có sự kiện đặc biệt</span>
                  </label>
                  <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
                     <option value="1day">1 ngày trước</option>
                     <option value="3days">3 ngày trước</option>
                     <option value="1week">1 tuần trước</option>
                  </select>
               </div>

               <div className="flex items-center justify-between">
                  <label className="flex items-center">
                     <input
                        type="checkbox"
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                        checked={settings.notifications.emailReports}
                        onChange={(e) => handleSettingChange('notifications', 'emailReports', e.target.checked)}
                     />
                     <span className={themeClasses.text.primary}>Thông báo email các báo cáo tổng hợp</span>
                  </label>
                  <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
                     <option value="daily">Hàng ngày</option>
                     <option value="weekly">Hàng tuần</option>
                     <option value="monthly">Hàng tháng</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Status Footer */}
         <div className={`${cardClass} mt-6`}>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className={`text-sm ${themeClasses.text.muted}`}>
                     Trạng thái: {isDirty ? 'Có thay đổi chưa lưu' : 'Đã đồng bộ'}
                  </span>
               </div>
               <span className={`text-xs ${themeClasses.text.muted}`}>
                  Cập nhật lần cuối: {lastUpdated.toLocaleString('vi-VN')}
               </span>
            </div>
         </div>
      </div>
   );
};

// ==================== PROP TYPES ====================
SettingsTab.propTypes = {
   themeClasses: PropTypes.object
};

// ==================== EXPORTS ====================
export default SettingsTab;
