import React, { useState, useEffect } from 'react';
import Header from './pages/Header';
import Sidebar from './pages/Sidebar';
import MainContent from './pages/MainContent';
import DebugPermissions from './debug-permissions'; // Corrigido
import { ThemeProvider } from './context/ThemeContext';
import { LayoutProvider } from './context/LayoutContext';


// Importando estilos globais
import './App.css';
// Importando contextos

// Định nghĩa mô phỏng dữ liệu
const mockData = {
    staff: [
        { id: 1, name: 'Nguyễn Văn A', role: 'Senior', area: 'A', status: 'active', efficiency: 95, ordersCompleted: 120, handlingP1: true },
        { id: 2, name: 'Trần Thị B', role: 'Regular', area: 'B', status: 'active', efficiency: 85, ordersCompleted: 95, handlingP1: false },
        { id: 3, name: 'Lê Văn C', role: 'Junior', area: 'C', status: 'inactive', efficiency: 70, ordersCompleted: 45, handlingP1: false },
        // Thêm dữ liệu mẫu khác ở đây
    ],

     // Dữ liệu mẫu về đơn hàng
    orders: [
        { id: 1, number: 'ORD001', priority: 'P1', status: 'pending', assignedTo: 'Nguyễn Văn A', area: 'A', createdAt: '2023-10-01', sla: 2, handlingP1: true },
        { id: 2, number: 'ORD002', priority: 'P2', status: 'processing', assignedTo: 'Trần Thị B', area: 'B', createdAt: '2023-10-02', sla: 4, handlingP1: false },
        { id: 3, number: 'ORD003', priority: 'P3', status: 'completed', assignedTo: 'Lê Văn C', area: 'C', createdAt: '2023-10-03', sla: 8, handlingP1: false },
        { id: 4, number: 'ORD004', priority: 'P4', status: 'delayed', assignedTo: 'Nguyễn Văn A', area: 'A', createdAt: '2023-10-04', sla: 24, handlingP1: true },
        { id: 5, number: 'ORD005', priority: 'P1', status: 'pending', assignedTo: 'Trần Thị B', area: 'B', createdAt: '2023-10-05', sla: 2, handlingP1: true },
        {
            id: 6, number: 'ORD006', priority: 'P2', status: 'processing', assignedTo: 'Lê Văn C', area: 'C',
                createdAt: '2023-10-06', sla: 4, handlingP1: false
        },

    ]
};

const mockMetrics = {
    orders: {
        total: 125,
        pending: 35,
        processing: 45,
        completed: 40,
        delayed: 5
    },
    staff: {
        total: 10,
        active: 8,
        utilization: 85,
        efficiency: 80
    }
};

