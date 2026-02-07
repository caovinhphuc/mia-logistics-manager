import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ==================== CONTEXT CREATION ====================
const LayoutContext = createContext(null);

// ==================== DEFAULT DATA ====================
const DEFAULT_PAGES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/',
    icon: 'Home',
    widgets: ['inventory-overview', 'order-summary', 'staff-performance']
  },
  {
    id: 'staff-schedule',
    name: 'Lịch làm việc',
    path: '/staff/schedule',
    icon: 'Calendar',
    widgets: ['staff-schedule']
  },
  {
    id: 'staff-performance',
    name: 'Hiệu suất NV',
    path: '/staff/performance',
    icon: 'TrendingUp',
    widgets: ['staff-performance']
  },
  {
    id: 'inventory',
    name: 'Kho hàng',
    path: '/inventory',
    icon: 'Package',
    widgets: ['inventory-overview']
  },
  {
    id: 'orders',
    name: 'Đơn hàng',
    path: '/orders',
    icon: 'ShoppingCart',
    widgets: ['order-summary']
  },
];

const AVAILABLE_WIDGETS = [
  {
    id: 'staff-performance',
    name: 'Hiệu Suất Nhân Viên',
    component: 'StaffPerformanceWidget',
    category: 'staff',
    description: 'Theo dõi và đánh giá hiệu suất làm việc của nhân viên',
    icon: 'TrendingUp'
  },
  {
    id: 'staff-schedule',
    name: 'Lịch Làm Việc',
    component: 'StaffScheduleWidget',
    category: 'staff',
    description: 'Quản lý lịch làm việc và phân ca nhân viên',
    icon: 'Calendar'
  },
  {
    id: 'inventory-overview',
    name: 'Tổng Quan Kho',
    component: 'InventoryWidget',
    category: 'inventory',
    description: 'Tổng quan tình trạng kho hàng',
    icon: 'Package'
  },  {
    id: 'order-summary',
    name: 'Tóm Tắt Đơn Hàng',
    component: 'OrderSummaryWidget',
    category: 'orders',
    description: 'Thống kê đơn hàng theo thời gian thực',
    icon: 'ShoppingCart'
  }
];

// ==================== DEFAULT LAYOUTS ====================
const DEFAULT_LAYOUTS = {
  dashboard: {
    desktop: {
      columns: 4,
      widgets: [
        { id: 'inventory-overview', row: 0, col: 0, width: 2, height: 2, visible: true },
        { id: 'order-summary', row: 0, col: 2, width: 2, height: 2, visible: true },
        { id: 'staff-performance', row: 2, col: 0, width: 4, height: 2, visible: true }
      ]
    },
    tablet: {
      columns: 2,
      widgets: [
        { id: 'inventory-overview', row: 0, col: 0, width: 2, height: 2, visible: true },
        { id: 'order-summary', row: 2, col: 0, width: 2, height: 2, visible: true },
        { id: 'staff-performance', row: 4, col: 0, width: 2, height: 2, visible: true }
      ]
    },
    mobile: {
      columns: 1,
      widgets: [
        { id: 'inventory-overview', row: 0, col: 0, width: 1, height: 2, visible: true },
        { id: 'order-summary', row: 2, col: 0, width: 1, height: 2, visible: true },
        { id: 'staff-performance', row: 4, col: 0, width: 1, height: 2, visible: true }
      ]
    }
  },
  'staff-schedule': {
    desktop: {
      columns: 3,
      widgets: [
        { id: 'staff-schedule', row: 0, col: 0, width: 3, height: 4, visible: true }
      ]
    },
    tablet: {
      columns: 2,
      widgets: [
        { id: 'staff-schedule', row: 0, col: 0, width: 2, height: 4, visible: true }
      ]
    },
    mobile: {
      columns: 1,
      widgets: [
        { id: 'staff-schedule', row: 0, col: 0, width: 1, height: 4, visible: true }
      ]
    }
  },
  'staff-performance': {
    desktop: {
      columns: 3,
      widgets: [
        { id: 'staff-performance', row: 0, col: 0, width: 3, height: 4, visible: true }
      ]
    },
    tablet: {
      columns: 2,
      widgets: [
        { id: 'staff-performance', row: 0, col: 0, width: 2, height: 4, visible: true }
      ]
    },
    mobile: {
      columns: 1,
      widgets: [
        { id: 'staff-performance', row: 0, col: 0, width: 1, height: 4, visible: true }
      ]
    }
  },
  inventory: {
    desktop: {
      columns: 3,
      widgets: [
        { id: 'inventory-overview', row: 0, col: 0, width: 3, height: 4, visible: true }
      ]
    },
    tablet: {
      columns: 2,
      widgets: [
        { id: 'inventory-overview', row: 0, col: 0, width: 2, height: 4, visible: true }
      ]
    },
    mobile: {
      columns: 1,
      widgets: [
        { id: 'inventory-overview', row: 0, col: 0, width: 1, height: 4, visible: true }
      ]
    }
  },
  orders: {
    desktop: {
      columns: 3,
      widgets: [
        { id: 'order-summary', row: 0, col: 0, width: 3, height: 4, visible: true }
      ]
    },
    tablet: {
      columns: 2,
      widgets: [
        { id: 'order-summary', row: 0, col: 0, width: 2, height: 4, visible: true }
      ]
    },
    mobile: {
      columns: 1,
      widgets: [
        { id: 'order-summary', row: 0, col: 0, width: 1, height: 4, visible: true }
      ]
    }
  }
};

