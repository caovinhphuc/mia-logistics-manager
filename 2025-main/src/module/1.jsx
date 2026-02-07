// 1.jsx
import { useState, useEffect } from 'react';
import { Grid, Map, Package, CheckCircle, Info } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import createOptimizedBatches from '../utils/createOptimizedBatches';
import handleLocationClick from '../utils/handleLocationClick';
import handleStartBatchPicking from '../utils/handleStartBatchPicking';
import renderPickingTab from '../utils/renderPickingTab';

const PickingTab = () => {
    const [pickingTab, setPickingTab] = useState(renderPickingTab());
    const [activeTab, setActiveTab] = useState("picking");
    const [orders, setOrders] = useState([]);
    const [pickingBatches, setPickingBatches] = useState([]);
    const [activeBatch, setActiveBatch] = useState(null);
    const [batchInProgress, setBatchInProgress] = useState(false);
    const [highlightedLocations, setHighlightedLocations] = useState([]);
    const [warehouseViewMode, setWarehouseViewMode] = useState('default');
    const [showLocationDetailsModal, setShowLocationDetailsModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [activityHistory, setActivityHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Function tạo đơn hàng mẫu nếu chưa có
    const generateSampleOrders = () => {
        const locations = [
            { id: 'A1', type: 'Vali S' },
            { id: 'A2', type: 'Vali M' },
            { id: 'A5', type: 'Vali M' },
            { id: 'A12', type: 'Vali L' },
            { id: 'B2', type: 'Phụ kiện' },
            { id: 'B8', type: 'Phụ kiện' },
            { id: 'B10', type: 'Phụ kiện' },
            { id: 'B15', type: 'Phụ kiện' },
            { id: 'C4', type: 'Đặc biệt' },
            { id: 'C10', type: 'Đặc biệt' }
        ];

        const products = [
            { sku: 'LAR-BLK-28L', name: 'Vali Larita 28L', location: 'A12', zone: 'A' },
            { sku: 'LAR-BLK-24M', name: 'Vali Larita 24M', location: 'A5', zone: 'A' },
            { sku: 'LAR-BLK-20S', name: 'Vali Larita 20S', location: 'A1', zone: 'A' },
            { sku: 'PIS-BLU-24M', name: 'Vali Pisani 24M', location: 'A2', zone: 'A' },
            { sku: 'TAG-BLK-01', name: 'Luggage Tag Black', location: 'B2', zone: 'B' },
            { sku: 'COV-BLK-M', name: 'Cover Medium Black', location: 'B8', zone: 'B' },
            { sku: 'TRK-BLK-01', name: 'Travel Kit Black', location: 'B10', zone: 'B' },
            { sku: 'PCK-BLK-S', name: 'Pack-it Cube Small', location: 'B15', zone: 'B' },
            { sku: 'HER-BLK-01', name: 'Herschel Backpack Black', location: 'C4', zone: 'C' },
            { sku: 'LTH-BRW-01', name: 'Leather Travel Bag Brown', location: 'C10', zone: 'C' }
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
                    quantity: Math.floor(Math.random() * 2) + 1
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
                deadline: new Date(new Date().getTime() + (24 + Math.random() * 24) * 60 * 60 * 1000).toISOString()
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
            };
        }
    }, [activeTab, orders.length, activityHistory.length]);

    return (
        <div className="space-y-6">
            {/* Gợi ý tối ưu lấy hàng */}
            {renderPickingOptimizations()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Batch Picking */}

                <div
                    id="batch-picking-section"
                    className={`p-4 rounded-lg border ${cardClass}`}
                >
                    {renderBatchPicking()}

                </div>

                {/* Mô hình kho và vị trí đơn hàng */}

                <div
                    id="warehouse-map-section"
                    className={`p-4 rounded-lg border ${cardClass}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Mô hình kho và vị trí đơn hàng</h3>
                        <div className="flex space-x-2">
                            <button
                                className={`px-3 py-1 rounded text-sm flex items-center ${warehouseViewMode === 'default'
                                    ? buttonPrimaryClass
                                    : buttonSecondaryClass
                                    }`}
                                onClick={() => setWarehouseViewMode('default')}
                            >
                                <Grid size={16} className="mr-1" /> Mặc định
                            </button>
                            <button
                                className={`px-3 py-1 rounded text-sm flex items-center ${warehouseViewMode === 'picking'
                                    ? buttonPrimaryClass
                                    : buttonSecondaryClass
                                    }`}
                                onClick={() => setWarehouseViewMode('picking')}
                            >
                                <Map size={16} className="mr-1" /> Lộ trình
                            </button>
                        </div>
                    </div>

                    {/* Render mô hình kho */}
                    {renderWarehouseMap()}

                    {/* Modal chi tiết vị trí */}
                    {renderLocationDetailsModal()}
                </div>
            </div>

            {/* Đơn hàng đang xử lý */}
            {activeBatch && (
                <div className={`p-4 rounded-lg border ${cardClass} bg-blue-900 bg-opacity-5`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium flex items-center">
                            <Package className="w-5 h-5 mr-1 text-blue-500" />
                            Đơn hàng đang xử lý
                        </h3>
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {pickingBatches.find(b => b.id === activeBatch)?.orders.length || 0} đơn
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-2 text-left text-xs font-medium text-gray-400">Mã đơn</th>
                                    <th className="py-2 text-left text-xs font-medium text-gray-400">SLA</th>
                                    <th className="py-2 text-left text-xs font-medium text-gray-400">Sản phẩm</th>
                                    <th className="py-2 text-left text-xs font-medium text-gray-400">Vị trí</th>
                                    <th className="py-2 text-center text-xs font-medium text-gray-400">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pickingBatches.find(b => b.id === activeBatch)?.orders.map((order, index) => (
                                    <tr key={order.id} className="border-b border-gray-700">
                                        <td className="py-2 text-sm">{order.id}</td>
                                        <td className="py-2 text-sm">
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${order.priority === "P1"
                                                ? "bg-red-900 bg-opacity-30 text-red-400"
                                                : order.priority === "P2"
                                                    ? "bg-yellow-900 bg-opacity-30 text-yellow-400"
                                                    : "bg-blue-900 bg-opacity-30 text-blue-400"
                                                }`}>
                                                {order.priority}
                                            </span>
                                        </td>
                                        <td className="py-2 text-sm">
                                            {order.items?.map(item => item.name).join(', ')}
                                        </td>
                                        <td className="py-2 text-sm">
                                            {[...new Set(order.items?.map(item => item.location))].join(', ')}
                                        </td>
                                        <td className="py-2 text-sm text-center">
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-900 bg-opacity-30 text-blue-400">
                                                Đang xử lý
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            className="px-3 py-1.5 rounded text-sm flex items-center bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleCompleteBatchPicking(activeBatch)}
                        >
                            <CheckCircle size={16} className="mr-1" />
                            Hoàn thành tất cả
                        </button>
                    </div>
                </div>
            )}

            {/* Hướng dẫn sử dụng */}
            <div className={`p-4 rounded-lg border border-dashed ${cardClass} bg-opacity-50`}>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-500" />
                    Hướng dẫn sử dụng Picking
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Click <strong>Tạo batch mới</strong> để tạo các batch lấy hàng tối ưu theo nguyên tắc 80/20</li>
                    <li>Click <strong>Bắt đầu lấy hàng</strong> để bắt đầu xử lý một batch</li>
                    <li>Mô hình kho sẽ tự động highlight các vị trí cần lấy hàng</li>
                    <li>Click vào vị trí trên mô hình kho để xem chi tiết và tạo batch mới từ vị trí đó</li>
                    <li>Sau khi hoàn thành, click <strong>Hoàn thành lấy hàng</strong> để đánh dấu batch đã xong</li>
                </ol>
            </div>
        </div>

    );
};

export default PickingTab;

