// LoginScreen.jsx
import React from 'react';
import { Package } from 'lucide-react';
// ==================== LOADING COMPONENT ====================
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
        <Package className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-gray-400 mt-4 font-medium">Đang khởi tạo hệ thống...</p>
      <p className="text-gray-500 text-sm mt-2">MIA Warehouse Management</p>
    </div>
  </div>
);

export default LoadingScreen;
