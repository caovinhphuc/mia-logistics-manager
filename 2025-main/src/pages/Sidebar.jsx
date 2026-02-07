//Sidebar.jsx
import React, { useState, useEffect } from 'react';

import { Home, Package, Users, BarChart3, Calendar, Settings, ChevronRight, Download, Mail, Info, Clock, Shield, TrendingUp, UserCheck, FileText, Truck, History, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import ScheduleTab from '../module/ScheduleTab';
import { SYSTEM_CONFIG } from '../config/systemConfig';

// PropTypes for type checking
import PropTypes from 'prop-types';

// ==================== SIDEBAR COMPONENT ====================
const Sidebar = ({
  user, uiState, onUIStateChange, hasPermission,
  themeClasses, metrics
}) => {
  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);  // Format date and time
  const formatDateTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return { day: '--', time: '--:--:--' };
    }

    // Định dạng ngày tháng đầy đủ
    const day = date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Định dạng giờ phút giây
    const time = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return { day, time };
  };

  const { day, time } = formatDateTime(currentTime);
  // Handler functions for footer actions
  const handleDownload = () => {
    console.log('Downloading report...');
    // Add your download logic here
  };

  const handleSupport = () => {
    console.log('Opening support...');
    // Add your support logic here
  };

  const handleUpdates = () => {
    console.log('Checking updates...');
    // Add your updates logic here
  };
  // State để quản lý các menu được mở rộng
  const [expandedMenus, setExpandedMenus] = useState({});

  // Hàm xử lý toggle menu con
  const toggleSubmenu = (id) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Navigation configuration với permission check
  const navigation = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: Home,
      permission: 'dashboard',
      badge: null
    },    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: Package,
      permission: 'orders',
      badge: metrics.orders.pending > 0 ? metrics.orders.pending : null,
      hasSubmenu: true,
      submenu: [
        {
          id: 'orders-overview',
          label: 'Tổng quan đơn hàng',
          icon: Package
        }
      ]    },
    {
      id: 'staff',
      label: 'Quản lý nhân sự',
      icon: Users,
      permission: 'staff',
      badge: null,
      hasSubmenu: true,
      submenu: [
        {
          id: 'staff-overview',
          label: 'Tổng quan nhân sự',
          icon: Users
        },
        {
          id: 'staff-performance',
          label: 'Hiệu suất làm việc',
          icon: TrendingUp
        },
        {
          id: 'staff-schedule',
          label: 'Lịch làm việc',
          icon: Calendar,
          path: "/staff/schedule",
          component: ScheduleTab
        },        {
          id: 'staff-assignments',
          label: 'Phân công công việc',
          icon: UserCheck
        },
        {
          id: 'staff-settings',
          label: 'Cài đặt',
          icon: Settings
        }
      ]
    },    {
      id: 'picking',
      label: 'Picking',
      icon: Truck,
      permission: 'picking',
      badge: null,
      hasSubmenu: true,
      submenu: [
        {
          id: 'picking-overview',
          label: 'Tổng quan picking',
          icon: Truck
        }
      ]
    },    {
      id: 'history',
      label: 'Lịch sử',
      icon: History,
      permission: 'history',
      badge: null,
      hasSubmenu: true,
      submenu: [
        {
          id: 'history-overview',
          label: 'Tổng quan lịch sử',
          icon: History
        }
      ]
    },
    {
      id: 'alerts',
      label: 'Cảnh báo',
      icon: AlertTriangle,
      permission: 'alerts',
      badge: null,
      hasSubmenu: true,
      submenu: [
        {
          id: 'alerts-overview',
          label: 'Tổng quan cảnh báo',
          icon: AlertTriangle
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Phân tích & Báo cáo',
      icon: BarChart3,
      permission: 'analytics',
      badge: null
    },
    {
      id: 'reports',
      label: 'Báo cáo chi tiết',
      icon: FileText,
      permission: 'reports',
      badge: null
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: Settings,
      permission: 'settings',
      badge: null
    },
    {
      id: 'permissions',
      label: 'Phân quyền',
      icon: Shield,
      permission: 'permissions',
      badge: null
    }
  ].filter(nav => typeof hasPermission === 'function' ? hasPermission(nav.permission) : true);
  const sidebarClasses = `
    fixed lg:relative top-0 left-0 h-screen z-40
    ${uiState.isSidebarCollapsed ? 'w-16' : 'w-64'}
    ${themeClasses.surface} ${themeClasses.border} border-r
    transform transition-all duration-300 ease-in-out
    ${uiState.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    flex-shrink-0
  `;

  return (
    <>
      {/* Mobile overlay */}
      {uiState.isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => onUIStateChange({ isMobileMenuOpen: false })}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full pt-16">
          {/* Sidebar controls */}
          <div className="flex justify-between items-center p-4">
            {!uiState.isSidebarCollapsed && (
              <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                Điều hướng
              </h2>
            )}
            <button
              onClick={() => onUIStateChange({ isSidebarCollapsed: !uiState.isSidebarCollapsed })}
              className={`hidden lg:flex p-2 rounded-lg ${themeClasses.surfaceHover} transition-colors`}
            >
              <ChevronRight
                size={16}
                className={`transform transition-transform duration-200 ${
                  uiState.isSidebarCollapsed ? '' : 'rotate-180'
                }`}
              />
            </button>
          </div>          {/* Navigation menu */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleSubmenu(item.id);
                    } else {
                      onUIStateChange({
                        activeTab: item.id,
                        isMobileMenuOpen: false
                      });
                    }
                  }}
                  className={`
                    w-full flex items-center px-3 py-3 rounded-xl text-left transition-all duration-200
                    ${uiState.activeTab === item.id || (item.hasSubmenu && uiState.activeTab.startsWith(item.id+'-'))
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : `${themeClasses.surfaceHover} hover:shadow-md`
                    }
                    ${uiState.isSidebarCollapsed ? 'justify-center' : ''}
                  `}
                  title={uiState.isSidebarCollapsed ? item.label : undefined}
                >
                  <item.icon
                    size={20}
                    className={`flex-shrink-0 ${
                      uiState.activeTab === item.id || (item.hasSubmenu && uiState.activeTab.startsWith(item.id+'-')) ? 'text-white' : ''
                    }`}
                  />
                  {!uiState.isSidebarCollapsed && (
                    <>
                      <span className="ml-3 font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.hasSubmenu && (
                        <ChevronRight
                          size={16}
                          className={`ml-auto transform transition-transform duration-200 ${
                            expandedMenus[item.id] ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu items */}
                {!uiState.isSidebarCollapsed && item.hasSubmenu && expandedMenus[item.id] && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => {
                          onUIStateChange({
                            activeTab: subitem.id,
                            isMobileMenuOpen: false
                          });
                        }}
                        className={`
                          w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                          ${uiState.activeTab === subitem.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : `hover:${themeClasses.surfaceHover}`
                          }
                        `}
                      >
                        <subitem.icon size={16} className="flex-shrink-0" />
                        <span className="ml-3 text-sm">{subitem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Quick stats panel */}
          {!uiState.isSidebarCollapsed && (
            <div className={`p-4 m-3 rounded-xl ${themeClasses.surface} border ${themeClasses.border}`}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                Thống kê nhanh
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đơn chờ xử lý</span>
                  <div className="flex items-center">
                    <span className="font-bold text-orange-500">{metrics?.orders?.pending ?? '--'}</span>
                    <div className="w-2 h-2 bg-orange-500 rounded-full ml-2 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tỷ lệ SLA</span>
                  <span className="font-bold text-green-500">{metrics?.performance?.slaRate ?? '--'}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nhân viên hoạt động</span>
                  <span className="font-bold text-blue-500">
                    {metrics?.staff?.active ?? '--'}/{metrics?.staff?.total ?? '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Throughput</span>
                  <span className="font-bold text-purple-500">{metrics?.performance?.throughput ?? '--'}/h</span>
                </div>
              </div>
            </div>
          )}          {/* User info (collapsed state) */}
          {uiState.isSidebarCollapsed && (
            <div className="p-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm mx-auto">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>          )}          {/* Date and Time Display - Responsive cho tất cả breakpoints */}
          <div className={`${uiState.isDarkMode ? 'bg-slate-800/30' : 'bg-slate-100/50'} mx-2 mb-3 rounded-lg p-3 border ${uiState.isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            {!uiState.isSidebarCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className={`${uiState.isDarkMode ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
                  <span className={`text-xs font-medium ${uiState.isDarkMode ? 'text-slate-300' : 'text-slate-600'} truncate`}>
                    Thời gian hiện tại
                  </span>
                </div>
                <div className="space-y-1">
                  <div className={`text-sm font-semibold ${uiState.isDarkMode ? 'text-white' : 'text-slate-800'} truncate`}>
                    {time}
                  </div>
                  <div className={`text-xs ${uiState.isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-tight line-clamp-2`}>
                    {day}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Clock size={20} className={`${uiState.isDarkMode ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-1`} />
                <div className={`text-xs font-bold ${uiState.isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {time.split(':').slice(0, 2).join(':')}
                </div>
                <div className={`text-[10px] ${uiState.isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {new Intl.DateTimeFormat('vi-VN', {day: '2-digit', month: '2-digit'}).format(currentTime)}
                </div>
              </div>
            )}
          </div>          {/* Footer actions - responsive với các kích thước màn hình */}
          <div className={`${uiState.isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} px-2 py-2 ${uiState.isSidebarCollapsed ? 'flex flex-col items-center space-y-2' : 'flex flex-wrap justify-around gap-1'}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                uiState.isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
              } transition-colors duration-200`}
              onClick={handleDownload}
              title="Xuất báo cáo"
            >
              <Download size={uiState.isSidebarCollapsed ? 16 : 18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                uiState.isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
              } transition-colors duration-200`}
              onClick={handleSupport}
              title="Liên hệ hỗ trợ"
            >
              <Mail size={uiState.isSidebarCollapsed ? 16 : 18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                uiState.isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
              } transition-colors duration-200`}
              onClick={handleUpdates}
              title="Kiểm tra cập nhật"
            >
              <Info size={uiState.isSidebarCollapsed ? 16 : 18} />
            </motion.button>
          </div>
        </div>
      </aside>
    </>
  );
};
// Export the Sidebar component
export default Sidebar;
