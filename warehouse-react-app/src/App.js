//App.js
// Ứng dụng quản lý SLA (Service Level Agreement) với các chức năng như quản lý đơn hàng, phân bổ đơn hàng, theo dõi hiệu suất, cài đặt và giao diện nhân viên.
// Import các thư viện cần thiết
import {
  Activity,
  Bell,
  Clipboard,
  FileText,
  Home,
  LogOut,
  Package,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import React, { createContext, useEffect, useState } from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'

// Import các thư viện CSS
import Login from './components/Login'
// Import các components
import AlertSystemModule from './components/AlertSystemModule'
import DashboardSettings from './components/DashboardSettings'
import IntegratedDashboard from './components/IntegratedDashboard'
import MainDashboard from './components/MainDashboard'
import OrderAllocation from './components/OrderAllocation'
import OrderManagement from './components/OrderManagement'
import PerformanceTracking from './components/PerformanceTracking'
import PriorityOrderProducts from './components/PriorityOrderProducts'
import StaffInterface from './components/StaffInterface'
import { useAuth } from './context/AuthContext'

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-gray-600 mb-6">Trang bạn đang tìm kiếm không tồn tại</p>
    <a
      href="/"
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      rel="noreferrer noopener" // Added rel attribute for security
    >
      Quay lại trang chủ
    </a>
  </div>
)

// Route bảo vệ
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />
}

// Tạo context cho toàn bộ ứng dụng
export const AppContext = createContext()

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [systemData, setSystemData] = useState({
    orders: [],
    staff: [],
    performance: {},
    settings: {},
  })

  // Kiểm tra đăng nhập
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    setTimeout(checkAuth, 1000)
  }, [])

  // Xử lý đăng nhập
  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: 1,
        username: 'admin',
        name: 'Admin',
        role: 'admin',
        avatar: 'A',
      }
      setCurrentUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    } else if (username === 'staff' && password === 'staff123') {
      const user = {
        id: 2,
        username: 'staff',
        name: 'Nhân viên',
        role: 'staff',
        avatar: 'S',
      }
      setCurrentUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    }
    return false
  }

  // Xử lý đăng xuất
  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Show loading spinner outside Router context
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Đang tải ứng dụng...</div>
      </div>
    )
  }

  const contextValue = {
    currentUser,
    notifications,
    systemData,
    darkMode,
    toggleDarkMode,
    setNotifications,
    setSystemData,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        {!isAuthenticated ? (
          // Render Login inside Router context
          <Login onLogin={handleLogin} />
        ) : (
          // The authenticated UI
          <div
            className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}
          >
            <div className="flex">
              {/* Sidebar */}
              <div
                className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-width duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow h-screen fixed`}
              >
                <div className="p-4 flex justify-between items-center">
                  <div
                    className={`${sidebarOpen ? 'block' : 'hidden'} font-bold text-xl ${darkMode ? 'text-white' : 'text-blue-600'}`}
                  >
                    WMS SLA
                  </div>
                  <button
                    className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    onClick={toggleSidebar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Menu chính */}
                <nav className="mt-6">
                  <div className="px-4 py-2 text-xs uppercase font-semibold text-gray-500">
                    {sidebarOpen && 'Menu chính'}
                  </div>
                  <Link
                    to="/"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Home size={20} />
                    {sidebarOpen && <span className="ml-3">Dashboard</span>}
                  </Link>
                  <Link
                    to="/orders"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <FileText size={20} />
                    {sidebarOpen && <span className="ml-3">Quản lý đơn hàng</span>}
                  </Link>
                  <Link
                    to="/allocation"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Users size={20} />
                    {sidebarOpen && <span className="ml-3">Phân bổ đơn hàng</span>}
                  </Link>
                  <Link
                    to="/products"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Package size={20} />
                    {sidebarOpen && <span className="ml-3">Sản phẩm ưu tiên</span>}
                  </Link>
                  <Link
                    to="/integrated-dashboard"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Clipboard size={20} />
                    {sidebarOpen && <span className="ml-3">Bảng điều khiển tích hợp</span>}
                  </Link>
                  <Link
                    to="/users"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Users size={20} />
                    {sidebarOpen && <span className="ml-3">Người dùng</span>}
                  </Link>
                  <Link
                    to="/alert"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Bell size={20} />
                    {sidebarOpen && <span className="ml-3">Hệ thống cảnh báo</span>}
                  </Link>
                  <Link
                    to="/picking"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Clipboard size={20} />
                    {sidebarOpen && <span className="ml-3">Lấy hàng</span>}
                  </Link>
                  <Link
                    to="/performance"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Activity size={20} />
                    {sidebarOpen && <span className="ml-3">Hiệu suất</span>}
                  </Link>

                  {/* Chỉ hiển thị view nhân viên nếu là admin */}
                  {currentUser.role === 'admin' && (
                    <Link
                      to="/staff-view"
                      className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <Clipboard size={20} />
                      {sidebarOpen && <span className="ml-3">View nhân viên</span>}
                    </Link>
                  )}

                  <div className="px-4 py-2 text-xs uppercase font-semibold text-gray-500 mt-6">
                    {sidebarOpen && 'Hệ thống'}
                  </div>
                  <Link
                    to="/settings"
                    className={`flex items-center py-3 px-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Settings size={20} />
                    {sidebarOpen && <span className="ml-3">Cài đặt</span>}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center py-3 px-4 w-full text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <LogOut size={20} />
                    {sidebarOpen && <span className="ml-3">Đăng xuất</span>}
                  </button>
                </nav>
              </div>

              {/* Main content */}
              <div
                className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-margin duration-300 flex-1`}
              >
                {/* Header */}
                <header
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow py-4 px-6 flex justify-between items-center`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className={`pl-10 pr-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 border-gray-200'} border`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="relative">
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        3
                      </span>
                    </button>
                    <button
                      className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                      onClick={toggleDarkMode}
                    >
                      {darkMode ? '☀️' : '🌙'}
                    </button>
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white font-bold mr-2`}
                      >
                        {currentUser.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{currentUser.name}</div>
                        <div className="text-xs text-gray-500">
                          {currentUser.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Content */}
                <main className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen pt-4`}>
                  <Routes>
                    {/* Login route */}
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />

                    {/* Main routes */}
                    <Route path="/" element={<MainDashboard />} />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrderManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/allocation" element={<OrderAllocation />} />
                    <Route path="/products" element={<PriorityOrderProducts />} />
                    <Route path="/performance" element={<PerformanceTracking />} />
                    <Route path="/picking" element={<OrderManagement />} />
                    <Route path="/integrated-dashboard" element={<IntegratedDashboard />} />
                    <Route path="/users" element={<OrderManagement />} />
                    <Route path="/alert" element={<AlertSystemModule />} />
                    <Route path="/settings" element={<DashboardSettings />} />
                    <Route path="/settings/platform-sla" element={<DashboardSettings />} />
                    <Route path="/priority-order-sla" element={<PriorityOrderProducts />} />
                    <Route path="/sla-order" element={<OrderManagement />} />
                    <Route path="/profile" element={<OrderManagement />} />

                    {/* Admin-only route with conditional rendering */}
                    <Route
                      path="/staff-view"
                      element={
                        currentUser && currentUser.role === 'admin' ? (
                          <StaffInterface />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />

                    {/* Default route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </div>
            </div>
          </div>
        )}
      </Router>
    </AppContext.Provider>
  )
}

export default App
