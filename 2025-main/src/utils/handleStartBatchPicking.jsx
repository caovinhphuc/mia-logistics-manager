// Thêm các state cần thiết trong component WarehouseDashboard
const [pickingBatches, setPickingBatches] = useState([]);
const [activeBatch, setActiveBatch] = useState(null);
const [batchInProgress, setBatchInProgress] = useState(false);

// Function xử lý sự kiện bắt đầu lấy hàng cho batch
const handleStartBatchPicking = (batchId) => {
    // Tìm batch từ id
    const batch = pickingBatches.find(b => b.id === batchId);
    if (!batch) return;

    // Cập nhật trạng thái batch
    setPickingBatches(prevBatches =>
        prevBatches.map(b =>
            b.id === batchId
                ? { ...b, status: "processing", startTime: new Date().toISOString() }
                : b
        )
    );    // Thêm vào lịch sử hoạt động
    const newLog = {
        id: activityHistory.length + 1,
        type: "picking",
        action: `Bắt đầu lấy hàng ${batch.name} (${batch.orders.length} đơn)`,
        user: currentUser?.name || "System",
        time: new Date().toLocaleTimeString("vi-VN") || '--:--',
    };
    setActivityHistory([newLog, ...activityHistory]);

    setActiveBatch(batchId);
    setBatchInProgress(true);

    // Highlight các vị trí trên mô hình kho
    highlightLocationsOnMap(batch.locations);    // Hiển thị thông báo thành công
    setAlerts([
        {
            id: Math.random().toString(36).substr(2, 9),
            type: "info",
            title: "Bắt đầu lấy hàng",
            message: `Đã bắt đầu lấy hàng cho batch ${batch.name}`,
            time: new Date().toLocaleTimeString("vi-VN") || '--:--',
        },
        ...alerts
    ]);
};

// Function xử lý sự kiện hoàn thành lấy hàng cho batch
const handleCompleteBatchPicking = (batchId) => {
    // Tìm batch từ id
    const batch = pickingBatches.find(b => b.id === batchId);
    if (!batch) return;

    // Cập nhật trạng thái batch
    setPickingBatches(prevBatches =>
        prevBatches.map(b =>
            b.id === batchId
                ? {
                    ...b,
                    status: "completed",
                    endTime: new Date().toISOString(),
                    processingTime: Math.round(
                        (new Date() - new Date(b.startTime)) / (1000 * 60)
                    )
                }
                : b
        )
    );

    // Cập nhật trạng thái đơn hàng
    const updatedOrders = [...orders];
    batch.orders.forEach(order => {
        const orderIndex = updatedOrders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
            updatedOrders[orderIndex] = {
                ...updatedOrders[orderIndex],
                status: "completed",
                completionTime: new Date().toISOString()
            };
        }
    });
    setOrders(updatedOrders);    // Thêm vào lịch sử hoạt động
    const newLog = {
        id: activityHistory.length + 1,
        type: "picking",
        action: `Hoàn thành lấy hàng ${batch.name} (${batch.orders.length} đơn) trong ${batch.processingTime || "?"} phút`,
        user: currentUser?.name || "System",
        time: new Date().toLocaleTimeString("vi-VN") || '--:--',
    };
    setActivityHistory([newLog, ...activityHistory]);

    setActiveBatch(null);
    setBatchInProgress(false);

    // Bỏ highlight các vị trí trên mô hình kho
    clearHighlightedLocations();    // Hiển thị thông báo thành công
    setAlerts([
        {
            id: Math.random().toString(36).substr(2, 9),
            type: "success",
            title: "Hoàn thành lấy hàng",
            message: `Đã hoàn thành lấy hàng cho batch ${batch.name}`,
            time: new Date().toLocaleTimeString("vi-VN") || '--:--',
        },
        ...alerts
    ]);

    // Tự động tạo gợi ý cho batch tiếp theo
    suggestNextBatch();
};

// Function highlight các vị trí trên mô hình kho
const highlightLocationsOnMap = (locations) => {
    // Set state để highlight các vị trí trên mô hình kho
    setHighlightedLocations(locations);

    // Cuộn đến phần mô hình kho
    document.getElementById('warehouse-map-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
};

// Render nút bắt đầu lấy hàng với animation và hiệu ứng trực quan
const renderBatchActionButton = (batch) => {
    if (batch.status === "pending") {
        return (
            <button
                className={`px-3 py-1.5 rounded text-sm flex items-center justify-center transition-all duration-200 ${batchInProgress
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                onClick={() => !batchInProgress && handleStartBatchPicking(batch.id)}
                disabled={batchInProgress}
            >
                <Play size={16} className="mr-1" />
                Bắt đầu lấy hàng
            </button>
        );
    } else if (batch.status === "processing") {
        return (
            <button
                className="px-3 py-1.5 rounded text-sm flex items-center justify-center bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                onClick={() => handleCompleteBatchPicking(batch.id)}
            >
                <CheckCircle size={16} className="mr-1" />
                Hoàn thành lấy hàng
            </button>
        );
    } else {
        return (
            <div className="px-3 py-1.5 rounded text-sm flex items-center justify-center bg-gray-700 text-gray-300">
                <CheckCircle size={16} className="mr-1" />
                Đã hoàn thành
            </div>
        );
    }
};

export default handleStartBatchPicking;
