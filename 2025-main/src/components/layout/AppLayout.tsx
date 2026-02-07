import React, { ReactNode, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../context/PermissionContext';
import { useAuth } from '../../context/AuthContext';
import { LAYOUT } from '../../constants';
import Header from '../../pages/Header';
import Sidebar from '../../pages/Sidebar';
import ErrorBoundary from '../ErrorBoundary';
import MainContent from '../../pages/MainContent';

// Type definitions for Header component
interface User {
  id: string | number; // Allow both string and number for compatibility
  name: string;
  email: string;
  role: {
    id: string;
    label: string;
    permissions: string[];
  };
  // Additional optional properties that might exist in the auth context
  avatar?: string;
  department?: string;
  joinDate?: string;
  loginTime?: string;
}

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  isLayoutConfigOpen: boolean;
  activeTab: string;
  isRefreshing?: boolean;
  layoutConfig?: object;
}

interface ThemeClasses {
  bg: string;
  text: string;
  border: string;
  card: string;
  button: string;
  input: string;
  // Make these optional since the ThemeContext doesn't provide them
  surface?: string;
  surfaceHover?: string;
}

// Header component props interface
interface HeaderProps {
  user: User | null;
  uiState: UIState;
  onUIStateChange: (changes: Partial<UIState>) => void;
  onRefresh: () => void;
  onLogout: () => void;
  onMobileMenuToggle?: () => void;
  onLayoutConfigOpen: () => void;
  lastUpdated: Date;
  themeClasses: ThemeClasses;
}

// Cast Header component to proper type
const TypedHeader = Header as React.ComponentType<HeaderProps>;
interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  title = 'Dashboard',

  children,
  showSidebar = true,
}) => {

  const { themeClasses } = useTheme();
  // Use permissions context to check access and permissions
  const { canAccess, hasPermission } = usePermissions();
  // Use auth context to get user information
  const { user: authUser } = useAuth();

  // Transform user to match expected Header props
  const user: User | null = authUser ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    role: {
      id: authUser.role,
      label: authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1),
      permissions: authUser.permissions || []
    }
  } : null;
  // Local state for UI interactions

  const [uiState, setUIState] = useState({
    isDarkMode: false,
    isSidebarOpen: true,
    isSidebarCollapsed: false,
    isMobileMenuOpen: false,
    isLayoutConfigOpen: false,

    activeTab: 'dashboard'
  });

  // Mock metrics data - in production this would come from your API
  const metrics = {
    orders: { pending: 12 },
    performance: { slaRate: 95.7, throughput: 156 },
    staff: { active: 8, total: 12 }
  };
  const handleUIStateChange = (newState: Partial<typeof uiState>) => {
    setUIState(prev => ({ ...prev, ...newState }));
  };

  const handleRefresh = () => {
    // Implement refresh logic - this could trigger data refetch
    console.log('Refreshing data...');
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
  };

  const handleMobileMenuToggle = () => {
    setUIState(prev => ({ ...prev, isMobileMenuOpen: !prev.isMobileMenuOpen }));
  };

  const handleLayoutConfigOpen = () => {
    setUIState(prev => ({ ...prev, isLayoutConfigOpen: !prev.isLayoutConfigOpen }));
  };

  useEffect(() => {
    // Set CSS variables for layout
    document.documentElement.style.setProperty('--header-height', LAYOUT.header.height);
    document.documentElement.style.setProperty('--content-padding', LAYOUT.content.padding);
  }, []);

  const shouldShowSidebar = showSidebar && typeof canAccess === 'function' && canAccess(['dashboard']);


  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>      {/* Header */}
      <ErrorBoundary componentName="Header">        <TypedHeader
          user={user || null}
          uiState={uiState}
          onUIStateChange={handleUIStateChange}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          onMobileMenuToggle={handleMobileMenuToggle}
          lastUpdated={new Date()}
          themeClasses={{

            ...themeClasses,
            // Provide fallback values for missing properties
            surface: themeClasses.card || (themeClasses.bg.includes('gray-900') ? 'bg-gray-800' : 'bg-white'),
            surfaceHover: themeClasses.bg.includes('gray-900') ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
          }}
          onLayoutConfigOpen={handleLayoutConfigOpen}
        />
      </ErrorBoundary>

      <div className="flex">
        {/* Sidebar */}
        {shouldShowSidebar && (
          <ErrorBoundary componentName="Sidebar">
            <Sidebar
              user={user}
              uiState={uiState}
              onUIStateChange={handleUIStateChange}
              hasPermission={hasPermission}
              themeClasses={themeClasses}
              metrics={metrics}
            />
          </ErrorBoundary>
        )}
        {/* Main Content */}
        <ErrorBoundary componentName="MainContent">
          <MainContent
            user={user}
            uiState={uiState}
            data={{}}
            metrics={metrics}
            _filters={{}}
            _onFiltersChange={() => {}}
            _hasPermission={hasPermission}
            themeClasses={themeClasses}
          />
        </ErrorBoundary>
        <div className="max-w-full">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;