// ==================== CUSTOM HOOK ====================
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// ==================== PROVIDER COMPONENT ====================
export const LayoutProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize pages với proper error handling
  const [pages, setPages] = useState(() => {
    try {
      const savedPages = localStorage.getItem('layoutPages');
      if (savedPages) {
        const parsedPages = JSON.parse(savedPages);

        // Validate parsed data
        if (Array.isArray(parsedPages)) {
          // Ensure dashboard exists
          const hasDashboard = parsedPages.some(page => page && page.id === 'dashboard');
          if (!hasDashboard) {
            return [DEFAULT_PAGES[0], ...parsedPages];
          }
          return parsedPages;
        }
      }
      return DEFAULT_PAGES;
    } catch (error) {
      console.warn('Error loading pages from localStorage:', error);
      return DEFAULT_PAGES;
    }
  });
  // Initialize layouts state
  const [layouts, setLayouts] = useState(() => {
    try {
      const savedLayouts = localStorage.getItem('layoutConfigs');
      if (savedLayouts) {
        const parsedLayouts = JSON.parse(savedLayouts);
        // Merge with defaults to ensure all pages have layouts
        const mergedLayouts = { ...DEFAULT_LAYOUTS, ...parsedLayouts };
        console.log('LayoutContext - Loaded layouts from localStorage:', mergedLayouts);
        return mergedLayouts;
      }
      console.log('LayoutContext - Using DEFAULT_LAYOUTS:', DEFAULT_LAYOUTS);
      return DEFAULT_LAYOUTS;
    } catch (error) {
      console.warn('Error loading layouts from localStorage:', error);
      console.log('LayoutContext - Fallback to DEFAULT_LAYOUTS:', DEFAULT_LAYOUTS);
      return DEFAULT_LAYOUTS;
    }
  });

  const [globalViewMode, setGlobalViewMode] = useState(() => {
    try {
      return localStorage.getItem('globalViewMode') || 'desktop';
    } catch (error) {
      return 'desktop';
    }
  });

  const [darkMode, setDarkMode] = useState(false);

  // Initialize after component mount
  useEffect(() => {
    // Ensure we have valid pages data
    if (!Array.isArray(pages) || pages.length === 0) {
      setPages(DEFAULT_PAGES);
    }

    // Ensure dashboard exists
    const hasDashboard = pages.some(page => page && page.id === 'dashboard');
    if (!hasDashboard) {
      setPages(prev => [DEFAULT_PAGES[0], ...prev]);
    }

    setIsInitialized(true);
  }, [pages]);

  const themeClasses = {
    card: darkMode
      ? "bg-gray-800 border-gray-700 text-gray-300"
      : "bg-white border-gray-200 text-gray-900",
    buttonPrimary: darkMode
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-blue-500 text-white hover:bg-blue-600",
    buttonSecondary: darkMode
      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300",
    surface: darkMode ? "bg-gray-800" : "bg-white",
    surfaceHover: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    text: {
      primary: darkMode ? "text-white" : "text-gray-900",
      secondary: darkMode ? "text-gray-400" : "text-gray-600",
      muted: darkMode ? "text-gray-500" : "text-gray-500"
    },
    input: darkMode
      ? "bg-gray-800 text-white border-gray-600"
      : "bg-white text-gray-900 border-gray-300"
  };

  // Safe functions với proper validation
  const getPageById = useCallback((pageId) => {
    if (!pageId || typeof pageId !== 'string') return null;

    try {
      if (!Array.isArray(pages)) return null;

      const foundPage = pages.find(page => page && page.id === pageId);

      // Special handling cho dashboard
      if (pageId === 'dashboard' && !foundPage) {
        return DEFAULT_PAGES[0];
      }

      return foundPage || null;
    } catch (error) {
      console.error('Error in getPageById:', error);
      return pageId === 'dashboard' ? DEFAULT_PAGES[0] : null;
    }
  }, [pages]);

  const getPageList = useCallback(() => {
    return Array.isArray(pages) ? pages : DEFAULT_PAGES;
  }, [pages]);

  const getAllAvailableWidgets = useCallback(() => {
    return AVAILABLE_WIDGETS || [];
  }, []);

  const getWidgetsByCategory = useCallback((category) => {
    if (!category) return [];
    return AVAILABLE_WIDGETS.filter(widget => widget?.category === category) || [];
  }, []);

  const getWidgetById = useCallback((widgetId) => {
    if (!widgetId) return null;
    return AVAILABLE_WIDGETS.find(widget => widget?.id === widgetId) || null;
  }, []);

  const getWidgetCategories = useCallback(() => {
    try {
      const categorySet = new Set(
        AVAILABLE_WIDGETS
          .map(widget => widget?.category)
          .filter(Boolean)
      );

      const categories = Array.from(categorySet);

      return categories.map(category => ({
        id: category,
        name: category,
        count: AVAILABLE_WIDGETS.filter(w => w?.category === category).length
      }));
    } catch (error) {
      console.error('Error getting widget categories:', error);
      return [];
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const updateGlobalViewMode = useCallback((mode) => {
    if (!mode) return;
    try {
      setGlobalViewMode(mode);
      localStorage.setItem('globalViewMode', mode);
    } catch (error) {
      console.error('Error updating view mode:', error);
    }
  }, []);
  // Layout management functions
  const updateLayout = useCallback((pageId, viewMode, newLayout) => {
    setLayouts(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [viewMode]: newLayout
      }
    }));
    // Save to localStorage
    try {
      const updatedLayouts = {
        ...layouts,
        [pageId]: {
          ...layouts[pageId],
          [viewMode]: newLayout
        }
      };
      localStorage.setItem('layoutConfigs', JSON.stringify(updatedLayouts));
    } catch (error) {
      console.error('Error saving layouts:', error);
    }
  }, [layouts]);

  const toggleWidgetVisibility = useCallback((pageId, viewMode, widgetId) => {
    setLayouts(prev => {
      const currentLayout = prev[pageId]?.[viewMode];
      if (!currentLayout) return prev;

      const updatedWidgets = currentLayout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
      );

      const newLayouts = {
        ...prev,
        [pageId]: {
          ...prev[pageId],
          [viewMode]: {
            ...currentLayout,
            widgets: updatedWidgets
          }
        }
      };

      // Save to localStorage
      try {
        localStorage.setItem('layoutConfigs', JSON.stringify(newLayouts));
      } catch (error) {
        console.error('Error saving layouts:', error);
      }

      return newLayouts;
    });
  }, []);

  const addWidgetToPage = useCallback((pageId, viewMode, widgetId) => {
    // Implementation for adding widget
    console.log('Adding widget:', { pageId, viewMode, widgetId });
  }, []);

  const removeWidgetFromPage = useCallback((pageId, viewMode, widgetId) => {
    // Implementation for removing widget
    console.log('Removing widget:', { pageId, viewMode, widgetId });
  }, []);

  const getPageName = useCallback((pageId) => {
    const page = pages.find(p => p.id === pageId);
    return page?.name || pageId;
  }, [pages]);

  const getUnusedWidgets = useCallback((pageId, viewMode) => {
    const currentLayout = layouts[pageId]?.[viewMode];
    if (!currentLayout) return AVAILABLE_WIDGETS;

    const usedWidgetIds = currentLayout.widgets.map(w => w.id);
    return AVAILABLE_WIDGETS.filter(widget => !usedWidgetIds.includes(widget.id));
  }, [layouts]);

  const getWidgetInfo = useCallback((widgetId) => {
    return AVAILABLE_WIDGETS.find(widget => widget.id === widgetId);
  }, []);

  const resetLayout = useCallback((pageId) => {
    if (DEFAULT_LAYOUTS[pageId]) {
      setLayouts(prev => ({
        ...prev,
        [pageId]: DEFAULT_LAYOUTS[pageId]
      }));

      try {
        const updatedLayouts = {
          ...layouts,
          [pageId]: DEFAULT_LAYOUTS[pageId]
        };
        localStorage.setItem('layoutConfigs', JSON.stringify(updatedLayouts));
      } catch (error) {
        console.error('Error saving layouts:', error);
      }
    }
  }, [layouts]);

  const resetAllLayouts = useCallback(() => {
    setLayouts(DEFAULT_LAYOUTS);
    try {
      localStorage.setItem('layoutConfigs', JSON.stringify(DEFAULT_LAYOUTS));
    } catch (error) {
      console.error('Error saving layouts:', error);
    }
  }, []);

  const getAvailableWidgetsByCategory = useCallback((category) => {
    return AVAILABLE_WIDGETS.filter(widget => widget.category === category);
  }, []);
  // Context value với proper validation
  const value = {
    isInitialized,
    globalViewMode: globalViewMode || 'desktop',
    setGlobalViewMode: updateGlobalViewMode,
    darkMode: Boolean(darkMode),
    setDarkMode,
    themeClasses: themeClasses || {},
    toggleDarkMode,
    pages: Array.isArray(pages) ? pages : DEFAULT_PAGES,
    layouts: layouts || DEFAULT_LAYOUTS,
    updateLayout,
    toggleWidgetVisibility,
    addWidgetToPage,
    removeWidgetFromPage,
    getPageList,
    getPageById,
    getPageName,
    getAllAvailableWidgets,
    getWidgetsByCategory,
    getWidgetById,
    getWidgetCategories,
    getAvailableWidgetsByCategory,
    getUnusedWidgets,
    getWidgetInfo,
    resetLayout,
    resetAllLayouts
  };
  // Debug logging
  console.log('LayoutProvider - Context value created:');
  console.log('layouts state value:', layouts);
  console.log('layouts in value object:', value.layouts);
  console.log('isInitialized:', value.isInitialized);
  console.log('layouts === DEFAULT_LAYOUTS:', layouts === DEFAULT_LAYOUTS);
  console.log('typeof layouts:', typeof layouts);

  // Additional validation
  if (!layouts) {
    console.error('❌ CRITICAL: layouts is null/undefined! Forcing DEFAULT_LAYOUTS');
    setLayouts(DEFAULT_LAYOUTS);
  }

  // Don't render children until initialized
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

// ==================== EXPORTS ====================
export { LayoutContext };
export default LayoutContext;
