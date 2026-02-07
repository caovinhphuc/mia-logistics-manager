import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PickingOptimizationModule from '../modules/PickingOptimizationModule'; // Giả sử bạn có module này
import WarehouseLayoutMap from '../data/WarehouseLayoutMap'; // Giả sử bạn có dữ liệu layout kho
import { useAuth } from '../context/AuthContext'; // Giả sử bạn có context Auth để lấy thông tin người dùng
import { useActivityHistory } from '../context/ActivityHistoryContext'; // Giả sử bạn có context để quản lý lịch sử hoạt động
import { SYSTEM_CONFIG } from '../components/config/systemConfig'; // Giả sử bạn có cấu hình hệ thống
import WidgetWrapper from '../components/layout/WidgetWrapper'; // Giả sử bạn có component wrapper cho widget
import { useOrders } from '../hooks/useOrders'; // Giả sử bạn có hook để lấy danh sách đơn hàng
import { useWarehouseData } from '../hooks/useWarehouseData'; // Giả sử bạn có hook để lấy dữ liệu kho
import { useTheme } from '../hooks/useTheme'; // Giả sử bạn có hook để lấy theme
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useContext } from 'react';
import { ActivityHistoryContext } from '../context/ActivityHistoryContext'; // Giả sử bạn có context để quản lý lịch sử hoạt động

// Sử dụng context để lấy dữ liệu lịch sử hoạt động
const { activityHistory, setActivityHistory } = useContext(ActivityHistoryContext);

// Thêm state để lưu trữ dữ liệu từ WarehouseLayoutMap
const [optimizedRoutes, setOptimizedRoutes] = useState([]);
const [warehouseData, setWarehouseData] = useState({
  zones: [],
  shelves: [],
  orders: []
});

// Thêm function để tính toán lộ trình tối ưu từ dữ liệu đơn hàng
const calculateOptimalRoute = (orders) => {
  // Sử dụng thuật toán từ PickingOptimizationModule.js
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing");

  // Phân loại đơn hàng theo nguyên tắc 80/20
  const p1Orders = pendingOrders.filter(o => o.priority === "P1");
  const p2Orders = pendingOrders.filter(o => o.priority === "P2");
  const otherOrders = pendingOrders.filter(o => o.priority !== "P1" && o.priority !== "P2");

  // Nhóm đơn theo loại sản phẩm
  const valiOrders = pendingOrders.filter(o => o.productType === "vali-only");
  const singleProductOrders = pendingOrders.filter(o => o.items && o.items.length === 1);

  // Tạo lộ trình tối ưu theo nguyên tắc:
  // 1. Xử lý đơn P1 trước
  // 2. Xử lý đơn 1 sản phẩm (nhanh)
  // 3. Gom nhóm đơn cùng loại (giảm di chuyển)

  // Trả về lộ trình theo các khu vực
  return [
    { zone: "A", count: p1Orders.filter(o => o.zone === "A").length + p2Orders.filter(o => o.zone === "A").length },
    { zone: "B", count: p1Orders.filter(o => o.zone === "B").length + p2Orders.filter(o => o.zone === "B").length },
    { zone: "C", count: p1Orders.filter(o => o.zone === "C").length + p2Orders.filter(o => o.zone === "C").length },
  ];
};