function App() {
    // State quản lý UI
    const [uiState, setUIState] = useState({
        isSidebarCollapsed: false,
        activeTab: 'dashboard',
        isMobileMenuOpen: false,
        isDarkMode: false
    });

    // State quản lý user
    const [user, setUser] = useState({
        name: 'Admin',
        role: 'Administrator',
        avatar: '/avatar.png',
        permissions: ['dashboard', 'orders', 'staff', 'analytics', 'schedule', 'settings', 'permissions']
    });

    // State quản lý filters
    const [filters, setFilters] = useState({
        date: 'today',
        status: 'all',
        priority: 'all'
    });

    // Hàm kiểm tra quyền
    const hasPermission = (permission) => {
        return user.permissions.includes(permission);
    };

    // Hàm cập nhật UI State
    const handleUIStateChange = (newState) => {
        // Cập nhật trạng thái UI
        console.log('Updating UI state:', newState);
        // Kiểm tra nếu là dark mode
        if (newState.isDarkMode !== undefined) {
            setUIState(prev => ({ ...prev, ...newState }));
        }
        // Cập nhật class dark mode trên document
        if (newState.isDarkMode !== undefined) {
            if (newState.isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
        // Cập nhật các trạng thái khác
        setUIState(prev => ({ ...prev, ...newState }));
        console.log('UI state updated:', uiState);
        // Cập nhật class dark mode trên document
        if (newState.isDarkMode !== undefined) {
            if (newState.isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    // Hàm cập nhật filters
    const handleFiltersChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Theme classes dựa trên dark mode
    const themeClasses = {
        background: uiState.isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
        surface: uiState.isDarkMode ? 'bg-gray-800' : 'bg-white',
        surfaceHover: uiState.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
        border: uiState.isDarkMode ? 'border-gray-700' : 'border-gray-200',
        text: {
            primary: uiState.isDarkMode ? 'text-white' : 'text-gray-900',
            secondary: uiState.isDarkMode ? 'text-gray-300' : 'text-gray-600',
            muted: uiState.isDarkMode ? 'text-gray-400' : 'text-gray-500'
        },
        input: uiState.isDarkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    };    // Toggle dark mode
    const toggleDarkMode = () => {
        handleUIStateChange({ isDarkMode: !uiState.isDarkMode });
        // Toggle class on document
        if (!uiState.isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Refresh data function
    const handleRefresh = () => {
        console.log('Refreshing data...');
        // Add your data refresh logic here
    };

    // Logout function
    const handleLogout = () => {
        console.log('Logging out...');
        // Add your logout logic here
    };

    // Layout config open function
    const handleLayoutConfigOpen = () => {
        console.log('Opening layout config...');
        // Add your layout config logic here
    };

    // Effect to initialize dark mode from system preferences
    useEffect(() => {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        handleUIStateChange({ isDarkMode });
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    return (
        <ThemeProvider>
            <LayoutProvider>
                <div className={`flex h-screen ${themeClasses.background}`}>
                    <DebugPermissions user={user} hasPermission={hasPermission} />
                    {/* Test Navigation Display */}
                    <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: 'yellow', padding: '10px', zIndex: 9999, fontSize: '12px', maxWidth: '250px' }}>
                        <h4>🧪 NAVIGATION TEST</h4>
                        <div>Available menu items:</div>
                        {[
                            { id: 'dashboard', label: 'Tổng quan', permission: 'dashboard' },
                            { id: 'orders', label: 'Quản lý đơn hàng', permission: 'orders' },
                            { id: 'staff', label: 'Quản lý nhân sự', permission: 'staff' },
                            { id: 'analytics', label: 'Phân tích & Báo cáo', permission: 'analytics' },
                            { id: 'main-schedule', label: 'Lịch làm việc', permission: 'schedule' },
                            { id: 'settings', label: 'Cài đặt hệ thống', permission: 'settings' },
                            { id: 'permissions', label: 'Phân quyền', permission: 'permissions' }
                        ].map(item => (
                            <div key={item.id} style={{
                                padding: '2px',
                                background: hasPermission(item.permission) ? '#90EE90' : '#FFB6C1',
                                margin: '2px 0',
                                fontSize: '10px'
                            }}>
                                {item.label}: {hasPermission(item.permission) ? '✅' : '❌'}
                            </div>
                        ))}
                    </div>
                    {/* Sidebar */}
                    <Sidebar
                        user={user}
                        uiState={uiState}
                        onUIStateChange={handleUIStateChange}
                        hasPermission={hasPermission}
                        themeClasses={themeClasses}
                        metrics={mockMetrics}
                    />

                    <div className="flex flex-col flex-1 min-w-0">
                        {/* Header */}                        <Header
                            user={user}
                            uiState={uiState}
                            onUIStateChange={handleUIStateChange}
                            onRefresh={handleRefresh}
                            onLogout={handleLogout}
                            onLayoutConfigOpen={handleLayoutConfigOpen}
                            lastUpdated={new Date()}
                            themeClasses={themeClasses}
                        />

                        {/* Main Content */}
                        <MainContent
                            user={user}
                            uiState={uiState}
                            data={mockData}
                            metrics={mockMetrics}
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            hasPermission={hasPermission}
                            themeClasses={themeClasses}
                        />
                    </div>
                </div>
            </LayoutProvider>
        </ThemeProvider>
    );
}

export default App;
