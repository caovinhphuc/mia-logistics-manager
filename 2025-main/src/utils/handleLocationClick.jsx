// Thêm các state để quản lý mô hình kho
const [highlightedLocations, setHighlightedLocations] = useState([]);
const [warehouseViewMode, setWarehouseViewMode] = useState('default'); // 'default', 'heatmap', 'picking'
const [selectedLocation, setSelectedLocation] = useState(null);
const [showLocationDetails, setShowLocationDetails] = useState(false);

// Function xử lý khi click vào vị trí trên mô hình kho
const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);

    // Lấy danh sách đơn hàng tại vị trí này
    const ordersAtLocation = orders.filter(order =>
        order.status !== "completed" &&
        order.items &&
        order.items.some(item => item.location === location.id)
    );

    // Thêm vào lịch sử hoạt động
    const newLog = {
        id: activityHistory.length + 1,        type: "picking",
        action: `Xem vị trí kho ${location.id} (${ordersAtLocation.length} đơn)`,
        user: currentUser?.name || "System",
        time: new Date().toLocaleTimeString("vi-VN") || '--:--',
    };
    setActivityHistory([newLog, ...activityHistory]);
};

// Function tạo gợi ý tối ưu lấy hàng
const generatePickingOptimizations = () => {
    // Phân tích đơn hàng để tìm các cơ hội tối ưu
    const pendingOrders = orders.filter(o => o.status === "pending");
    const optimizations = [];

    // Tìm các sản phẩm xuất hiện nhiều trong các đơn hàng
    const productCounts = {};
    pendingOrders.forEach(order => {
        order.items?.forEach(item => {
            productCounts[item.sku] = (productCounts[item.sku] || 0) + 1;
        });
    });

    // Tìm các sản phẩm phổ biến (xuất hiện trong nhiều đơn)
    const popularProducts = Object.entries(productCounts)
        .filter(([_, count]) => count >= 3)
        .sort(([_, countA], [__, countB]) => countB - countA)
        .map(([sku]) => sku);

    // Tìm các vị trí có nhiều đơn hàng
    const locationCounts = {};
    pendingOrders.forEach(order => {
        order.items?.forEach(item => {
            locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
        });
    });

    const busyLocations = Object.entries(locationCounts)
        .filter(([_, count]) => count >= 3)
        .sort(([_, countA], [__, countB]) => countB - countA)
        .map(([location]) => location);

    // Tạo gợi ý dựa trên sản phẩm phổ biến
    if (popularProducts.length > 0) {
        const product = orders.flatMap(o => o.items || [])
            .find(item => item.sku === popularProducts[0]);

        if (product) {
            const ordersWithProduct = pendingOrders.filter(o =>
                o.items?.some(item => item.sku === product.sku)
            );

            optimizations.push({
                type: 'product',
                message: `Xử lý ${ordersWithProduct.length} đơn ${product.name} cùng lúc từ vị trí ${product.location} sẽ giảm 25% thời gian di chuyển.`,
                orders: ordersWithProduct,
                location: product.location
            });
        }
    }

    // Tạo gợi ý dựa trên vị trí bận rộn
    if (busyLocations.length > 0) {
        const location = busyLocations[0];
        const ordersAtLocation = pendingOrders.filter(o =>
            o.items?.some(item => item.location === location)
        );

        optimizations.push({
            type: 'location',
            message: `Xử lý ${ordersAtLocation.length} đơn tại vị trí ${location} cùng lúc sẽ giảm 30% thời gian xử lý.`,
            orders: ordersAtLocation,
            location: location
        });
    }

    return optimizations;
};

