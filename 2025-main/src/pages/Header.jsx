// Header.jsx - Enhanced and Optimized Version
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Package, Bell, LogOut, RefreshCw, Sun, Moon, Search, Menu, Layout,
  Settings, User, Shield, ChevronDown, AlertCircle, CheckCircle,
  Clock, Activity, Database, Wifi, WifiOff, Zap, Globe,
  Star, Filter, BarChart3
} from 'lucide-react';



// ==================== ENHANCED HEADER COMPONENT ====================
const Header = React.memo(({
  user, uiState, onUIStateChange, onRefresh, onLogout,
  onMobileMenuToggle, lastUpdated, themeClasses, onLayoutConfigOpen
}) => {
  // State for dropdowns and UI interactions
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [systemStatus, setSystemStatus] = useState('online'); // online, degraded, offline
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [_connectionSpeed, setConnectionSpeed] = useState('fast');

  // Refs for click outside functionality
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Enhanced notifications data with more variety
  const notifications = useMemo(() => [
    {
      id: 1,
      type: 'warning',
      title: 'Đơn hàng quá hạn',
      message: '5 đơn hàng cần xử lý khẩn cấp trong khu vực A-01',
      time: '5 phút trước',
      unread: true,
      priority: 'high',
      category: 'orders'
    },
    {
      id: 2,
      type: 'success',
      title: 'Hoàn thành mục tiêu SLA',
      message: 'Đã đạt 95% SLA target hôm nay - vượt mức kỳ vọng!',
      time: '1 giờ trước',
      unread: true,
      priority: 'medium',
      category: 'performance'
    },
    {
      id: 3,
      type: 'info',
      title: 'Cập nhật hệ thống',
      message: 'Phiên bản 2.1.0 đã được cài đặt và đang hoạt động ổn định',
      time: '3 giờ trước',
      unread: false,
      priority: 'low',
      category: 'system'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Thành tích mới',
      message: 'Đội nhóm đã xử lý 1000+ đơn hàng trong tuần này',
      time: '6 giờ trước',
      unread: true,
      priority: 'medium',
      category: 'achievement'
    }
  ], []);

  // Enhanced search suggestions with categories
  const searchSuggestions = useMemo(() => [
    { type: 'order', label: 'Đơn hàng #ORD-001245', value: 'ORD-001245', category: 'Đơn hàng gần đây' },
    { type: 'staff', label: 'Nguyễn Văn Minh - Quản lý kho', value: 'staff-001', category: 'Nhân viên' },
    { type: 'product', label: 'iPhone 15 Pro Max - SKU:IP15PM', value: 'product-ip15pm', category: 'Sản phẩm hot' },
    { type: 'location', label: 'Khu vực A-01-01 (Tầng 1)', value: 'location-a0101', category: 'Vị trí kho' },
    { type: 'report', label: 'Báo cáo hiệu suất tháng 12', value: 'report-dec', category: 'Báo cáo' },
    { type: 'setting', label: 'Cài đặt thông báo', value: 'setting-notification', category: 'Cài đặt' }
  ], []);

  // Enhanced system metrics with real-time simulation
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 65,
    memory: 78,
    network: 'excellent',
    database: 'connected',
    activeUsers: 24,
    totalOrders: 1247,
    completionRate: 95.8,
    lastBackup: '2 giờ trước',
    responseTime: '120ms'
  });

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        responseTime: `${Math.floor(Math.random() * 50 + 100)}ms`,
        activeUsers: Math.max(15, Math.min(50, prev.activeUsers + Math.floor((Math.random() - 0.5) * 6)))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSystemStatus('online');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSystemStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed periodically
    const checkConnection = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const speed = connection.effectiveType;
        setConnectionSpeed(speed);
        if (speed === 'slow-2g' || speed === '2g') {
          setSystemStatus('degraded');
        }
      }
    };

    const connectionInterval = setInterval(checkConnection, 60000);
    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionInterval);
    };
  }, []);

  // Optimized click outside handler
  const handleClickOutside = useCallback((event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setShowUserMenu(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Memoized calculations
  const unreadNotifications = useMemo(() =>
    notifications.filter(n => n.unread).length, [notifications]
  );

  const highPriorityNotifications = useMemo(() =>
    notifications.filter(n => n.priority === 'high' && n.unread).length, [notifications]
  );

  // Enhanced notification icon with priority colors
  const getNotificationIcon = useCallback((notification) => {
    const iconProps = { size: 16, className: "" };

    switch (notification.type) {
      case 'warning':
        iconProps.className = notification.priority === 'high' ? 'text-red-500' : 'text-yellow-500';
        return <AlertCircle {...iconProps} />;
      case 'success':
        iconProps.className = 'text-green-500';
        return <CheckCircle {...iconProps} />;
      case 'achievement':
        iconProps.className = 'text-purple-500';
        return <Star {...iconProps} />;
      case 'info':
      default:
        iconProps.className = 'text-blue-500';
        return <Activity {...iconProps} />;
    }
  }, []);

  // System status styling
  const getSystemStatusIndicator = useMemo(() => {
    const baseClass = "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium";
    switch (systemStatus) {
      case 'online':
        return {
          className: `${baseClass} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`,
          icon: <Wifi size={12} />,
          text: 'Trực tuyến',
          pulse: false
        };
      case 'degraded':
        return {
          className: `${baseClass} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`,
          icon: <Activity size={12} />,
          text: 'Chậm',
          pulse: true
        };
      case 'offline':
        return {
          className: `${baseClass} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`,
          icon: <WifiOff size={12} />,
          text: 'Ngoại tuyến',
          pulse: true
        };      default:        return {
          className: `${baseClass} bg-gray-100 dark:bg-gray-800 ${themeClasses.text.muted}`,
          icon: <Globe size={12} />,
          text: 'Không xác định',
          pulse: false
        };
    }
  }, [systemStatus, themeClasses.text.muted]);

  // Optimized handlers
  const handleRefresh = useCallback(() => {
    if (!uiState.isRefreshing) {
      onRefresh();
    }
  }, [onRefresh, uiState.isRefreshing]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion.value);
    setShowSearchSuggestions(false);
    // Here you could add actual search functionality
    console.log('Searching for:', suggestion);
  }, []);

  const handleThemeToggle = useCallback(() => {
    onUIStateChange({ isDarkMode: !uiState.isDarkMode });
  }, [onUIStateChange, uiState.isDarkMode]);  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.surface} border-b ${themeClasses.border} backdrop-blur-md bg-opacity-95 shadow-xl transition-all duration-300`}>
      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section - Enhanced Logo and Brand */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle with animation */}
          <button
            onClick={onMobileMenuToggle}
            className={`lg:hidden p-2.5 rounded-xl ${themeClasses.surfaceHover} transition-all duration-200 hover:scale-105 active:scale-95 group`}
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} className={`${themeClasses.text.primary} group-hover:rotate-90 transition-transform duration-200`} />
          </button>

          {/* Enhanced Logo and brand section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                <Package className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />

                {/* System status pulse indicator */}
                {systemStatus === 'online' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Performance ring indicator */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                   style={{
                     background: `conic-gradient(from 0deg, #22c55e ${systemMetrics.completionRate * 3.6}deg, transparent 0deg)`,
                     padding: '2px',
                     borderRadius: '12px'
                   }}>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MIA.vn
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <p className={`text-sm ${themeClasses.text.secondary} leading-none font-medium`}>
                </p>

                {/* Enhanced status indicator */}
                <div className={`${getSystemStatusIndicator.className} ${getSystemStatusIndicator.pulse ? 'animate-pulse' : ''}`}>
                  {getSystemStatusIndicator.icon}
                  <span>{getSystemStatusIndicator.text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search with Smart Suggestions */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
          <div className="relative w-full group">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted} group-focus-within:text-blue-500 transition-all duration-200 group-focus-within:scale-110`} size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng, nhân viên, sản phẩm, báo cáo..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchSuggestions(true)}
                className={`w-full pl-12 pr-6 py-3 rounded-xl ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg text-sm font-medium group-focus-within:shadow-xl`}
                aria-label="Search system"
              />

              {/* Search loading indicator */}
              {searchQuery && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Enhanced Search Suggestions Dropdown */}
            {showSearchSuggestions && (
              <div className={`absolute top-full left-0 right-0 mt-2 ${themeClasses.surface} rounded-xl border ${themeClasses.border} shadow-2xl z-50 overflow-hidden backdrop-blur-sm`}>
                <div className={`p-4 border-b ${themeClasses.border} bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-gray-800 dark:to-gray-700`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${themeClasses.text.primary}`}>Gợi ý tìm kiếm thông minh</h4>
                    <Filter size={14} className={`${themeClasses.text.muted}`} />
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {/* Group suggestions by category */}
                  {Object.entries(
                    searchSuggestions.reduce((acc, suggestion) => {
                      if (!acc[suggestion.category]) acc[suggestion.category] = [];
                      acc[suggestion.category].push(suggestion);
                      return acc;
                    }, {})
                  ).map(([category, suggestions]) => (
                    <div key={category}>
                      <div className={`px-4 py-2 text-xs font-medium ${themeClasses.text.muted} bg-gray-50 dark:bg-gray-800 border-b ${themeClasses.border}`}>
                        {category}
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={`${category}-${index}`}
                          className={`w-full text-left px-4 py-3 ${themeClasses.surfaceHover} transition-all duration-200 flex items-center space-x-3 hover:scale-[1.02] group`}
                          onClick={() => handleSearchSuggestionClick(suggestion)}
                          aria-label={`Search for ${suggestion.label}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 group-hover:scale-110 ${
                            suggestion.type === 'order' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                            suggestion.type === 'staff' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                            suggestion.type === 'product' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' :
                            suggestion.type === 'report' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                            suggestion.type === 'setting' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' :
                            'bg-pink-100 text-pink-600 dark:bg-pink-900/30'
                          }`}>
                            {suggestion.type === 'order' ? 'O' :
                             suggestion.type === 'staff' ? 'S' :
                             suggestion.type === 'product' ? 'P' :
                             suggestion.type === 'report' ? 'R' :
                             suggestion.type === 'setting' ? 'C' : 'L'}
                          </div>                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${themeClasses.text.primary}`}>
                              {suggestion.label}
                            </p>
                            <p className={`text-xs ${themeClasses.text.muted}`}>
                              {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                            </p>
                          </div>                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Search size={14} className={`${themeClasses.text.muted}`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>                <div className={`p-3 border-t ${themeClasses.border} bg-gray-50 dark:bg-gray-800`}>
                  <div className={`flex items-center justify-between text-xs ${themeClasses.text.muted}`}>
                    <span>Nhấn Enter để tìm kiếm nâng cao</span>
                    <div className="flex items-center space-x-2">
                      <kbd className={`px-2 py-1 ${themeClasses.surface} rounded text-xs font-mono border ${themeClasses.border}`}>↑↓</kbd>
                      <span>di chuyển</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>        {/* Right Section - Enhanced Action Buttons and Controls */}
        <div className="flex items-center space-x-1 lg:space-x-2">          {/* Real-time System Performance Dashboard */}
          <div className={`hidden xl:flex items-center space-x-3 px-4 py-2 rounded-xl ${themeClasses.surface} border ${themeClasses.border} bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50`}>
            {/* Database Status */}            <div className="flex items-center space-x-1 group cursor-pointer relative">
              <Database size={14} className={systemMetrics.database === 'connected' ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-xs font-medium ${themeClasses.text.primary}`}>
                DB: {systemMetrics.database}
              </span>
              <div className={`absolute invisible group-hover:visible ${themeClasses.surface} border ${themeClasses.border} ${themeClasses.text.primary} px-2 py-1 rounded text-xs -mt-8 whitespace-nowrap shadow-lg z-10`}>
                Response: {systemMetrics.responseTime}
              </div>
            </div>

            <div className={`w-px h-4 ${themeClasses.border}`}></div>

            {/* CPU Usage */}            <div className="flex items-center space-x-1 group cursor-pointer">
              <Zap size={14} className={systemMetrics.cpu > 80 ? 'text-red-500' : systemMetrics.cpu > 60 ? 'text-yellow-500' : 'text-green-500'} />
              <span className={`text-xs font-medium ${themeClasses.text.primary}`}>
                CPU: {Math.round(systemMetrics.cpu)}%
              </span>
              <div className={`w-12 h-1 ${themeClasses.border} rounded-full overflow-hidden`}>
                <div
                  className={`h-full transition-all duration-500 ${systemMetrics.cpu > 80 ? 'bg-red-500' : systemMetrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${systemMetrics.cpu}%` }}
                ></div>
              </div>
            </div>

            <div className={`w-px h-4 ${themeClasses.border}`}></div>

            {/* Active Users */}            <div className="flex items-center space-x-1">
              <User size={14} className="text-blue-500" />
              <span className={`text-xs font-medium ${themeClasses.text.primary}`}>
                {systemMetrics.activeUsers} online
              </span>
            </div>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="flex items-center space-x-1">
            {/* Enhanced Refresh button with progress indicator */}
            <div className="relative group">
              <button
                onClick={handleRefresh}
                disabled={uiState.isRefreshing}
                className={`p-3 rounded-xl ${themeClasses.surfaceHover} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 active:scale-95 group relative`}
                aria-label="Refresh data"
              >
                <RefreshCw size={18} className={`${uiState.isRefreshing ? 'animate-spin text-blue-500' : `${themeClasses.text.primary}`} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`} />

                {/* Progress ring for refresh */}
                {uiState.isRefreshing && (
                  <div className="absolute inset-0 rounded-xl border-2 border-blue-500 border-t-transparent animate-spin"></div>
                )}
              </button>              {/* Enhanced Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 ${themeClasses.surface} border ${themeClasses.border} ${themeClasses.text.primary} text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg`}>
                <div className="font-medium">Cập nhật dữ liệu</div>
                <div className={themeClasses.text.muted}>Lần cuối: {lastUpdated && lastUpdated instanceof Date ? lastUpdated.toLocaleTimeString('vi-VN') : '--:--'}</div>
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${themeClasses.surface}`} style={{borderTopColor: 'inherit'}}></div>
              </div>
            </div>            {/* Enhanced Layout configuration with smooth animations */}
            <button
              onClick={onLayoutConfigOpen}
              className={`p-3 rounded-xl ${themeClasses.surfaceHover} transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95 group relative overflow-hidden border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600`}
              title="Cấu hình Layout - Quản lý hiển thị và bố cục"
              aria-label="Layout configuration"
            >
              <Layout size={20} className={`${themeClasses.text.primary} group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300 group-hover:rotate-12`} />

              {/* Small indicator badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-all duration-300"></div>

              {/* Animated border pulse */}
              <div className="absolute inset-0 rounded-xl border-2 border-purple-500 opacity-0 group-hover:opacity-30 animate-pulse transition-all duration-300"></div>

              {/* Enhanced Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 ${themeClasses.surface} border ${themeClasses.border} ${themeClasses.text.primary} text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl z-50`}>
                <div className="font-semibold text-purple-600 dark:text-purple-400">Cấu hình Layout</div>
                <div className={`${themeClasses.text.muted} mt-1`}>Tùy chỉnh bố cục và widget hiển thị</div>
                <div className="flex items-center space-x-1 mt-2">
                  <Settings size={12} className="text-purple-500" />
                  <span className="text-xs text-purple-500">Nhấn để mở</span>
                </div>
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${themeClasses.surface}`} style={{borderTopColor: 'inherit'}}></div>
              </div>
            </button>

            {/* Enhanced Dark mode toggle with animation */}
            <button
              onClick={handleThemeToggle}
              className={`p-3 rounded-xl ${themeClasses.surfaceHover} transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95 group relative overflow-hidden`}
              title="Chuyển đổi chế độ"
              aria-label="Toggle theme"
            >
              <div className="relative z-10">
                {uiState.isDarkMode ?
                  <Sun size={18} className="group-hover:text-yellow-500 transition-all duration-300 group-hover:rotate-180" /> :
                  <Moon size={18} className="group-hover:text-indigo-500 transition-all duration-300 group-hover:rotate-12" />
                }
              </div>

              {/* Background animation */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                uiState.isDarkMode
                  ? 'bg-gradient-to-r from-yellow-500/0 to-yellow-500/20 group-hover:from-yellow-500/10 group-hover:to-yellow-500/30'
                  : 'bg-gradient-to-r from-indigo-500/0 to-indigo-500/20 group-hover:from-indigo-500/10 group-hover:to-indigo-500/30'
              }`}></div>
            </button>
          </div>

          {/* Enhanced Notifications with priority indicators */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 rounded-xl ${themeClasses.surfaceHover} relative transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95 group`}
              aria-label={`Notifications (${unreadNotifications} unread)`}
            >
              <Bell size={18} className={`${themeClasses.text.primary} group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors`} />

              {/* Enhanced notification badges */}
              {unreadNotifications > 0 && (
                <>
                  {/* Primary notification count */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>

                  {/* High priority indicator */}
                  {highPriorityNotifications > 0 && (
                    <span className="absolute -top-2 -left-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white dark:border-gray-800 animate-bounce"></span>
                  )}
                </>
              )}

              {/* Pulse ring for new notifications */}
              {unreadNotifications > 0 && (
                <div className="absolute inset-0 rounded-xl border-2 border-red-500 opacity-75 animate-ping"></div>
              )}
            </button>            {/* Enhanced Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute top-full right-0 mt-3 w-96 ${themeClasses.surface} rounded-xl border ${themeClasses.border} shadow-2xl z-50 overflow-hidden backdrop-blur-sm`}>
                {/* Header with stats */}
                <div className={`p-4 border-b ${themeClasses.border} bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700`}>
                  <div className="flex items-center justify-between">
                    <div>                      <h3 className={`font-semibold ${themeClasses.text.primary}`}>Thông báo hệ thống</h3>
                      <p className={`text-sm ${themeClasses.text.muted} mt-1`}>
                        {unreadNotifications} chưa đọc • {highPriorityNotifications} ưu tiên cao
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {highPriorityNotifications > 0 && (
                        <div className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
                          Khẩn cấp
                        </div>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        aria-label="Close notifications"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications list with enhanced styling */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b ${themeClasses.border} last:border-b-0 ${themeClasses.surfaceHover} transition-all duration-200 cursor-pointer group ${
                        notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      } ${notification.priority === 'high' ? 'border-l-4 border-red-500' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className={`text-sm font-medium ${themeClasses.text.primary} truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                                  {notification.title}
                                </h4>
                                {notification.priority === 'high' && (
                                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium">
                                    Khẩn cấp
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm ${themeClasses.text.muted} mt-1 line-clamp-2`}>
                                {notification.message}
                              </p>

                              {/* Enhanced timestamp and category */}
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs ${themeClasses.text.muted} flex items-center`}>
                                  <Clock size={12} className="mr-1" />
                                  {notification.time}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  notification.category === 'orders' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                  notification.category === 'performance' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  notification.category === 'system' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' :
                                  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                }`}>
                                  {notification.category}
                                </span>
                              </div>
                            </div>

                            {/* Unread indicator */}
                            {notification.unread && (
                              <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-1 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>                {/* Enhanced footer actions */}
                <div className={`p-3 border-t ${themeClasses.border} bg-gray-50 dark:bg-gray-800`}>
                  <div className="flex items-center justify-between">                    <button className={`text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors`}>
                      Đánh dấu tất cả đã đọc
                    </button>
                    <button className={`text-sm ${themeClasses.text.secondary} hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors`}>
                      Xem tất cả →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced User Profile with dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-3 ${themeClasses.surface} hover:${themeClasses.surfaceHover} border ${themeClasses.border} rounded-xl p-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 group`}
              aria-label="User menu"
            ><div className="hidden sm:block text-right">
                <p className={`text-sm font-semibold leading-none ${themeClasses.text.primary} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                  {user.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className={`text-xs ${themeClasses.text.muted} leading-none font-medium`}>
                    {user.role.label}
                  </p>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                </div>
              </div>

              {/* Enhanced avatar with status */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                {/* Online status indicator */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${isOnline ? 'bg-green-400' : 'bg-gray-400'} rounded-full border-2 border-white dark:border-gray-800 ${isOnline ? 'animate-pulse' : ''}`}>
                  {isOnline && <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>}
                </div>

                {/* Activity ring */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors duration-300"></div>
              </div>

              <ChevronDown size={16} className={`${themeClasses.text.muted} transition-all duration-300 group-hover:text-blue-500 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>            {/* Enhanced User Menu Dropdown */}
            {showUserMenu && (
              <div className={`absolute top-full right-0 mt-3 w-72 ${themeClasses.surface} rounded-xl border ${themeClasses.border} shadow-2xl z-50 overflow-hidden backdrop-blur-sm`}>
                {/* User info header */}
                <div className={`p-6 border-b ${themeClasses.border} bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-gray-800 dark:to-gray-700`}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      {/* Status badge */}
                      <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        isOnline
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${themeClasses.text.primary} text-lg`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm ${themeClasses.text.secondary} truncate`}>
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Shield size={14} className="text-blue-500" />
                        <span className={`text-xs ${themeClasses.text.muted} font-medium`}>
                          {user.role.label}
                        </span>
                        <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
                        <span className={`text-xs ${themeClasses.text.muted}`}>
                          ID: {user.id || 'USR-001'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu options */}
                <div className="py-2">
                  <button className={`w-full text-left px-4 py-3 ${themeClasses.surfaceHover} transition-all duration-200 flex items-center space-x-3 group`}>
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Hồ sơ cá nhân</span>
                      <p className={`text-xs ${themeClasses.text.muted}`}>Xem và chỉnh sửa thông tin</p>
                    </div>
                  </button>

                  <button className={`w-full text-left px-4 py-3 ${themeClasses.surfaceHover} transition-all duration-200 flex items-center space-x-3 group`}>
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings size={16} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Cài đặt tài khoản</span>
                      <p className={`text-xs ${themeClasses.text.muted}`}>Tùy chỉnh trải nghiệm</p>
                    </div>
                  </button>

                  <button className={`w-full text-left px-4 py-3 ${themeClasses.surfaceHover} transition-all duration-200 flex items-center space-x-3 group`}>
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield size={16} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Bảo mật & Quyền riêng tư</span>
                      <p className={`text-xs ${themeClasses.text.muted}`}>Quản lý bảo mật</p>
                    </div>
                  </button>

                  <button className={`w-full text-left px-4 py-3 ${themeClasses.surfaceHover} transition-all duration-200 flex items-center space-x-3 group`}>
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Thống kê hoạt động</span>
                      <p className={`text-xs ${themeClasses.text.muted}`}>Xem hiệu suất làm việc</p>
                    </div>
                  </button>
                </div>                {/* Quick stats */}
                <div className={`px-4 py-3 border-t border-b ${themeClasses.border} bg-gray-50 dark:bg-gray-800`}>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {systemMetrics.totalOrders}
                      </div>                      <div className={`text-xs ${themeClasses.text.muted}`}>Đơn hàng</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {systemMetrics.completionRate}%
                      </div>
                      <div className={`text-xs ${themeClasses.text.muted}`}>Hoàn thành</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {systemMetrics.activeUsers}
                      </div>
                      <div className={`text-xs ${themeClasses.text.muted}`}>Online</div>
                    </div>
                  </div>
                </div>

                {/* Logout section */}
                <div className="p-3">
                  <button
                    onClick={onLogout}
                    className={`w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 flex items-center space-x-3 group`}
                  >
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogOut size={16} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Đăng xuất</span>
                      <p className={`text-xs ${themeClasses.text.muted}`}>Kết thúc phiên làm việc</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Search Section */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative group">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted} group-focus-within:text-blue-500 transition-all duration-200 group-focus-within:scale-110`} size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, nhân viên..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchSuggestions(true)}
              className={`w-full pl-11 pr-12 py-3 rounded-xl ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-lg transition-all duration-300 text-sm font-medium`}
              aria-label="Mobile search"
            />

            {/* Mobile search actions */}            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`p-1 ${themeClasses.text.muted} hover:${themeClasses.text.secondary} transition-colors`}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
              <Filter size={14} className={`${themeClasses.text.muted}`} />
            </div>
          </div>          {/* Mobile search suggestions */}
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 ${themeClasses.surface} rounded-xl border ${themeClasses.border} shadow-xl z-50 overflow-hidden max-h-64`}>
              <div className={`p-3 border-b ${themeClasses.border} bg-gray-50 dark:bg-gray-800`}>
                <h4 className={`text-sm font-semibold ${themeClasses.text.primary}`}>Gợi ý tìm kiếm</h4>
              </div>
              <div className="overflow-y-auto max-h-48">
                {searchSuggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-4 py-3 ${themeClasses.surfaceHover} transition-colors flex items-center space-x-3`}
                    onClick={() => handleSearchSuggestionClick(suggestion)}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      suggestion.type === 'order' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                      suggestion.type === 'staff' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                      suggestion.type === 'product' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                    }`}>
                      {suggestion.type === 'order' ? 'O' :
                       suggestion.type === 'staff' ? 'S' :
                       suggestion.type === 'product' ? 'P' : 'L'}
                    </div>
                    <span className={`text-sm truncate ${themeClasses.text.primary}`}>{suggestion.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile system status bar */}
        <div className={`flex items-center justify-between mt-3 px-3 py-2 ${themeClasses.surface} rounded-lg`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              systemStatus === 'online' ? 'bg-green-400 animate-pulse' :
              systemStatus === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className={`text-xs font-medium ${themeClasses.text.secondary}`}>
              {systemStatus === 'online' ? 'Hệ thống ổn định' :
               systemStatus === 'degraded' ? 'Hệ thống chậm' : 'Hệ thống lỗi'}
            </span>
          </div>
          <div className={`flex items-center space-x-3 text-xs ${themeClasses.text.muted}`}>
            <span>CPU: {Math.round(systemMetrics.cpu)}%</span>
            <span>{systemMetrics.activeUsers} online</span>
          </div>
        </div>
      </div>
    </header>

  );
});

// Enhanced PropTypes with detailed validation
Header.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      permissions: PropTypes.array
    }).isRequired
  }).isRequired,

  uiState: PropTypes.shape({
    isDarkMode: PropTypes.bool.isRequired,
    isRefreshing: PropTypes.bool,
    sidebarCollapsed: PropTypes.bool,
    layoutConfig: PropTypes.object
  }).isRequired,

  onUIStateChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onMobileMenuToggle: PropTypes.func,
  onLayoutConfigOpen: PropTypes.func.isRequired,

  lastUpdated: PropTypes.instanceOf(Date),

  themeClasses: PropTypes.shape({
    surface: PropTypes.string.isRequired,
    surfaceHover: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired
  }).isRequired
};

// Default props for optional properties
Header.defaultProps = {
  onMobileMenuToggle: () => {},
  lastUpdated: null
};

// Display name for React DevTools
Header.displayName = 'EnhancedHeader';

export default Header;


