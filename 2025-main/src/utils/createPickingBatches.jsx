// Tạo các batch picking dựa trên nguyên tắc 80/20
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActivityHistory } from '../context/ActivityHistoryContext';
import { useOrders } from '../hooks/useOrders';
import { useWarehouseData } from '../hooks/useWarehouseData';
import { SYSTEM_CONFIG } from '../components/config/systemConfig';
import WidgetWrapper from '../components/layout/WidgetWrapper';
import { useTheme } from '../hooks/useTheme';


import PropTypes from 'prop-types';
import PickingOptimizationModule from '../modules/PickingOptimizationModule'; // Giả sử bạn có module này
import WarehouseLayoutMap from '../data/WarehouseLayoutMap'; // Giả sử bạn có dữ liệu layout kho
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { ActivityHistoryContext } from '../context/ActivityHistoryContext'; // Giả sử bạn có context để quản lý lịch sử hoạt động
import { useOrders } from '../hooks/useOrders'; // Giả sử bạn có hook để lấy danh sách đơn hàng
import { useWarehouseData } from '../hooks/useWarehouseData'; // Giả sử bạn có hook để lấy dữ liệu kho
import { useTheme } from '../hooks/useTheme'; // Giả sử bạn có hook để lấy theme
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { SYSTEM_CONFIG } from '../components/config/systemConfig'; // Giả sử bạn có cấu hình hệ thống
import { useAuth } from '../context/AuthContext'; // Giả sử bạn có context Auth để lấy thông tin người dùng

// Thêm state để quản lý các batch picking
const [pickingBatches, setPickingBatches] = useState([]);
const [activeBatch, setActiveBatch] = useState(null);

// Thêm function để tạo batch picking
const createPickingBatches = () => {
  const pendingOrders = orders.filter(o => o.status === "pending");

  // Áp dụng nguyên tắc 80/20:
  // - 20% khu vực kho (các khu vực hot) chứa 80% đơn hàng
  // - 20% SKU (SKU hot) chiếm 80% đơn hàng

  // Batch 1: Khu A - Vali (ưu tiên P1, P2)
  const batch1Orders = pendingOrders.filter(o =>
    o.zone === "A" && (o.priority === "P1" || o.priority === "P2")
  );

  // Batch 2: Khu B - Phụ kiện
  const batch2Orders = pendingOrders.filter(o =>
    o.zone === "B" && (o.priority === "P1" || o.priority === "P2")
  );

  // Batch 3: Khu C - Hàng đặc biệt
  const batch3Orders = pendingOrders.filter(o =>
    o.zone === "C"
  );

  // Batch 4: Còn lại
  const batch4Orders = pendingOrders.filter(o =>
    !batch1Orders.includes(o) && !batch2Orders.includes(o) && !batch3Orders.includes(o)
  );

  return [
    {
      id: "batch1",
      name: "Batch #1: Khu A - Vali",
      orders: batch1Orders,
      locations: ["A1", "A2", "A5", "A12"],
      status: "pending"
    },
    {
      id: "batch2",
      name: "Batch #2: Khu B - Phụ kiện",
      orders: batch2Orders,
      locations: ["B2", "B8", "B15"],
      status: "pending"
    },
    {
      id: "batch3",
      name: "Batch #3: Khu C - Hàng đặc biệt",
      orders: batch3Orders,
      locations: ["C4", "C10"],
      status: "pending"
    }
  ];
};

// Thêm function để bắt đầu lấy hàng một batch
const startPickingBatch = (batchId) => {
  setPickingBatches(prevBatches =>
    prevBatches.map(batch =>
      batch.id === batchId
        ? { ...batch, status: "processing", startTime: new Date().toISOString() }
        : batch
    )
  );

  // Thêm vào lịch sử hoạt động
  const batch = pickingBatches.find(b => b.id === batchId);  const newLog = {
    id: activityHistory.length + 1,
    type: "picking",
    action: `Bắt đầu lấy hàng ${batch.name} (${batch.orders.length} đơn)`,
    user: currentUser?.name || "System",
    time: new Date().toLocaleTimeString("vi-VN") || '--:--',
  };
  setActivityHistory([newLog, ...activityHistory]);

  setActiveBatch(batchId);
};

