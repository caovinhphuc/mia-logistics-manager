import React from 'react';
import { useLayout } from '../context/LayoutContext';

interface ThemeClasses {
  surface?: string;
  border?: string;
  text?: {
    primary?: string;
    muted?: string;
  };
}

const LayoutConfigManager = () => {
  // Type-safe destructuring với proper interface
  const {
    pages = [],
    getPageById,
    themeClasses = {} as ThemeClasses,
    globalViewMode = 'desktop'
  } = useLayout() || {};

  // Safe function để lấy dashboard page
  const getDashboardPage = React.useCallback(() => {
    try {
      if (typeof getPageById === 'function') {
        const dashboard = getPageById('dashboard');
        if (dashboard) return dashboard;
      }

      if (Array.isArray(pages)) {
        const dashboard = pages.find(page => page?.id === 'dashboard');
        if (dashboard) return dashboard;
      }

      return {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/',
        icon: 'Home',
        widgets: []
      };
    } catch (error) {
      console.error('Error getting dashboard page:', error);
      return {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/',
        icon: 'Home',
        widgets: []
      };
    }
  }, [getPageById, pages]);

  const dashboardPage = getDashboardPage();

  // Safe access với proper type checking
  const surfaceClass = (themeClasses as ThemeClasses)?.surface || 'bg-white';
  const borderClass = (themeClasses as ThemeClasses)?.border || 'border-gray-200';
  const textPrimaryClass = (themeClasses as ThemeClasses)?.text?.primary || 'text-gray-900';
  const textMutedClass = (themeClasses as ThemeClasses)?.text?.muted || 'text-gray-500';

  return (
    <div className={`layout-config-manager p-4 ${surfaceClass}`}>
      <h2 className={`text-lg font-semibold mb-4 ${textPrimaryClass}`}>
        Cấu hình Layout
      </h2>

      {/* Dashboard Configuration */}
      <div className={`p-4 rounded-lg border ${borderClass} mb-4`}>
        <h3 className={`font-medium mb-2 ${textPrimaryClass}`}>
          Dashboard Configuration
        </h3>
        <div className="space-y-2">
          <p className={`text-sm ${textMutedClass}`}>
            <span className="font-medium">ID:</span> {dashboardPage?.id || 'N/A'}
          </p>
          <p className={`text-sm ${textMutedClass}`}>
            <span className="font-medium">Name:</span> {dashboardPage?.name || 'N/A'}
          </p>
          <p className={`text-sm ${textMutedClass}`}>
            <span className="font-medium">Path:</span> {dashboardPage?.path || 'N/A'}
          </p>
          <p className={`text-sm ${textMutedClass}`}>
            <span className="font-medium">Widgets:</span> {dashboardPage?.widgets?.length || 0}
          </p>
        </div>
      </div>

      {/* Global Settings */}
      <div className={`p-4 rounded-lg border ${borderClass} mb-4`}>
        <h3 className={`font-medium mb-2 ${textPrimaryClass}`}>
          Global Settings
        </h3>
        <p className={`text-sm ${textMutedClass}`}>
          <span className="font-medium">View Mode:</span> {globalViewMode}
        </p>
      </div>

      {/* Pages List */}
      <div className={`p-4 rounded-lg border ${borderClass}`}>
        <h3 className={`font-medium mb-2 ${textPrimaryClass}`}>
          All Pages ({Array.isArray(pages) ? pages.length : 0})
        </h3>
        <div className="space-y-2">
          {Array.isArray(pages) && pages.length > 0 ? (
            pages.map((page, index) => (
              <div
                key={page?.id || `page-${index}`}
                className={`p-2 rounded border ${borderClass}`}
              >
                <span className={`font-medium ${textPrimaryClass}`}>
                  {page?.name || 'Unnamed Page'}
                </span>
                <span className={`ml-2 text-sm ${textMutedClass}`}>
                  ({page?.path || 'No path'})
                </span>
              </div>
            ))
          ) : (
            <p className={`text-sm ${textMutedClass}`}>
              No pages available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutConfigManager;
