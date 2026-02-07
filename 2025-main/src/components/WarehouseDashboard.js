// ==================== MAIN DASHBOARD COMPONENT ====================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generateMockData } from './utils/mockData';
import Header from '../pages/Header.jsx';
import Sidebar from '../pages/Sidebar.jsx';
import MainContent from '../pages/MainContent.jsx';
import { LayoutProvider } from '../context/LayoutContext';
import LayoutConfigManager from './layout/LayoutConfigManager';
import useLayoutConfig from '../hooks/useLayoutConfig';
import { AuthContext } from '../context/AuthContext';
const WarehouseDashboard = () => {
  const { user, logout, hasPermission } = React.useContext(AuthContext);

  // UI State Management
  const [uiState, setUiState] = useState({
    isDarkMode: true,
    isSidebarCollapsed: false,
    isMobileMenuOpen: false,
    activeTab: 'dashboard',
    isRefreshing: false
  });

  // Data State
  const [data, setData] = useState(() => generateMockData());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Filters State
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    dateRange: 'today',
    searchTerm: ''
  });

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setUiState(prev => ({
        ...prev,
        isSidebarCollapsed: isMobile,
        isMobileMenuOpen: false
      }));
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculated metrics với performance optimization
  const metrics = useMemo(() => {
    const { orders, staff } = data;

    // Orders metrics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const overdueOrders = orders.filter(o => o.status === 'overdue').length;

    // Performance calculations
    const completedOnTime = orders.filter(o => o.status === 'completed' && o.dueDate > new Date()).length;
    const slaRate = totalOrders > 0 ? (completedOnTime / totalOrders * 100) : 0;

    // Staff metrics
    const activeStaff = staff.filter(s => s.status === 'active').length;
    const totalStaff = staff.length;
    const avgEfficiency = staff.reduce((acc, s) => acc + s.efficiency, 0) / totalStaff;

    // Throughput calculation (orders per hour)
    const completedToday = orders.filter(o => {
      const today = new Date();
      return o.status === 'completed' &&
             o.createdAt.toDateString() === today.toDateString();
    }).length;

    const throughput = Math.round(completedToday / 8); // 8 hour workday

    return {
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
        overdue: overdueOrders,
        completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100) : 0
      },
      performance: {
        slaRate: Number(slaRate.toFixed(1)),
        avgProcessTime: 25 + Math.floor(Math.random() * 10), // Mock avg processing time
        efficiency: Math.round(avgEfficiency),
        throughput
      },
      staff: {
        active: activeStaff,
        total: totalStaff,
        utilization: Math.round((activeStaff / totalStaff) * 100),
        productivity: Math.round(completedToday / activeStaff) || 0
      }
    };
  }, [data]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    setUiState(prev => ({ ...prev, isRefreshing: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setData(generateMockData());
    setLastUpdated(new Date());
    setUiState(prev => ({ ...prev, isRefreshing: false }));
  }, []);

  // UI update functions
  const updateUIState = useCallback((updates) => {
    setUiState(prev => ({ ...prev, ...updates }));
  }, []);

  // Theme classes configuration
  const themeClasses = useMemo(() => ({
    background: uiState.isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    surface: uiState.isDarkMode ? 'bg-gray-800' : 'bg-white',
    surfaceHover: uiState.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    border: uiState.isDarkMode ? 'border-gray-700' : 'border-gray-200',
    text: {
      primary: uiState.isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: uiState.isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: uiState.isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    input: uiState.isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'  }), [uiState.isDarkMode]);

  // Layout configuration
  const { isConfigOpen, openLayoutConfig, closeLayoutConfig, toggleLayoutConfig } = useLayoutConfig();

  return (
    <LayoutProvider>
      <div className={`h-screen w-screen overflow-hidden transition-colors duration-200 ${themeClasses.background} ${themeClasses.text.primary}`}>
        {/* Header Component */}
        <Header
          user={user}
          uiState={uiState}
          onUIStateChange={updateUIState}
          onRefresh={refreshData}
          onLogout={logout}
          lastUpdated={lastUpdated}
          themeClasses={themeClasses}
          onLayoutConfigOpen={openLayoutConfig}
        />

        <div className="flex h-full w-full">
          {/* Sidebar Component */}
          <Sidebar
            user={user}
            uiState={uiState}
            onUIStateChange={updateUIState}
            hasPermission={hasPermission}
            themeClasses={themeClasses}
            metrics={metrics}
          />

          {/* Main Content Area */}
          <MainContent
            user={user}
            uiState={uiState}
            data={data}
            metrics={metrics}
            filters={filters}
            onFiltersChange={setFilters}
            hasPermission={hasPermission}
            themeClasses={themeClasses}
          />
        </div>

        {/* Layout Configuration Modal */}
        <LayoutConfigManager
          themeClasses={themeClasses}
          isOpen={isConfigOpen}
          onClose={closeLayoutConfig}
        />
      </div>
    </LayoutProvider>
  );
};

export default WarehouseDashboard;
