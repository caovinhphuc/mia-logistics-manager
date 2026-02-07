// PickingTab.jsx
import React, { useState, useEffect , useContext } from 'react';
import { Grid, List } from 'lucide-react';
import AnalyticsTab from '../placeholder/AnalyticsTab.jsx';

import SettingsTab from '../placeholder/SettingsTab.jsx';
import StaffPerformanceWidget from '../widget/StaffAnalyticsWidget.jsx';
import { useLayout } from '../context/LayoutContext.jsx';

import { useTheme } from '../hooks/useTheme.jsx'; // Giả sử bạn có một hook để lấy theme
import { AuthContext } from '../context/AuthContext';


import PropTypes from 'prop-types';




// Define placeholder styles
const buttonPrimaryClass = "bg-blue-500 text-white hover:bg-blue-600";
const buttonSecondaryClass = "bg-gray-500 text-white hover:bg-gray-600";
const cardClass = "bg-white shadow-md rounded-lg p-4";

// ==================== PICKING TAB COMPONENT ====================

const PickingTab = ({ themeClasses, darkMode, data, metrics }) => {
  const [orders, setOrders] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [highlightedLocations, setHighlightedLocations] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: "System",
    role: "admin",
  });
  const [warehouseViewMode, setWarehouseViewMode] = useState('default');
  const [showPicking, setShowPicking] = useState(true);
  // Lấy thông tin người dùng từ localStorage hoặc sử dụng mặc định
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, []);
  const [showLocations, setShowLocations] = useState(true);
  const toggleLocations = () => {
    setShowLocations((prev) => !prev);
    // Thêm hoạt động vào lịch sử
    const newLog = {
      id: activityHistory.length + 1,
      type: "picking",
      action: showLocations ? "Ẩn vị trí kho" : "Hiển thị vị trí kho",
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory((prev) => [newLog, ...prev]);
  };

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("picking");

  // Hàm chuyển đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Thêm hoạt động vào lịch sử
    const newLog = {
      id: activityHistory.length + 1,
      type: "picking",
      action: `Chuyển sang tab ${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };

    setActivityHistory((prev) => [newLog, ...prev]);
  };

  // Function tạo đơn hàng mẫu nếu chưa có
  const generateSampleOrders = () => {
    const locations = [
      { id: "A1", type: "Vali S" },
      { id: "A2", type: "Vali M" },
      { id: "A5", type: "Vali M" },
      { id: "A12", type: "Vali L" },
      { id: "B2", type: "Phụ kiện" },
      { id: "B8", type: "Phụ kiện" },
      { id: "B10", type: "Phụ kiện" },
      { id: "B15", type: "Phụ kiện" },
      { id: "C4", type: "Đặc biệt" },
      { id: "C10", type: "Đặc biệt" },
    ];

    const products = [
      {
        sku: "LAR-BLK-28L",
        name: "Vali Larita 28L",
        location: "A12",
        zone: "A",
      },
      {
        sku: "LAR-BLK-24M",
        name: "Vali Larita 24M",
        location: "A5",
        zone: "A",
      },
      {
        sku: "LAR-BLK-20S",
        name: "Vali Larita 20S",
        location: "A1",
        zone: "A",
      },
      {
        sku: "PIS-BLU-24M",
        name: "Vali Pisani 24M",
        location: "A2",
        zone: "A",
      },
      {
        sku: "TAG-BLK-01",
        name: "Luggage Tag Black",
        location: "B2",
        zone: "B",
      },
      {
        sku: "COV-BLK-M",
        name: "Cover Medium Black",
        location: "B8",
        zone: "B",
      },
      {
        sku: "TRK-BLK-01",
        name: "Travel Kit Black",
        location: "B10",
        zone: "B",
      },
      {
        sku: "PCK-BLK-S",
        name: "Pack-it Cube Small",
        location: "B15",
        zone: "B",
      },
      {
        sku: "HER-BLK-01",
        name: "Herschel Backpack Black",
        location: "C4",
        zone: "C",
      },
      {
        sku: "LTH-BRW-01",
        name: "Leather Travel Bag Brown",
        location: "C10",
        zone: "C",
      },
    ];

    // Tạo 15 đơn hàng mẫu
    const sampleOrders = [];
    for (let i = 1; i <= 15; i++) {
      // Số lượng sản phẩm trong đơn (1-3)
      const itemCount = Math.floor(Math.random() * 3) + 1;

      // Chọn ngẫu nhiên các sản phẩm
      const orderItems = [];
      const usedSkus = new Set();

      for (let j = 0; j < itemCount; j++) {
        let product = products[Math.floor(Math.random() * products.length)];

        // Tránh trùng lặp sản phẩm
        while (usedSkus.has(product.sku)) {
          product = products[Math.floor(Math.random() * products.length)];
        }

        usedSkus.add(product.sku);

        orderItems.push({
          ...product,
          quantity: Math.floor(Math.random() * 2) + 1,
        });
      }

      // Xác định priority
      let priority = "P3";
      if (i <= 3) priority = "P1";
      else if (i <= 7) priority = "P2";

      // Tạo đơn hàng
      sampleOrders.push({
        id: `SO0405:${123460 + i}`,
        priority,
        status: "pending",
        items: orderItems,
        createdAt: new Date().toISOString(),
        channel: Math.random() > 0.5 ? "Shopee" : "TikTok",
        deadline: new Date(
          new Date().getTime() + (24 + Math.random() * 24) * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    return sampleOrders;
  };

  // Thêm useEffect để khởi tạo dữ liệu cho ví dụ
  useEffect(() => {
    // Chỉ chạy khi tab Picking được chọn
    if (activeTab === "picking") {
      // Thêm các đơn hàng mẫu nếu chưa có
      if (orders.length === 0) {
        const sampleOrders = generateSampleOrders();
        setOrders(sampleOrders);
      }

      // Tạo gợi ý tối ưu
      const optimizations = generatePickingOptimizations();

      // Thêm vào lịch sử hoạt động
      const newLog = {
        id: activityHistory.length + 1,
        type: "picking",
        action: "Xem tab Picking",
        user: currentUser?.name || "System",
        time: new Date().toLocaleTimeString("vi-VN"),
      };
      setActivityHistory((prev) => [newLog, ...prev]);
    }
  }, [activeTab]);
  // Hàm tạo gợi ý tối ưu
  const generatePickingOptimizations = () => {
    // Logic tạo gợi ý tối ưu
    return [
      {
        id: 1,
        description: "Xử lý 5 đơn Vali Larita 28L cùng lúc từ vị trí A12 sẽ giảm 25% thời gian di chuyển.",
      },
      {
        id: 2,
        description: "Sắp xếp lại kho để tối ưu hóa lộ trình lấy hàng.",
      },
    ];
  };
  const renderPickingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${finalThemeClasses.surface || 'bg-white dark:bg-gray-800'} ${finalThemeClasses.border || 'border-gray-200 dark:border-gray-700'}`}>
          <h3 className={`text-lg font-medium mb-4 ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'}`}>Lộ trình lấy hàng tối ưu</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-3 rounded-lg ${finalThemeClasses.surfaceHover || 'bg-gray-50 dark:bg-gray-700'} border ${finalThemeClasses.border || 'border-gray-200 dark:border-gray-600'}`}>
              <h4 className="text-sm font-medium text-blue-400 mb-2">Khu A</h4>
              <p className={`text-xs ${finalThemeClasses.text?.muted || 'text-gray-500 dark:text-gray-400'}`}>Vali theo Size</p>
              <div className={`mt-2 text-xs ${finalThemeClasses.text?.secondary || 'text-gray-600 dark:text-gray-300'}`}>Đơn: 8</div>
              <div className={`mt-1 text-xs ${finalThemeClasses.text?.secondary || 'text-gray-600 dark:text-gray-300'}`}>SKU: 12</div>
            </div>
            <div className={`p-3 rounded-lg ${finalThemeClasses.surfaceHover || 'bg-gray-50 dark:bg-gray-700'} border ${finalThemeClasses.border || 'border-gray-200 dark:border-gray-600'}`}>
              <h4 className="text-sm font-medium text-green-400 mb-2">Khu B</h4>
              <p className={`text-xs ${finalThemeClasses.text?.muted || 'text-gray-500 dark:text-gray-400'}`}>Phụ kiện</p>
              <div className={`mt-2 text-xs ${finalThemeClasses.text?.secondary || 'text-gray-600 dark:text-gray-300'}`}>Đơn: 6</div>
              <div className={`mt-1 text-xs ${finalThemeClasses.text?.secondary || 'text-gray-600 dark:text-gray-300'}`}>SKU: 15</div>
            </div>
            <div className={`p-3 rounded-lg ${finalThemeClasses.surfaceHover || 'bg-gray-50 dark:bg-gray-700'} border ${finalThemeClasses.border || 'border-gray-200 dark:border-gray-600'}`}>
              <h4 className="text-sm font-medium text-purple-400 mb-2">
                Khu C
              </h4>
              <p className={`text-xs ${finalThemeClasses.text?.muted || 'text-gray-500 dark:text-gray-400'}`}>Hàng đặc biệt</p>
              <div className={`mt-2 text-xs ${finalThemeClasses.text?.secondary || 'text-gray-600 dark:text-gray-300'}`}>Đơn: 3</div>
              <div className={`mt-1 text-xs ${finalThemeClasses.text?.secondary || 'text-gray-600 dark:text-gray-300'}`}>SKU: 5</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className={`text-sm font-medium mb-2 ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'}`}>Lộ trình đề xuất</h4>
            <div className={`p-3 rounded-lg ${finalThemeClasses.surfaceHover || 'bg-gray-100 dark:bg-gray-800'}`}>
              <div className="flex items-center space-x-2 text-sm">
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A1
                </span>
                <span className={`${finalThemeClasses.text?.muted || 'text-gray-400'}`}>→</span>
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A2
                </span>
                <span className={`${finalThemeClasses.text?.muted || 'text-gray-400'}`}>→</span>
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A5
                </span>
                <span className={`${finalThemeClasses.text?.muted || 'text-gray-400'}`}>→</span>
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A12
                </span>
                <span className={`${finalThemeClasses.text?.muted || 'text-gray-400'}`}>→</span>
                <span className="inline-block px-2 py-1 bg-green-500 rounded text-white text-xs">
                  B2
                </span>
                <span className="text-gray-400">→</span>
                <span className="inline-block px-2 py-1 bg-green-500 rounded text-white text-xs">
                  B8                </span>
              </div>
              <div className={`mt-2 text-xs ${finalThemeClasses.text?.muted || 'text-gray-500 dark:text-gray-400'}`}>
                Áp dụng nguyên tắc: Đơn 1 sản phẩm → Đơn cùng loại → Đơn gần vị
                trí
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className={`text-sm font-medium mb-2 ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'}`}>Gọi ý tối ưu lấy hàng</h4>
            <div
              className={`p-3 rounded-lg ${finalThemeClasses.surfaceHover || 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'} border-l-4 border-blue-600 text-sm`}
            >
              <p className={`${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'}`}>
                Xử lý 5 đơn Vali Larita 28L cùng lúc từ vị trí A12 sẽ giảm 25%
                thời gian di chuyển.
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${finalThemeClasses.surface || 'bg-white dark:bg-gray-800'} ${finalThemeClasses.border || 'border-gray-200 dark:border-gray-700'}`}>
          <h3 className={`text-lg font-medium mb-4 ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'}`}>
            Đơn hàng theo lộ trình picking
          </h3>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg ${finalThemeClasses.surface || 'bg-white dark:bg-gray-800'} border-l-4 border-blue-600 ${finalThemeClasses.border || 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className={`text-sm font-medium ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'}`}>
                    Batch #1: Khu A - Vali
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                      5 đơn
                    </span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                      8 SKU
                    </span>
                  </div>
                </div>
                <button
                  className={`px-2 py-1 rounded text-xs ${buttonPrimaryClass}`}
                >
                  Bắt đầu lấy hàng
                </button>
              </div>
              <div className="mt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-75">Đơn:</span> SO0405:123456,
                    SO0405:123460...
                  </div>
                  <div>
                    <span className="opacity-75">Vị trí:</span> A1, A2, A5, A12
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${cardClass} border-l-4 border-green-600`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">
                    Batch #2: Khu B - Phụ kiện
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                      4 đơn
                    </span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                      10 SKU
                    </span>
                  </div>
                </div>
                <button
                  className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
                >
                  Bắt đầu lấy hàng
                </button>
              </div>
              <div className="mt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-75">Đơn:</span> SO0405:123458,
                    SO0405:123459...
                  </div>
                  <div>
                    <span className="opacity-75">Vị trí:</span> B2, B8, B15
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${cardClass} border-l-4 border-purple-600`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">
                    Batch #3: Khu C - Hàng đặc biệt
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                      2 đơn
                    </span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                      3 SKU
                    </span>
                  </div>
                </div>
                <button
                  className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
                >
                  Bắt đầu lấy hàng
                </button>
              </div>
              <div className="mt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-75">Đơn:</span> SO0405:123461,
                    SO0405:123462
                  </div>
                  <div>
                    <span className="opacity-75">Vị trí:</span> C4, C10
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Nguyên tắc lấy hàng theo 80/20
            </h4>
            <div className={`p-3 rounded-lg bg-gray-900 text-sm`}>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Xử lý đơn P1 trước 100%</li>
                <li>Xử lý đơn 1 sản phẩm (nhanh chóng hoàn thành)</li>
                <li>Gom nhóm đơn cùng loại sản phẩm (giảm di chuyển)</li>
                <li>Nhóm đơn gần vị trí nhau (tối ưu lộ trình)</li>
                <li>Xử lý đơn nhiều loại sản phẩm sau cùng</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Mô hình kho và vị trí đơn hàng
          </h3>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded text-sm flex items-center ${buttonSecondaryClass}`}
            >
              <List size={16} className="mr-1" /> Danh sách
            </button>
            <button
              className={`px-3 py-1 rounded text-sm flex items-center ${buttonPrimaryClass}`}
            >
              <Grid size={16} className="mr-1" /> Mô hình kho
            </button>
          </div>
        </div>

        <div className="relative p-4 border border-gray-700 rounded-lg">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-blue-900 text-white text-center p-2 rounded">
              A1
              <div className="text-xs mt-1">Vali S</div>
            </div>
            <div className="bg-blue-900 text-white text-center p-2 rounded">
              A2
              <div className="text-xs mt-1">Vali M</div>
            </div>
            <div className="bg-blue-900 text-white text-center p-2 rounded relative">
              A5
              <div className="text-xs mt-1">Vali M</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                2
              </div>
            </div>
            <div className="bg-blue-900 text-white text-center p-2 rounded relative">
              A12
              <div className="text-xs mt-1">Vali L</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </div>
            </div>
          </div>

          <div className="bg-gray-700 h-6 mb-4 flex items-center justify-center text-xs">
            Lối đi
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-green-900 text-white text-center p-2 rounded relative">
              B2
              <div className="text-xs mt-1">Phụ kiện</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
            <div className="bg-green-900 text-white text-center p-2 rounded relative">
              B8
              <div className="text-xs mt-1">Phụ kiện</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                2
              </div>
            </div>
            <div className="bg-green-900 text-white text-center p-2 rounded">
              B10
              <div className="text-xs mt-1">Phụ kiện</div>
            </div>
            <div className="bg-green-900 text-white text-center p-2 rounded relative">
              B15
              <div className="text-xs mt-1">Phụ kiện</div>
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
          </div>

          <div className="bg-gray-700 h-6 mb-4 flex items-center justify-center text-xs">
            Lối đi
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-purple-900 text-white text-center p-2 rounded relative">
              C4
              <div className="text-xs mt-1">Đặc biệt</div>
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
            <div className="bg-purple-900 text-white text-center p-2 rounded">
              C8
              <div className="text-xs mt-1">Đặc biệt</div>
            </div>
            <div className="bg-purple-900 text-white text-center p-2 rounded relative">
              C10
              <div className="text-xs mt-1">Đặc biệt</div>
              <div className="absolute -top-1 -right-1 bg-blue-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
            <div className="bg-purple-900 text-white text-center p-2 rounded">
              C12
              <div className="text-xs mt-1">Đặc biệt</div>
            </div>
          </div>

          <div className="mt-4 text-xs flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Đơn P1</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              <span>Đơn P2</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span>Đơn P3/P4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 // Render mô hình kho với hiệu ứng trực quan
  const renderWarehouseMap = () => {
    const createLocationGrid = (zone) => {
      // Tạo lưới vị trí cho từng khu vực
      const orders = data.orders || [];
      const highlightedLocations = data.highlightedLocations || [];
      const zoneLocations = data.locations.filter((loc) => loc.zone === zone.id);
      const zoneGrid = createGrid(zone, orders, highlightedLocations);
      return (
        <div key={zone.id} className="mb-6">
          <h3 className="text-lg font-medium mb-2">{zone.name}</h3>
          <div className="grid grid-cols-4 gap-2">
            {zoneGrid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-2">
                {row.map((location) => (
                  <div
                    key={location.id}
                    className={`p-2 rounded-lg border ${
                      location.isHighlighted ? "bg-yellow-100" : "bg-gray-200"
                    }`}
                  >
                    <div className="text-sm font-medium">{location.id}</div>
                    <div className="text-xs text-gray-500">
                      P1: {location.p1Count} | P2: {location.p2Count} | P3:{" "}
                      {location.p3Count}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: {location.total}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    };
    const zones = data.zones || [];
    return (
      <div>
        {zones.map((zone) => (
          <div key={zone.id}>
            <h3 className="text-lg font-medium mb-2">{zone.name}</h3>
            <div className="grid grid-cols-4 gap-2">
              {createLocationGrid(zone)}
            </div>
          </div>
        ))}
      </div>
    );
  };
  // Hàm tạo lưới vị trí kho
  const createGrid = (zone, orders, highlightedLocations) => {
    const grid = [];
    let locationIndex = 1;

    for (let row = 0; row < zone.rows; row++) {
      const rowItems = [];
      for (let col = 0; col < zone.cols; col++) {
        const locationId = `${zone.id}${locationIndex}`;
        const p1Count = orders.filter(
          (o) =>
            o.status !== "completed" &&
            o.priority === "P1" &&
            o.items?.some((item) => item.location === locationId)
        ).length;

        const p2Count = orders.filter(
          (o) =>
            o.status !== "completed" &&
            o.priority === "P2" &&
            o.items?.some((item) => item.location === locationId)
        ).length;

        const p3Count = orders.filter(
          (o) =>
            o.status !== "completed" &&
            o.priority === "P3" &&
            o.items?.some((item) => item.location === locationId)
        ).length;

        // Check if the location exists in the zone
        let location = zone.locations.find((loc) => loc.id === locationId);
        if (!location) {
          // If not found, create a new location
          location = {
            id: locationId,
            type: "default",
            zone: zone.id,
          };
          zone.locations.push(location);
        }

        const isHighlighted = highlightedLocations.includes(locationId);

        // Add information to the grid
        rowItems.push({
          id: locationId,
          p1Count,
          p2Count,
          p3Count,
          total: p1Count + p2Count + p3Count,
          isHighlighted,
        });

        locationIndex++;
      }
      if (rowItems.length > 0) {
        grid.push(rowItems);
      }
    }
    return grid;
  };
// Get theme classes and other data - use props if provided, otherwise fall back to context
  const layoutContext = useLayout();
  const authContext = useContext(AuthContext);

  // Use props if provided, otherwise fall back to context
  const finalThemeClasses = themeClasses || layoutContext.themeClasses || {};
  const finalData = data || authContext.data || {};
  const finalMetrics = metrics || authContext.metrics || {};
  const uiState = layoutContext.uiState || {};  return (
    <div className={`space-y-6 ${finalThemeClasses.surface || 'bg-white dark:bg-gray-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <h1 className={`text-3xl font-bold ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'}`}>Tab Picking</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange("picking")}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === "picking"
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : `${finalThemeClasses.surfaceHover || 'bg-gray-200 dark:bg-gray-700'} ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'} hover:bg-gray-300 dark:hover:bg-gray-600`
            }`}
          >
            Picking
          </button>
          <button
            onClick={() => handleTabChange("analytics")}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === "analytics"
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : `${finalThemeClasses.surfaceHover || 'bg-gray-200 dark:bg-gray-700'} ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'} hover:bg-gray-300 dark:hover:bg-gray-600`
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => handleTabChange("settings")}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === "settings"
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : `${finalThemeClasses.surfaceHover || 'bg-gray-200 dark:bg-gray-700'} ${finalThemeClasses.text?.primary || 'text-gray-900 dark:text-white'} hover:bg-gray-300 dark:hover:bg-gray-600`
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === "picking" && renderPickingTab()}
      {activeTab === "analytics" && <AnalyticsTab />}
      {activeTab === "settings" && <SettingsTab themeClasses={finalThemeClasses} />}      {/* Hiển thị mô hình kho */}
      {warehouseViewMode === 'default' && renderWarehouseMap()}

      {/* Hiển thị hoạt động của nhân viên */}
      <StaffPerformanceWidget themeClasses={finalThemeClasses} />
    </div>
  );
}
// ==================== EXPORTS ====================
export default PickingTab;