// Sửa phần render đơn hàng theo lộ trình picking
<div className={`p-4 rounded-lg border ${cardClass}`}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium">Đơn hàng theo lộ trình picking</h3>
    <button
      className={`px-3 py-1 rounded text-sm flex items-center ${buttonPrimaryClass}`}
      onClick={() => {
        const batches = createPickingBatches();
        setPickingBatches(batches);
      }}
    >
      <RefreshCw size={16} className="mr-1" /> Tạo batch mới
    </button>
  </div>

  <div className="space-y-3">
    {pickingBatches.map((batch, index) => (
      <div
        key={batch.id}
        className={`p-3 rounded-lg ${cardClass} ${
          batch.status === "processing" ? "border-l-4 border-blue-600" :
          batch.status === "completed" ? "border-l-4 border-green-600" :
          "border-l-4 border-gray-600"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">{batch.name}</span>
            <div className="flex space-x-1 mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                {batch.orders.length} đơn
              </span>
              <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                {batch.orders.reduce((acc, o) => acc + (o.items?.length || 0), 0)} SKU
              </span>
            </div>
          </div>
          {batch.status === "pending" ? (
            <button
              className={`px-2 py-1 rounded text-xs ${buttonPrimaryClass}`}
              onClick={() => startPickingBatch(batch.id)}
            >
              Bắt đầu lấy hàng
            </button>
          ) : batch.status === "processing" ? (
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
              onClick={() => {
                // Hoàn thành batch
                setPickingBatches(prevBatches =>
                  prevBatches.map(b =>
                    b.id === batch.id
                      ? { ...b, status: "completed", endTime: new Date().toISOString() }
                      : b
                  )
                );

                // Cập nhật trạng thái đơn hàng
                batch.orders.forEach(order => handleCompleteOrder(order.id));

                // Thêm vào lịch sử hoạt động                const newLog = {
                  id: activityHistory.length + 1,
                  type: "picking",
                  action: `Hoàn thành lấy hàng ${batch.name} (${batch.orders.length} đơn)`,
                  user: currentUser?.name || "System",
                  time: new Date().toLocaleTimeString("vi-VN") || '--:--',
                };
                setActivityHistory([newLog, ...activityHistory]);

                setActiveBatch(null);
              }}
            >
              Hoàn thành lấy hàng
            </button>
          ) : (
            <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-400">
              Đã hoàn thành
            </span>
          )}
        </div>
        <div className="mt-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="opacity-75">Đơn:</span> {batch.orders.map(o => o.id).join(', ').slice(0, 30)}...
            </div>
            <div>
              <span className="opacity-75">Vị trí:</span> {batch.locations.join(', ')}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {pickingBatches.length === 0 && (
    <div className="text-center py-8">
      <p className="text-sm opacity-75">Không có batch picking nào. Nhấn "Tạo batch mới" để bắt đầu.</p>
    </div>
  )}

  <div className="mt-4">
    <h4 className="text-sm font-medium mb-2">Nguyên tắc lấy hàng theo 80/20</h4>
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

// Tạo picking batches dựa trên nguyên tắc 80/20
const createPickingBatches = (orders) => {
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing");

  // Phân loại đơn hàng theo nguyên tắc 80/20
  const p1Orders = pendingOrders.filter(o => o.priority === "P1");
  const p2Orders = pendingOrders.filter(o => o.priority === "P2");
  const otherOrders = pendingOrders.filter(o => o.priority !== "P1" && o.priority !== "P2");

  // Tạo các batch picking
  return [
    {
      id: "batch1",
      name: "Batch #1: P1 Orders",
      orders: p1Orders,
      locations: WarehouseLayoutMap.getLocationsForPriority("P1"),
      status: "pending"
    },
    {
      id: "batch2",
      name: "Batch #2: P2 Orders",
      orders: p2Orders,
      locations: WarehouseLayoutMap.getLocationsForPriority("P2"),
      status: "pending"
    },
    {
      id: "batch3",
      name: "Batch #3: Other Orders",
      orders: otherOrders,
      locations: WarehouseLayoutMap.getLocationsForOther(),
      status: "pending"
    }
  ];
};
// ==================== PROP TYPES ====================
createPickingBatches.propTypes = {
  orders: PropTypes.array.isRequired
};
// ==================== EXPORTS ====================
export { createPickingBatches };
export const createPickingBatches = (orders) => {
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing");

  // Phân loại đơn hàng theo nguyên tắc 80/20
  const p1Orders = pendingOrders.filter(o => o.priority === "P1");
  const p2Orders = pendingOrders.filter(o => o.priority === "P2");
  const otherOrders = pendingOrders.filter(o => o.priority !== "P1" && o.priority !== "P2");

  // Tạo các batch picking
  return [
    {
      id: "batch1",
      name: "Batch #1: P1 Orders",
      orders: p1Orders,
      locations: WarehouseLayoutMap.getLocationsForPriority("P1"),
      status: "pending"
    },
    {
      id: "batch2",
      name: "Batch #2: P2 Orders",
      orders: p2Orders,
      locations: WarehouseLayoutMap.getLocationsForPriority("P2"),
      status: "pending"
    },
    {
      id: "batch3",
      name: "Batch #3: Other Orders",
      orders: otherOrders,
      locations: WarehouseLayoutMap.getLocationsForOther(),
      status: "pending"
    }
  ];
};
// ==================== EXPORTS ====================
export default createPickingBatches;

