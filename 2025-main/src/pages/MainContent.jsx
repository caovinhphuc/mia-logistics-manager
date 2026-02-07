//MainContent.jsx
import React from 'react';
import PropTypes from 'prop-types';
import OverviewTab from '../module/OverviewTab';
import StaffModuleTab from '../module/StaffTab';
import OrderModuleTab from '../module/OrderTab';
import ScheduleModuleTab from '../module/ScheduleTab';
import PerformanceTab from '../module/PerformanceTab';
import SettingsTabModule from '../module/SettingsTab';
import PickingTab from '../module/PickingTab';
import HistoryTab from '../module/HistoryTab';
import AlertsTab from '../module/AlertsTab';
import AnalyticsTab from '../placeholder/AnalyticsTab';
import ReportsTab from '../placeholder/ReportsTab';
import PermissionsTab from '../placeholder/PermissionsTab';
import SettingsTab from '../placeholder/Settings/SettingsTab';
import ScheduleTab from '../placeholder/ScheduleTab';

// ==================== MAIN CONTENT COMPONENT ====================
const MainContent = ({
  user,
  uiState,
  data,
  metrics,
  _filters, // Unused, added underscore
  _onFiltersChange, // Unused, added underscore
  _hasPermission, // Unused, added underscore
  themeClasses
}) => {
  const contentClasses = `
    flex-1 h-full w-full overflow-auto transition-all duration-300
    ${themeClasses.background} ${themeClasses.text.primary}
    pt-16
  `;

  const renderTabContent = () => {
    const { activeTab, isDarkMode } = uiState;

    const tabComponents = {
      dashboard: <OverviewTab themeClasses={themeClasses} darkMode={isDarkMode} />,
      orders: <OrderModuleTab data={data} themeClasses={themeClasses} darkMode={isDarkMode} />,
      'orders-overview': <OrderModuleTab data={data} themeClasses={themeClasses} darkMode={isDarkMode} />,
      staff: <StaffModuleTab data={data} themeClasses={themeClasses} activeView="overview" darkMode={isDarkMode} />,
      'staff-overview': <StaffModuleTab data={data} themeClasses={themeClasses} activeView="overview" darkMode={isDarkMode} />,
      'staff-performance': <PerformanceTab themeClasses={themeClasses} darkMode={isDarkMode} />,
      'staff-schedule': <ScheduleModuleTab themeClasses={themeClasses} darkMode={isDarkMode} />,
      'staff-assignments': <StaffModuleTab data={data} themeClasses={themeClasses} activeView="assignments" />,
      'staff-settings': <SettingsTabModule themeClasses={themeClasses} darkMode={isDarkMode} />,
      picking: <PickingTab themeClasses={themeClasses} darkMode={isDarkMode} data={data} metrics={metrics} />,
      'picking-overview': <PickingTab themeClasses={themeClasses} darkMode={isDarkMode} data={data} metrics={metrics} />,
      history: <HistoryTab themeClasses={themeClasses} darkMode={isDarkMode} />,
      'history-overview': <HistoryTab themeClasses={themeClasses} darkMode={isDarkMode} />,
      alerts: <AlertsTab themeClasses={themeClasses} darkMode={isDarkMode} />,
      'alerts-overview': <AlertsTab themeClasses={themeClasses} darkMode={isDarkMode} />,
      analytics: <AnalyticsTab metrics={metrics} data={data} themeClasses={themeClasses} />,
      reports: <ReportsTab metrics={metrics} data={data} themeClasses={themeClasses} />,
      schedule: <ScheduleTab data={data} themeClasses={themeClasses} />,
      settings: <SettingsTab themeClasses={themeClasses} user={user} />,
      permissions: <PermissionsTab themeClasses={themeClasses} user={user} />
    };

    return tabComponents[activeTab] || <OverviewTab themeClasses={themeClasses} darkMode={isDarkMode} />;
  };

  return (
    <main className={contentClasses}>
      <div className="w-full h-full p-4 md:p-6 lg:p-8">
        <div className="w-full min-w-0">{renderTabContent()}</div>
      </div>
    </main>
  );
};

// ==================== PROPS TYPES ====================
MainContent.propTypes = {
  user: PropTypes.object,
  uiState: PropTypes.shape({
    isSidebarCollapsed: PropTypes.bool.isRequired,
    activeTab: PropTypes.string.isRequired,
    isMobileMenuOpen: PropTypes.bool
  }).isRequired,
  data: PropTypes.object,
  metrics: PropTypes.object,
  filters: PropTypes.object,
  onFiltersChange: PropTypes.func,
  hasPermission: PropTypes.bool,
  themeClasses: PropTypes.object
};

// ==================== PROPS DEFAULT VALUES ====================
MainContent.defaultProps = {
  user: {},
  uiState: {
    isSidebarCollapsed: false,
    activeTab: 'dashboard',
    isMobileMenuOpen: false
  },
  data: {},
  metrics: {},
  filters: {},
  onFiltersChange: () => {},
  hasPermission: false,
  themeClasses: {
    background: 'bg-gray-50 dark:bg-gray-900',
    surface: 'bg-white dark:bg-gray-800',
    surfaceHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    border: 'border-gray-200 dark:border-gray-700',
    text: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-300',
      muted: 'text-gray-500 dark:text-gray-400'
    },
    input: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
  }
};

// ==================== EXPORT COMPONENT ====================
export default MainContent;
