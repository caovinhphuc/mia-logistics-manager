//Home.jsx
import { useState, useEffect } from 'react';
import { Package } from 'lucide-react'; // Giả sử bạn đang sử dụng Lucide Icons
import { useLayoutConfig } from '../hooks/useLayoutConfig';

// ==================== HOME PAGE COMPONENT ====================
// Đây là trang chính của ứng dụng, nơi hiển thị nội dung chính và các thông tin tổng quan
// Bạn có thể thêm các thành phần khác như biểu đồ, bảng thống kê, v.v. vào đây

const Home = () => {
   const [data, setData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);
   const [uiState, setUiState] = useState({
      isDarkMode: false,
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      activeTab: 'dashboard',
      isRefreshing: false
   });
   const [lastUpdated, setLastUpdated] = useState(new Date());
   const [filters, setFilters] = useState({
      priority: 'all',
      status: 'all',
      dateRange: 'today',
      searchTerm: ''
   });
   const [themeClasses, setThemeClasses] = useState({
      surface: 'bg-white',
      surfaceHover: 'hover:bg-gray-100',
      border: 'border-gray-200',
      input: 'bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
   });
   const handleButtonClick = () => {
      // Xử lý sự kiện
   };
   // Giả lập dữ liệu hoặc gọi API để lấy dữ liệu
   useEffect(() => {
      // Giả lập dữ liệu
      const fetchData = async () => {
         const mockData = await new Promise(resolve => {
         setTimeout(() => resolve({ message: 'Dữ liệu đã được tải' }), 1000);
         });
         setData(mockData);
      };
      fetchData();
   }
   , []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">MIA Warehouse</h1>
      </header>
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Warehouse Management System</h2>
        <p>This is a placeholder for the main content of the application.</p>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2023 MIA Warehouse
      </footer>
    </div>
  );
};



export default Home;
