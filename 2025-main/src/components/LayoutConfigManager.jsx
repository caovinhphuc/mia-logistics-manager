import React from 'react';
import { useLayout } from '../context/LayoutContext';
import ErrorBoundary from './ErrorBoundary';
import { AlertCircle, Settings, Database, CheckCircle, XCircle } from 'lucide-react';

// ==================== FALLBACK COMPONENT ====================
const LayoutConfigErrorFallback = ({ error, onRetry }) => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-center gap-2 mb-3">
      <AlertCircle className="h-5 w-5 text-yellow-600" />
      <h3 className="font-medium text-yellow-800">Layout Configuration Error</h3>
    </div>
    <p className="text-yellow-700 text-sm mb-3">
      Không thể tải cấu hình layout. Lỗi: {error?.message || 'Unknown error'}
    </p>
    <button
      onClick={onRetry}
      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
    >
      Thử lại
    </button>
  </div>
);

// ==================== SAFE HELPER FUNCTIONS ====================
const SafeDataAccess = {
  // Safe get nested property
  get: (obj, path, defaultValue = null) => {
    try {
      if (!obj || typeof obj !== 'object') return defaultValue;

      const keys = path.split('.');
      let current = obj;

      for (const key of keys) {
        if (current == null || typeof current !== 'object' || !(key in current)) {
          return defaultValue;
        }
        current = current[key];
      }

      return current !== undefined ? current : defaultValue;
    } catch (error) {
      console.warn(`SafeDataAccess.get failed for path "${path}":`, error);
      return defaultValue;
    }
  },

  // Safe array check
  isValidArray: (arr) => {
    return Array.isArray(arr) && arr.length > 0;
  },

  // Safe object check
  isValidObject: (obj) => {
    return obj != null && typeof obj === 'object' && !Array.isArray(obj);
  },

  // Safe string check
  isValidString: (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  }
};

