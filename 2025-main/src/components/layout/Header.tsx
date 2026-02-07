import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Package, Bell, LogOut, RefreshCw, Sun, Moon, Search, Menu, Layout } from 'lucide-react';

interface User {
  id: string | number; // Allow both string and number for compatibility
  email: string;
  avatar?: string;
  department?: string;
  joinDate?: string;
  loginTime?: string;
  // Additional optional properties
  [key: string]: any; // Allow additional properties
  // For example, you might have:
  // phone?: string;
  // address?: string;
  // You can also define a more structured role if needed
  // role?: {
  //   id: string;
  //   label: string;
  //   permissions: string[];
  // };
  // For simplicity, we can just keep a name and role

  name: string;
  role?: string;
}


interface UIState {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  activeTab: string;
}

interface HeaderProps {
  user?: User | null;
  uiState?: UIState;
  onUIStateChange?: (_newState: Partial<UIState>) => void;
  _themeClasses?: any;
  onSidebarToggle?: () => void;
  onRefresh?: () => void;
  onLayoutConfigOpen?: () => void;
  systemStatus?: {
    dbStatus: string;
    cpuUsage: string;
    onlineUsers: number;
  };
}

const Header: React.FC<HeaderProps> = ({
  user,
  uiState,
  onUIStateChange,
  onSidebarToggle,
  onRefresh,
  onLayoutConfigOpen,
  systemStatus = { dbStatus: 'connected', cpuUsage: '70%', onlineUsers: 15 }
}) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const authContext = React.useContext(AuthContext);
  const contextUser = authContext?.user;
  const logout = authContext?.logout || (() => {});
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Use passed user or context user
  const currentUser = user || contextUser;

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleMobileMenuToggle = () => {
    if (onUIStateChange) {
      onUIStateChange({
        isMobileMenuOpen: !uiState?.isMobileMenuOpen
      });
    } else if (onSidebarToggle) {
      onSidebarToggle();
    }
  };

const lastUpdated = new Date();

return (
   <header className={`fixed top-0 left-0 right-0 z-50 ${
      darkMode ? 'bg-gray-800/95' : 'bg-white/95'
   } border-b ${
      darkMode ? 'border-gray-700' : 'border-gray-200'
   } backdrop-blur-sm shadow-lg`}>
      <div className="flex items-center justify-between px-6 h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle */}
          <button
            onClick={handleMobileMenuToggle}
            className={`lg:hidden p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-all duration-200 hover:scale-105`}
            title="Toggle sidebar menu"
          >
            <Menu size={20} className={darkMode ? 'text-gray-200' : 'text-gray-700'} />
          </button>

          {/* Logo and brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl leading-none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MIA.vn
              </h1>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full group">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            } group-focus-within:text-blue-500 transition-colors`} size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, nhân viên, sản phẩm..."
              className={`w-full pl-12 pr-6 py-3 rounded-xl ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium`}
            />
          </div>
        </div>

        {/* Right Section - Enhanced Buttons */}
        <div className="flex items-center space-x-2">
          {/* System Status Indicators */}
          <div className={`hidden md:flex items-center space-x-3 mr-2 py-1 px-3 rounded-lg ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-1 ${
                systemStatus.dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs font-medium">DB</span>
            </div>
            <div className="text-xs font-medium">CPU: {systemStatus.cpuUsage}</div>
            <div className="text-xs font-medium">{systemStatus.onlineUsers} online</div>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-3 rounded-xl ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            } transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transform hover:scale-105 group`}
            title={`Cập nhật lần cuối: ${lastUpdated.toLocaleTimeString('vi-VN')}`}
          >
            <RefreshCw size={18} className={`${
              isRefreshing ? 'animate-spin' : ''
            } group-hover:text-blue-500 transition-colors`} />
          </button>

          {/* Layout configuration button */}
          <button
            onClick={onLayoutConfigOpen}
            className={`p-3 rounded-xl ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            } transition-all duration-200 hover:shadow-md transform hover:scale-105 group`}
            title="Quản lý hiển thị và bố cục"
          >
            <Layout size={18} className="group-hover:text-purple-500 transition-colors" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-xl ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            } transition-all duration-200 hover:shadow-md transform hover:scale-105 group`}
            title="Chuyển đổi chế độ"
          >
            {darkMode ?
              <Sun size={18} className="group-hover:text-yellow-500 transition-colors" /> :
              <Moon size={18} className="group-hover:text-indigo-500 transition-colors" />
            }
          </button>
          {/* Notifications */}
          <button
            className={`p-3 rounded-xl ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            } relative transition-all duration-200 hover:shadow-md transform hover:scale-105 group`}
            title="View notifications"
          >
            <Bell size={18} className="group-hover:text-red-500 transition-colors" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
              3
            </span>
          </button>
          {/* User profile - Enhanced */}
          {currentUser && (
            <div className={`flex items-center space-x-3 ${
              darkMode
                ? 'bg-gray-700/80'
                : 'bg-gradient-to-r from-blue-50 to-purple-50'
            } rounded-xl p-2 ml-2`}>
              <div className="hidden sm:block text-right">
                <p className={`text-sm font-semibold leading-none ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{currentUser.name}</p>
                <p className={`text-xs leading-none mt-1 font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{currentUser.role || 'User'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <button
                onClick={logout}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                    : 'hover:bg-red-50 text-red-500 hover:text-red-400'
                } transition-all duration-200 transform hover:scale-105`}
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile search - Enhanced */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative group">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          } group-focus-within:text-blue-500 transition-colors`} size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={`w-full pl-11 pr-4 py-3 rounded-xl ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200`}
          />
        </div>
      </div>
   </header>
   );
}
export default Header;

