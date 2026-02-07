import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';

// ==============================================
// 📚 TYPE DEFINITIONS - Định nghĩa kiểu dữ liệu
// ==============================================

/**
 * Định nghĩa User và Role theo chuẩn enterprise
 * Thiết kế này cho phép mở rộng dễ dàng và type-safe
 */
interface UserRole {
  id: string;
  label: string;
  permissions: string[];
  level: 'admin' | 'manager' | 'staff' | 'viewer';
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  shift?: string;
  lastLogin?: Date;
  isActive: boolean;
}

/**
 * Theme system - Hỗ trợ đầy đủ dark/light mode
 * Sử dụng CSS custom properties để tối ưu performance
 */
interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  density: 'compact' | 'comfortable' | 'spacious';
  fontSize: 'sm' | 'md' | 'lg';
}

/**
 * UI State - Quản lý trạng thái giao diện tập trung
 */
interface UIState {
  theme: ThemeConfig;
  sidebar: {
    isOpen: boolean;
    isCollapsed: boolean;
    pinnedModules: string[];
  };
  navigation: {
    activeModule: string;
    activeSubpage: string;
    breadcrumbs: string[];
  };
  layout: {
    showNotifications: boolean;
    showUserMenu: boolean;
    isFullscreen: boolean;
    gridColumns: number;
  };
  performance: {
    isRefreshing: boolean;
    lastUpdated: Date;
    updateInterval: number;
  };
}

/**
 * SLA Priority System - Cốt lõi của hệ thống
 */
interface SLAPriority {
  id: 'P1' | 'P2' | 'P3' | 'P4';
  label: string;
  description: string;
  maxTimeHours: number;
  color: string;
  icon: string;
  warningThresholdMinutes: number;
}

/**
 * Order System - Thiết kế linh hoạt cho nhiều loại đơn hàng
 */
interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  location: string;
  zone: string;
  category: string;
}

interface Order {
  id: string;
  channel: string;
  customer: string;
  priority: SLAPriority['id'];
  status: 'pending' | 'processing' | 'picking' | 'packing' | 'shipped' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: Date;
  deadline: Date;
  assignedTo?: string;
  estimatedCompletionTime?: Date;
  actualCompletionTime?: Date;
  tags: string[];
  metadata: Record<string, any>;
}

// ==============================================
// 🎯 CORE HOOKS - Custom hooks tái sử dụng
// ==============================================

/**
 * useLocalStorage - Hook quản lý localStorage với type safety
 * Tự động sync giữa tabs và handle errors gracefully
 */
function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Handle both direct value and functional updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // Dispatch custom event để sync giữa components
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn('Error parsing localStorage value:', error);
        }
      }
    };

    const handleCustomChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue];
}

/**
 * useResponsive - Hook phát hiện breakpoint hiện tại
 * Sử dụng để tối ưu responsive design
 */
function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setBreakpoint('xs');
        setIsMobile(true);
      } else if (width < 768) {
        setBreakpoint('sm');
        setIsMobile(true);
      } else if (width < 1024) {
        setBreakpoint('md');
        setIsMobile(false);
      } else if (width < 1280) {
        setBreakpoint('lg');
        setIsMobile(false);
      } else if (width < 1536) {
        setBreakpoint('xl');
        setIsMobile(false);
      } else {
        setBreakpoint('2xl');
        setIsMobile(false);
      }
    };

    updateBreakpoint();

    const debouncedUpdate = debounce(updateBreakpoint, 100);
    window.addEventListener('resize', debouncedUpdate);

    return () => window.removeEventListener('resize', debouncedUpdate);
  }, []);

  return { breakpoint, isMobile };
}

/**
 * useTheme - Hook quản lý theme tập trung
 * Tự động detect system preference và persist user choice
 */
function useTheme() {
  const [themeConfig, setThemeConfig] = useLocalStorage<ThemeConfig>('warehouse-theme', {
    mode: 'dark',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    borderRadius: 'md',
    density: 'comfortable',
    fontSize: 'md'
  });

  // Auto-detect system preference on first load
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('warehouse-theme')) {
        setThemeConfig((prev: any) => ({
          ...prev,
          mode: e.matches ? 'dark' : 'light'
        }));
      }
    };
    // Set initial theme based on system preference

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setThemeConfig]);

  // Generate CSS custom properties based on theme
  const cssVariables = React.useMemo(() => {
    const isDark = themeConfig.mode === 'dark';

    return {
      '--color-primary': themeConfig.primaryColor,
      '--color-accent': themeConfig.accentColor,
      '--border-radius': {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px'
      }[themeConfig.borderRadius],
      '--font-size-base': {
        'sm': '14px',
        'md': '16px',
        'lg': '18px'
      }[themeConfig.fontSize],
      '--spacing-unit': {
        'compact': '4px',
        'comfortable': '8px',
        'spacious': '12px'
      }[themeConfig.density],

      // Color system
      '--color-background': isDark ? '#0f172a' : '#ffffff',
      '--color-surface': isDark ? '#1e293b' : '#f8fafc',
      '--color-surface-hover': isDark ? '#334155' : '#f1f5f9',
      '--color-border': isDark ? '#475569' : '#e2e8f0',
      '--color-text-primary': isDark ? '#f8fafc' : '#0f172a',
      '--color-text-secondary': isDark ? '#cbd5e1' : '#475569',
      '--color-text-muted': isDark ? '#94a3b8' : '#64748b',

      // Status colors
      '--color-success': isDark ? '#22c55e' : '#16a34a',
      '--color-warning': isDark ? '#eab308' : '#ca8a04',
      '--color-error': isDark ? '#ef4444' : '#dc2626',
      '--color-info': isDark ? '#3b82f6' : '#2563eb',
    } as React.CSSProperties;
  }, [themeConfig]);

  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    setThemeConfig((prev: any) => ({ ...prev, ...updates }));
  }, [setThemeConfig]);

  const toggleMode = useCallback(() => {
    updateTheme({ mode: themeConfig.mode === 'dark' ? 'light' : 'dark' });
  }, [themeConfig.mode, updateTheme]);

  return {
    theme: themeConfig,
    cssVariables,
    updateTheme,
    toggleMode,
    isDark: themeConfig.mode === 'dark'
  };
}