// ==================== MAIN COMPONENT ====================
const LayoutConfigManagerCore = () => {
  // Safe context access với comprehensive error handling
  let layoutContext = null;
  let contextError = null;

  try {
    layoutContext = useLayout();
  } catch (error) {
    contextError = error;
    console.error('LayoutContext access failed:', error);
  }

  // Handle context error
  if (contextError || !layoutContext) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-bold text-red-800">Context Unavailable</h3>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-red-700">
            Layout context is not available. Component must be wrapped with LayoutProvider.
          </p>
          {contextError && (
            <p className="text-red-600 font-mono text-xs bg-red-100 p-2 rounded">
              Error: {contextError.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // COMPLETELY SAFE data extraction với fallbacks
  const safeData = {
    pages: SafeDataAccess.get(layoutContext, 'pages', []),
    getPageById: SafeDataAccess.get(layoutContext, 'getPageById', () => null),
    themeClasses: SafeDataAccess.get(layoutContext, 'themeClasses', {}),
    globalViewMode: SafeDataAccess.get(layoutContext, 'globalViewMode', 'desktop'),
    isInitialized: SafeDataAccess.get(layoutContext, 'isInitialized', false),
    darkMode: SafeDataAccess.get(layoutContext, 'darkMode', false)
  };

  // Wait for initialization
  if (!safeData.isInitialized) {
    return (
      <div className="p-4 flex items-center gap-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm">Đang khởi tạo layout...</span>
      </div>
    );
  }

  // SAFE dashboard retrieval - NO UNSAFE ACCESS
  const getDashboardSafely = () => {
    try {
      // Method 1: Try getPageById function if it exists and is a function
      if (typeof safeData.getPageById === 'function') {
        const result = safeData.getPageById('dashboard');
        if (SafeDataAccess.isValidObject(result) && result.id === 'dashboard') {
          return result;
        }
      }

      // Method 2: Search in pages array safely
      if (SafeDataAccess.isValidArray(safeData.pages)) {
        for (const page of safeData.pages) {
          if (SafeDataAccess.isValidObject(page) && page.id === 'dashboard') {
            return page;
          }
        }
      }

      // Method 3: Return safe default
      return {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/',
        icon: 'Home',
        widgets: []
      };
    } catch (error) {
      console.warn('getDashboardSafely failed:', error);
      return {
        id: 'dashboard',
        name: 'Dashboard (Error)',
        path: '/',
        icon: 'Home',
        widgets: []
      };
    }
  };

  const dashboardPage = getDashboardSafely();

  // SAFE theme class access
  const getThemeClass = (path, fallback) => {
    return SafeDataAccess.get(safeData.themeClasses, path, fallback);
  };

  const themeClasses = {
    surface: getThemeClass('surface', 'bg-white'),
    border: getThemeClass('border', 'border-gray-200'),
    textPrimary: getThemeClass('text.primary', 'text-gray-900'),
    textSecondary: getThemeClass('text.secondary', 'text-gray-600'),
    textMuted: getThemeClass('text.muted', 'text-gray-500')
  };

  // Safe pages validation
  const validPages = SafeDataAccess.isValidArray(safeData.pages)
    ? safeData.pages.filter(page => SafeDataAccess.isValidObject(page))
    : [];

  return (
    <div className={`layout-config-manager p-6 ${themeClasses.surface} rounded-lg`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className={`text-xl font-bold ${themeClasses.textPrimary}`}>
            Cấu hình Layout
          </h2>
          <p className={`text-sm ${themeClasses.textMuted}`}>
            Quản lý cấu hình bố cục và widgets
          </p>
        </div>
      </div>

      {/* System Status */}
      <div className={`p-4 mb-6 rounded-lg border ${themeClasses.border} bg-green-50`}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h4 className="font-medium text-green-800">System Status</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-green-700 font-medium">Context:</span>
            <span className="text-green-600">✓ OK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700 font-medium">Pages:</span>
            <span className="text-green-600">{validPages.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700 font-medium">Dashboard:</span>
            <span className="text-green-600">
              {SafeDataAccess.isValidObject(dashboardPage) ? '✓ Found' : '✗ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700 font-medium">Theme:</span>
            <span className="text-green-600">
              {SafeDataAccess.isValidObject(safeData.themeClasses) ? '✓ OK' : '✗ Default'}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Info */}
      <div className={`p-4 rounded-lg border ${themeClasses.border} mb-4`}>
        <h3 className={`font-semibold mb-3 ${themeClasses.textPrimary}`}>
          Dashboard Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>ID:</span>
              <span className={`text-sm ${themeClasses.textMuted}`}>
                {SafeDataAccess.get(dashboardPage, 'id', 'N/A')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>Name:</span>
              <span className={`text-sm ${themeClasses.textMuted}`}>
                {SafeDataAccess.get(dashboardPage, 'name', 'N/A')}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>Path:</span>
              <span className={`text-sm ${themeClasses.textMuted}`}>
                {SafeDataAccess.get(dashboardPage, 'path', 'N/A')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>Widgets:</span>
              <span className={`text-sm ${themeClasses.textMuted}`}>
                {SafeDataAccess.isValidArray(SafeDataAccess.get(dashboardPage, 'widgets', []))
                  ? dashboardPage.widgets.length
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Settings */}
      <div className={`p-4 rounded-lg border ${themeClasses.border} mb-4`}>
        <h3 className={`font-semibold mb-2 ${themeClasses.textPrimary}`}>
          Global Settings
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>View Mode:</span>
            <span className={`text-sm px-2 py-1 rounded ${themeClasses.border} bg-gray-50 ${themeClasses.textMuted}`}>
              {SafeDataAccess.isValidString(safeData.globalViewMode) ? safeData.globalViewMode : 'desktop'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>Dark Mode:</span>
            <span className={`text-sm px-2 py-1 rounded ${themeClasses.border} bg-gray-50 ${themeClasses.textMuted}`}>
              {safeData.darkMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className={`p-4 rounded-lg border ${themeClasses.border}`}>
        <h3 className={`font-semibold mb-3 ${themeClasses.textPrimary}`}>
          Pages Overview ({validPages.length})
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {validPages.length > 0 ? (
            validPages.map((page, index) => (
              <div
                key={SafeDataAccess.get(page, 'id', `page-${index}`)}
                className={`p-3 rounded border ${themeClasses.border} hover:bg-gray-50 transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`font-medium ${themeClasses.textPrimary}`}>
                      {SafeDataAccess.get(page, 'name', 'Unnamed Page')}
                    </span>
                    <span className={`ml-2 text-sm ${themeClasses.textMuted}`}>
                      ({SafeDataAccess.get(page, 'path', 'No path')})
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${themeClasses.border} bg-gray-100 ${themeClasses.textMuted}`}>
                    {SafeDataAccess.get(page, 'icon', 'No icon')}
                  </span>
                </div>
                {SafeDataAccess.isValidArray(SafeDataAccess.get(page, 'widgets', [])) && (
                  <div className={`mt-1 text-xs ${themeClasses.textMuted}`}>
                    Widgets: {page.widgets.join(', ')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={`text-center py-4 ${themeClasses.textMuted}`}>
              <p>No valid pages available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== WRAPPED COMPONENT ====================
const LayoutConfigManager = () => {
  return (
    <ErrorBoundary
      componentName="LayoutConfigManager"
      fallback={LayoutConfigErrorFallback}
    >
      <LayoutConfigManagerCore />
    </ErrorBoundary>
  );
};

export default LayoutConfigManager;
