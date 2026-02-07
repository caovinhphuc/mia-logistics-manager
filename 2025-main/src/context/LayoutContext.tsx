import React, { createContext, useContext, useState, useCallback } from 'react';

// ==================== TYPES ====================
interface Page {
  id: string;
  name: string;
  path: string;
  icon: string;
  widgets?: string[];
}

interface LayoutContextType {
  globalViewMode: string;
  setGlobalViewMode: (mode: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  themeClasses: {
    card: string;
    buttonPrimary: string;
    buttonSecondary: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    input: string;
  };
  toggleDarkMode: () => void;
  pages: Page[];
  getPageList: () => Page[];
  getPageById: (pageId: string) => Page | null;
  getAllAvailableWidgets: () => any[];
  getWidgetsByCategory: (category: string) => any[];
  getWidgetById: (widgetId: string) => any | null;
  getWidgetCategories: () => any[];
}

// ==================== CONTEXT CREATION ====================
const LayoutContext = createContext<LayoutContextType | null>(null);

// ==================== DEFAULT DATA ====================
const DEFAULT_PAGES: Page[] = [
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
  },
  {
    id: 'order-summary',
    name: 'Tóm Tắt Đơn Hàng',
    component: 'OrderSummaryWidget',
    category: 'orders',
    description: 'Thống kê đơn hàng theo thời gian thực',
    icon: 'ShoppingCart'
  }
];

// ==================== CUSTOM HOOK ====================
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// ==================== PROVIDER COMPONENT ====================
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>(() => {
    try {
      const savedPages = localStorage.getItem('layoutPages');
      if (savedPages) {
        const parsedPages: Page[] = JSON.parse(savedPages);
        const hasDashboard = parsedPages.some(page => page?.id === 'dashboard');
        if (!hasDashboard) {
          return [DEFAULT_PAGES[0], ...parsedPages];
        }
        return parsedPages;
      }
      return DEFAULT_PAGES;
    } catch (error) {
      console.warn('Error loading pages from localStorage:', error);
      return DEFAULT_PAGES;
    }
  });

  const [globalViewMode, setGlobalViewMode] = useState<string>(() => {
    try {
      return localStorage.getItem('globalViewMode') || 'desktop';
    } catch (error) {
      return 'desktop';
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  const getPageById = useCallback((pageId: string): Page | null => {
    if (!pageId) return null;

    try {
      const foundPage = pages.find(page => page?.id === pageId);
      if (pageId === 'dashboard' && !foundPage) {
        return DEFAULT_PAGES[0];
      }
      return foundPage || null;
    } catch (error) {
      console.error('Error in getPageById:', error);
      return pageId === 'dashboard' ? DEFAULT_PAGES[0] : null;
    }
  }, [pages]);

  const getPageList = useCallback((): Page[] => {
    return pages || DEFAULT_PAGES;
  }, [pages]);

  const getAllAvailableWidgets = useCallback(() => {
    return AVAILABLE_WIDGETS || [];
  }, []);

  const getWidgetsByCategory = useCallback((category: string) => {
    if (!category) return [];
    return AVAILABLE_WIDGETS.filter(widget => widget?.category === category) || [];
  }, []);

  const getWidgetById = useCallback((widgetId: string) => {
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

      // Sử dụng Array.from thay vì spread operator
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

  const updateGlobalViewMode = useCallback((mode: string) => {
    if (!mode) return;
    try {
      setGlobalViewMode(mode);
      localStorage.setItem('globalViewMode', mode);
    } catch (error) {
      console.error('Error updating view mode:', error);
    }
  }, []);

  const value: LayoutContextType = {
    globalViewMode,
    setGlobalViewMode: updateGlobalViewMode,
    darkMode,
    setDarkMode,
    themeClasses,
    toggleDarkMode,
    pages,
    getPageList,
    getPageById,
    getAllAvailableWidgets,
    getWidgetsByCategory,
    getWidgetById,
    getWidgetCategories
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutContext };
export default LayoutContext;