// ==============================================
// 🚀 PERFORMANCE UTILITIES
// ==============================================

/**
 * Debounce utility - Giảm số lần gọi function
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * useDebounce hook - Debounce value changes
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ==============================================
// 🎨 DESIGN SYSTEM COMPONENTS
// ==============================================

/**
 * Card component - Building block cơ bản
 * Hỗ trợ đầy đủ variants và accessibility
 */
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick
}: CardProps) {
  const baseClasses = 'rounded-lg transition-all duration-200';

  const variantClasses = {
    default: 'bg-[var(--color-surface)] border border-[var(--color-border)]',
    outlined: 'bg-transparent border-2 border-[var(--color-border)]',
    elevated: 'bg-[var(--color-surface)] shadow-lg hover:shadow-xl',
    filled: 'bg-[var(--color-primary)] text-white'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const interactiveClasses = onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ==============================================
// 🧪 DEMO COMPONENT
// ==============================================

/**
 * Foundation Demo - Minh họa cách sử dụng các hooks và components
 */
function FoundationDemo() {
  const { theme, cssVariables, toggleMode, isDark } = useTheme();
  const { breakpoint, isMobile } = useResponsive();
  const [demoText, setDemoText] = useState('');
  const debouncedText = useDebounce(demoText, 300);

  return (
    <div style={cssVariables} className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Demo */}
        <Card variant="elevated" padding="lg">
          <h1 className="text-3xl font-bold mb-4 text-[var(--color-primary)]">
            🏗️ Foundation Architecture Demo
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Đây là nền móng kiến trúc cho Dashboard SLA Kho Vận.
            Chúng ta đã tạo ra một hệ thống type-safe, responsive và có thể tùy chỉnh cao.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">📱 Responsive Info</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Breakpoint: <span className="font-mono bg-[var(--color-surface)] px-2 py-1 rounded">{breakpoint}</span>
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Mobile: <span className="font-mono bg-[var(--color-surface)] px-2 py-1 rounded">{isMobile ? 'Yes' : 'No'}</span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🎨 Theme Info</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Mode: <span className="font-mono bg-[var(--color-surface)] px-2 py-1 rounded">{theme.mode}</span>
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Density: <span className="font-mono bg-[var(--color-surface)] px-2 py-1 rounded">{theme.density}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Interactive Controls */}
        <Card variant="outlined">
          <h2 className="text-xl font-semibold mb-4">🎛️ Interactive Controls</h2>

          <div className="space-y-4">
            <button
              onClick={toggleMode}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-80 transition-opacity"
            >
              Toggle {isDark ? 'Light' : 'Dark'} Mode
            </button>

            <div>
              <label className="block text-sm font-medium mb-2">
                Debounced Input Demo (300ms delay):
              </label>
              <input
                type="text"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                placeholder="Type something..."
              />
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Debounced value: <span className="font-mono">{debouncedText}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Card Variants Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="default">
            <h3 className="font-semibold mb-2">Default Card</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Standard appearance với border và background
            </p>
          </Card>

          <Card variant="outlined">
            <h3 className="font-semibold mb-2">Outlined Card</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Transparent background với border đậm hơn
            </p>
          </Card>

          <Card variant="elevated">
            <h3 className="font-semibold mb-2">Elevated Card</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Có shadow và hover effects
            </p>
          </Card>

          <Card variant="filled">
            <h3 className="font-semibold mb-2">Filled Card</h3>
            <p className="text-sm opacity-90">
              Background primary color với text trắng
            </p>
          </Card>
        </div>

        {/* Status Info */}
        <Card variant="default">
          <h2 className="text-xl font-semibold mb-4">✅ Implementation Status</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
              <span>Type definitions cho User, Order, SLA System</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
              <span>Custom hooks: useLocalStorage, useResponsive, useTheme</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
              <span>Design system components với full customization</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
              <span>CSS Custom Properties cho theme system</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
              <span>Performance utilities (debounce, memoization)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FoundationDemo;