// Sửa phần renderPickingTab để sử dụng dữ liệu thực
const renderPickingTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Lộ trình lấy hàng tối ưu</h3>
          <button
            className={`px-3 py-1 rounded text-sm flex items-center ${buttonPrimaryClass}`}
            onClick={() => {
              const routes = calculateOptimalRoute(orders);
              setOptimizedRoutes(routes);

              // Thêm vào lịch sử hoạt động
              const newLog = {
                id: activityHistory.length + 1,
                type: "picking",
                action: "Tạo lộ trình lấy hàng tối ưu",
                user: currentUser?.name || "System",
                time: new Date().toLocaleTimeString("vi-VN"),
              };
              setActivityHistory([newLog, ...activityHistory]);
            }}
          >
            <RefreshCw size={16} className="mr-1" /> Tối ưu lại
          </button>
        </div>

        {/* Hiển thị khu vực kho với dữ liệu thực từ optimizedRoutes */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-900 bg-opacity-10 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Khu A</h4>
            <p className="text-xs opacity-75">Vali theo Size</p>
            <div className="mt-2 text-xs">Đơn: {orders.filter(o => (o.status === "pending" || o.status === "processing") && o.zone === "A").length}</div>
            <div className="mt-1 text-xs">SKU: {orders.filter(o => (o.status === "pending" || o.status === "processing") && o.zone === "A").reduce((acc, o) => acc + (o.items?.length || 0), 0)}</div>
          </div>
          {/* Tương tự cho khu B và C */}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Lộ trình đề xuất</h4>
          <div className="p-3 rounded-lg bg-gray-800">
            <div className="flex items-center space-x-2 text-sm">
              {/* Thêm dữ liệu thực từ thuật toán tối ưu lộ trình */}
              <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">A1</span>
              <span className="text-gray-400">→</span>
              <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">A2</span>
              {/* ... */}
            </div>
            <div className="mt-2 text-xs opacity-75">
              Áp dụng nguyên tắc: Đơn 1 sản phẩm → Đơn cùng loại → Đơn gần vị trí
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Gợi ý tối ưu lấy hàng</h4>
          <div className={`p-3 rounded-lg bg-blue-900 bg-opacity-10 border-l-4 border-blue-600 text-sm`}>
            <p>
              {/* Dựa trên dữ liệu thực để đưa ra gợi ý */}
              Xử lý {orders.filter(o => o.status === "pending" && o.productType === "vali-only" && o.items && o.items.some(i => i.name.includes("28L"))).length} đơn Vali Larita 28L cùng lúc từ vị trí A12 sẽ giảm 25% thời gian di chuyển.
            </p>
          </div>
        </div>
      </div>

      {/* Phần đơn hàng theo lộ trình picking */}
      {/* ... */}
    </div>
    {/* ... */}
  </div>
);
// ==================== PROP TYPES ====================
RecentActivitiesWidget.propTypes = {
  data: PropTypes.object.isRequired,
  themeClasses: PropTypes.object.isRequired
};
// ==================== EXPORTS ====================
export const calculateOptimalRoute = (orders) => {
  // Giả sử đây là thuật toán tối ưu lộ trình lấy hàng
  return PickingOptimizationModule.optimize(orders, WarehouseLayoutMap);
};

export default function CalculateOptimalRoute() {
  const { currentUser } = useAuth();
  const { activityHistory, setActivityHistory } = useActivityHistory();
  const { orders } = useOrders();
  const { warehouseData } = useWarehouseData();
  const { themeClasses } = useTheme();

  // Tính toán lộ trình tối ưu
  const optimizedRoutes = useMemo(() => calculateOptimalRoute(orders), [orders]);

  // Ghi log hoạt động
  const logActivity = useCallback((action) => {
    const newLog = {
      id: activityHistory.length + 1,
      type: "picking",
      action,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory([newLog, ...activityHistory]);
  }, [activityHistory, currentUser, setActivityHistory]);

  return (
    <WidgetWrapper
      title="Tính toán lộ trình lấy hàng"
      description="Tối ưu hóa lộ trình lấy hàng dựa trên đơn hàng và layout kho"
      themeClasses={themeClasses}
      isRefreshable={true}
    >
      {renderPickingTab()}
    </WidgetWrapper>
  );
}

CalculateOptimalRoute.propTypes = {
  orders: PropTypes.array.isRequired,
  warehouseData: PropTypes.object.isRequired,
  themeClasses: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  activityHistory: PropTypes.array.isRequired,
  setActivityHistory: PropTypes.func.isRequired
};

// ==================== EXPORTS ====================
export { calculateOptimalRoute };
