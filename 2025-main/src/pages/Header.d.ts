// TypeScript declarations for Header component

import React from 'react';

export interface User {
  id: string | number; // Allow both string and number for compatibility
  name: string;
  email: string;
  role: {
    id: string;
    label: string;
    permissions: string[];
  };
  // Additional optional properties from auth context
  avatar?: string;
  department?: string;
  joinDate?: string;
  loginTime?: string;
}

export interface UIState {
  isDarkMode: boolean;
  isSidebarOpen?: boolean;
  isSidebarCollapsed?: boolean;
  isMobileMenuOpen?: boolean;
  isLayoutConfigOpen?: boolean;
  activeTab?: string;
  isRefreshing?: boolean;
  layoutConfig?: object;
}

export interface ThemeClasses {
  bg: string;
  text: string;
  border: string;
  card: string;
  button: string;
  input: string;
  surface: string;
  surfaceHover: string;
}

export interface HeaderProps {
  user: User | null;
  uiState: UIState;
  onUIStateChange: (changes: Partial<UIState>) => void;
  onRefresh: () => void;
  onLogout: () => void;Mình
  onMobileMenuToggle?: () => void;
  onLayoutConfigOpen: () => void;
  lastUpdated: Date;
  themeClasses: ThemeClasses;
}

declare const Header: React.ComponentType<HeaderProps>;
export default Header;
