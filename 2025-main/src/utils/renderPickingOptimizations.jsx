// renderPickingOptimizations.jsx
import { useState, useEffect } from 'react';
import { Grid, Map, Package, CheckCircle, Info } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import createOptimizedBatches from './createOptimizedBatches';
import handleLocationClick from './handleLocationClick';
import handleStartBatchPicking from './handleStartBatchPicking';



const PickingOptimizations = () => {
    const [pickingBatches, setPickingBatches] = useState([]);
    const [activeBatch, setActiveBatch] = useState(null);
    const [batchInProgress, setBatchInProgress] = useState(false);
    const [highlightedLocations, setHighlightedLocations] = useState([]);
    const [warehouseViewMode, setWarehouseViewMode] = useState('default');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showLocationDetails, setShowLocationDetails] = useState(false);


    // Render phần gợi ý tối ưu lấy hàng
    const renderPickingOptimizations = () => {
        // Tạo các gợi ý tối ưu
        const optimizations = generatePickingOptimizations();

        return (
            <div className="mb-4">
                <h3 className="font-medium text-lg mb-3">Gợi ý tối ưu lấy hàng</h3>

                {optimizations.length > 0 ? (
                    <div className="bg-blue-900 bg-opacity-10 border-l-4 border-blue-600 p-4 rounded-r-lg">
                        {optimizations.map((optimization, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                                <p className="text-sm">{optimization.message}</p>

                                {optimization.orders && optimization.orders.length > 0 && (
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                                            onClick={() => {
                                                // Tạo batch mới cho gợi ý này
                                                const newBatch = {
                                                    id: `batch-opt-${new Date().getTime()}`,
                                                    name: `Batch: ${optimization.type === "product"
                                                        ? "Sản phẩm"
                                                        : "Vị trí"
                                                        } ${optimization.location}`,
                                                    orders: optimization.orders,
                                                    locations: [optimization.location],
                                                    status: "pending",
                                                    createdAt: new Date().toISOString(),
                                                    principle:
                                                        optimization.type === "product"
                                                            ? PARETO_PRINCIPLES.SAME_PRODUCTS.id
                                                            : PARETO_PRINCIPLES.NEARBY_LOCATIONS.id,
                                                    principleLabel:
                                                        optimization.type === "product"
                                                            ? PARETO_PRINCIPLES.SAME_PRODUCTS.name
                                                            : PARETO_PRINCIPLES.NEARBY_LOCATIONS.name,
                                                };

                                                setPickingBatches([newBatch, ...pickingBatches]);

                                                // Thông báo
                                                setAlerts([
                                                    {                                                        id: Math.random().toString(36).substr(2, 9),
                                                        type: "success",
                                                        title: "Tạo batch mới",
                                                        message: `Đã tạo batch mới cho ${optimization.orders.length} đơn theo gợi ý`,
                                                        time: new Date().toLocaleTimeString("vi-VN") || '--:--',
                                                    },
                                                    ...alerts,
                                                ]);

                                                // Thêm vào lịch sử hoạt động
                                                const newLog = {
                                                    id: activityHistory.length + 1,
                                                    type: "picking",                                                    action: `Tạo batch từ gợi ý tối ưu: ${optimization.message}`,
                                                    user: currentUser?.name || "System",
                                                    time: new Date().toLocaleTimeString("vi-VN") || '--:--',
                                                };
                                                setActivityHistory([newLog, ...activityHistory]);

                                                // Cuộn đến phần batch picking
                                                document
                                                    .getElementById("batch-picking-section")
                                                    ?.scrollIntoView({
                                                        behavior: "smooth",
                                                    });
                                            }}
                                        >
                                            Tạo batch
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-400">Không có gợi ý tối ưu nào</p>
                    </div>
                )}
            </div>
        );
    };

    // Function render batch picking với hiệu ứng trực quan
    const renderBatchPicking = () => {
        return (
            <div id="batch-picking-section" className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">
                        Đơn hàng theo lộ trình picking
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            className={`px-3 py-1.5 rounded text-sm flex items-center ${batchInProgress
                                ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                                }`}
                            onClick={() => !batchInProgress && createOptimizedBatches()}
                            disabled={batchInProgress}
                        >
                            <RefreshCw size={16} className="mr-1" />
                            {pickingBatches.length === 0
                                ? "Tạo batch mới"
                                : "Tối ưu lại batch"}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {pickingBatches.length > 0 ? (
                        pickingBatches.map((batch, index) => (
                            <div
                                key={batch.id}
                                className={`p-4 rounded-lg border ${batch.status === "processing"
                                    ? "border-l-4 border-blue-600 bg-blue-900 bg-opacity-5"
                                    : batch.status === "completed"
                                        ? "border-l-4 border-green-600 bg-green-900 bg-opacity-5"
                                        : index === 0 &&
                                            batch.principle === PARETO_PRINCIPLES.P1_FIRST.id
                                            ? "border-l-4 border-red-600 bg-red-900 bg-opacity-5"
                                            : "border-gray-700"
                                    } transition-all duration-300 ${batch.status === "processing" ? "shadow-lg" : ""
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium">{batch.name}</span>
                                            <span
                                                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${batch.status === "pending"
                                                    ? "bg-gray-700 text-gray-300"
                                                    : batch.status === "processing"
                                                        ? "bg-blue-900 bg-opacity-30 text-blue-400"
                                                        : "bg-green-900 bg-opacity-30 text-green-400"
                                                    }`}
                                            >
                                                {batch.status === "pending"
                                                    ? "Chờ xử lý"
                                                    : batch.status === "processing"
                                                        ? "Đang xử lý"
                                                        : "Hoàn thành"}
                                            </span>
                                        </div>
                                        <div className="flex space-x-1 mt-1">
                                            <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                                                {batch.orders.length} đơn
                                            </span>
                                            <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                                                {batch.orders.reduce(
                                                    (acc, order) => acc + (order.items?.length || 0),
                                                    0
                                                )}{" "}
                                                SKU
                                            </span>
                                            {batch.principle && (
                                                <span className="px-1.5 py-0.5 text-xs rounded bg-purple-900 text-purple-400">
                                                    {batch.principleLabel}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {renderBatchActionButton(batch)}
                                </div>

                                <div className="mt-2 text-xs">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="opacity-75">Đơn:</span>{" "}
                                            {batch.orders
                                                .slice(0, 2)
                                                .map((o) => o.id)
                                                .join(", ")}
                                            {batch.orders.length > 2 &&
                                                `, +${batch.orders.length - 2} đơn khác`}
                                        </div>
                                        <div>
                                            <span className="opacity-75">Vị trí:</span>{" "}
                                            {batch.locations.join(", ")}
                                        </div>
                                    </div>
                                </div>

                                {batch.status === "processing" && (
                                    <div className="mt-3 bg-blue-900 bg-opacity-20 p-2 rounded">
                                        <div className="flex justify-between items-center text-xs">
                                            <span>
                                                Tiến độ: {Math.floor(Math.random() * 50) + 50}%
                                            </span>                                            <span className="text-blue-400">
                                                {batch && batch.startTime ? new Date(
                                                    new Date(batch.startTime).getTime() +
                                                    Math.floor(Math.random() * 10) * 60000
                                                ).toLocaleTimeString() : '--:--'}{" "}
                                                - Dự kiến hoàn thành trong{" "}
                                                {Math.floor(Math.random() * 10) + 5} phút
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{
                                                    width: `${Math.floor(Math.random() * 50) + 50}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg">
                            <div className="mb-2">
                                <Package className="w-10 h-10 text-gray-500 mx-auto" />
                            </div>
                            <p className="text-gray-400 mb-3">Chưa có batch lấy hàng nào</p>
                            <button
                                className="px-3 py-1.5 rounded text-sm flex items-center mx-auto bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={createOptimizedBatches}
                            >
                                <RefreshCw size={16} className="mr-1" />
                                Tạo batch tự động
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">
                        Nguyên tắc lấy hàng theo 80/20
                    </h4>
                    <div className="bg-gray-900 p-3 rounded-lg">
                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                            <li>{PARETO_PRINCIPLES.P1_FIRST.name}</li>
                            <li>{PARETO_PRINCIPLES.SINGLE_PRODUCT.name}</li>
                            <li>{PARETO_PRINCIPLES.SAME_PRODUCTS.name}</li>
                            <li>{PARETO_PRINCIPLES.NEARBY_LOCATIONS.name}</li>
                            <li>{PARETO_PRINCIPLES.MULTI_PRODUCTS.name}</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    };


    export default renderPickingOptimizations;