// Render mô hình kho với hiệu ứng trực quan
const renderWarehouseMap = () => {
    const warehouseZones = [
        { id: "A", name: "Khu A - Vali", color: "#3B82F6", rows: 3, cols: 4 },
        { id: "B", name: "Khu B - Phụ kiện", color: "#10B981", rows: 2, cols: 4 },
        { id: "C", name: "Khu C - Đặc biệt", color: "#8B5CF6", rows: 2, cols: 4 }
    ];

    // Chuyển đổi từ flat list sang grid để dễ render
    const createLocationGrid = (zone) => {
        const grid = [];
        let locationIndex = 1;

        for (let row = 0; row < zone.rows; row++) {
            const rowItems = [];
            for (let col = 0; col < zone.cols; col++) {
                const locationId = `${zone.id}${locationIndex}`;

                // Tìm số lượng đơn tại vị trí này
                const p1Count = orders.filter(o =>
                    o.status !== "completed" &&
                    o.priority === "P1" &&
                    o.items?.some(item => item.location === locationId)
                ).length;

                const p2Count = orders.filter(o =>
                    o.status !== "completed" &&
                    o.priority === "P2" &&
                    o.items?.some(item => item.location === locationId)
                ).length;

                const p3Count = orders.filter(o =>
                    o.status !== "completed" &&
                    o.priority === "P3" &&
                    o.items?.some(item => item.location === locationId)
                ).length;

                const isHighlighted = highlightedLocations.includes(locationId);

                rowItems.push({
                    id: locationId,
                    p1Count,
                    p2Count,
                    p3Count,
                    total: p1Count + p2Count + p3Count,
                    isHighlighted
                });

                locationIndex++;
            }
            grid.push(rowItems);
        }

        return grid;
    };

    return (
        <div className="space-y-4">
            {warehouseZones.map(zone => {
                const locationGrid = createLocationGrid(zone);

                return (
                    <div key={zone.id} className="space-y-2">
                        {locationGrid.map((row, rowIndex) => (
                            <div key={`${zone.id}-row-${rowIndex}`} className="flex space-x-2">
                                {row.map(location => (
                                    <div
                                        key={location.id}
                                        className={`flex-1 p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${location.isHighlighted
                                            ? 'border-2 border-yellow-400 shadow-lg animate-pulse'
                                            : 'border border-gray-700'
                                            }`}
                                        style={{
                                            backgroundColor: location.total > 0
                                                ? `${zone.color}30`
                                                : '#1F2937',
                                            boxShadow: location.isHighlighted
                                                ? '0 0 15px rgba(251, 191, 36, 0.5)'
                                                : 'none'
                                        }}
                                        onClick={() => handleLocationClick({
                                            id: location.id,
                                            zone: zone.id,
                                            type: zone.id === 'A' ? 'Vali' : zone.id === 'B' ? 'Phụ kiện' : 'Đặc biệt'
                                        })}
                                    >
                                        <div className="text-center">
                                            <div className="font-medium mb-1">{location.id}</div>
                                            <div className="text-xs text-gray-400">
                                                {zone.id === 'A' ? 'Vali' : zone.id === 'B' ? 'Phụ kiện' : 'Đặc biệt'}
                                            </div>

                                            {/* Hiển thị số lượng đơn */}
                                            {location.total > 0 && (
                                                <div className="mt-2 flex justify-center space-x-2">
                                                    {location.p1Count > 0 && (
                                                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                                            {location.p1Count}
                                                        </span>
                                                    )}
                                                    {location.p2Count > 0 && (
                                                        <span className="w-5 h-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                                                            {location.p2Count}
                                                        </span>
                                                    )}
                                                    {location.p3Count > 0 && (
                                                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                                                            {location.p3Count}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Lối đi giữa các khu vực */}
                        {zone.id !== 'C' && (
                            <div className="h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                                Lối đi
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-xs">Đơn P1</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-xs">Đơn P2</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span className="text-xs">Đơn P3/P4</span>
                </div>
                {highlightedLocations.length > 0 && (
                    <div className="flex items-center">
                        <div className="w-3 h-3 border-2 border-yellow-400 rounded-full mr-1 animate-pulse"></div>
                        <span className="text-xs">Đang lấy hàng</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Render modal chi tiết vị trí
const renderLocationDetailsModal = () => {
    if (!selectedLocation || !showLocationDetails) return null;

    // Lấy danh sách đơn hàng tại vị trí này
    const ordersAtLocation = orders.filter(order =>
        order.status !== "completed" &&
        order.items &&
        order.items.some(item => item.location === selectedLocation.id)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        Chi tiết vị trí {selectedLocation.id} - {selectedLocation.type}
                    </h3>
                    <button
                        className="p-1 rounded-full hover:bg-gray-700"
                        onClick={() => setShowLocationDetails(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Sản phẩm tại vị trí này</h4>
                        {/* Hiển thị danh sách sản phẩm */}
                        <div className="space-y-2">
                            {[...new Set(ordersAtLocation.flatMap(o => o.items || [])
                                .filter(item => item.location === selectedLocation.id)
                                .map(item => item.sku))]
                                .map(sku => {
                                    const item = ordersAtLocation.flatMap(o => o.items || [])
                                        .find(item => item.sku === sku && item.location === selectedLocation.id);

                                    const count = ordersAtLocation.flatMap(o => o.items || [])
                                        .filter(i => i.sku === sku && i.location === selectedLocation.id)
                                        .length;

                                    return item ? (
                                        <div key={sku} className="flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <span className="bg-blue-900 bg-opacity-30 px-2 py-0.5 rounded text-blue-400 text-xs">
                                                {count} đơn
                                            </span>
                                        </div>
                                    ) : null;
                                })
                            }
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Đơn hàng tại vị trí này ({ordersAtLocation.length})</h4>
                        {ordersAtLocation.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {ordersAtLocation.map(order => (
                                    <div
                                        key={order.id}
                                        className={`p-3 rounded-lg border ${order.priority === "P1"
                                            ? "border-red-600 bg-red-900 bg-opacity-10"
                                            : order.priority === "P2"
                                                ? "border-yellow-600 bg-yellow-900 bg-opacity-10"
                                                : "border-blue-600 bg-blue-900 bg-opacity-10"
                                            }`}
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-medium">{order.id}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${order.priority === "P1"
                                                ? "bg-red-500 text-white"
                                                : order.priority === "P2"
                                                    ? "bg-yellow-500 text-white"
                                                    : "bg-blue-500 text-white"
                                                }`}>
                                                {order.priority}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm opacity-75">
                                            {order.items?.filter(item => item.location === selectedLocation.id)
                                                .map(item => `${item.name} (${item.quantity || 1})`)
                                                .join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                Không có đơn hàng nào tại vị trí này
                            </div>
                        )}
                    </div>

                    {ordersAtLocation.length >= 3 && (
                        <div className="bg-blue-900 bg-opacity-10 border-l-4 border-blue-600 p-3 rounded-r-lg">
                            <h4 className="font-medium text-blue-400 mb-1">Gợi ý tối ưu</h4>
                            <p className="text-sm">
                                Gom nhóm {ordersAtLocation.length} đơn hàng tại vị trí {selectedLocation.id} sẽ giảm
                                {ordersAtLocation.length > 5 ? " 30%" : " 20%"} thời gian di chuyển.
                            </p>
                            <div className="mt-2 flex justify-end">
                                <button
                                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                                    onClick={() => {
                                        // Tạo batch mới cho các đơn tại vị trí này
                                        const newBatch = {
                                            id: `batch-${new Date().getTime()}`,
                                            name: `Batch: ${selectedLocation.id} - ${selectedLocation.type}`,
                                            orders: ordersAtLocation,
                                            locations: [selectedLocation.id],
                                            status: "pending"
                                        };

                                        setPickingBatches([newBatch, ...pickingBatches]);
                                        setShowLocationDetails(false);

                                        // Thông báo
                                        setAlerts([
                                            {
                                                id: Math.random().toString(36).substr(2, 9),
                                                type: "success",
                                                title: "Tạo batch mới",
                                                message: `Đã tạo batch mới cho ${ordersAtLocation.length} đơn tại vị trí ${selectedLocation.id}`,
                                                time: new Date().toLocaleTimeString("vi-VN"),
                                            },
                                            ...alerts
                                        ]);

                                        // Cuộn đến phần batch picking
                                        document.getElementById('batch-picking-section')?.scrollIntoView({
                                            behavior: 'smooth'
                                        });
                                    }}
                                >
                                    Tạo batch
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default handleLocationClick;

