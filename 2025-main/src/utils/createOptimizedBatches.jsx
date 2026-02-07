// Thêm các constants cho nguyên tắc 80/20
const PARETO_PRINCIPLES = {
    P1_FIRST: {
        id: 'p1_first',
        name: 'Xử lý đơn P1 trước 100%',
        description: 'Ưu tiên cao nhất cho đơn P1 để đảm bảo SLA'
    },
    SINGLE_PRODUCT: {
        id: 'single_product',
        name: 'Xử lý đơn 1 sản phẩm (nhanh chóng hoàn thành)',
        description: 'Đơn 1 sản phẩm được xử lý nhanh hơn, giúp giảm backlog'
    },
    SAME_PRODUCTS: {
        id: 'same_products',
        name: 'Gom nhóm đơn cùng loại sản phẩm (giảm di chuyển)',
        description: 'Cùng loại sản phẩm được gom nhóm để giảm thời gian di chuyển'
    },
    NEARBY_LOCATIONS: {
        id: 'nearby_locations',
        name: 'Nhóm đơn gần vị trí nhau (tối ưu lộ trình)',
        description: 'Các vị trí gần nhau được gom nhóm để tối ưu lộ trình lấy hàng'
    },
    MULTI_PRODUCTS: {
        id: 'multi_products',
        name: 'Xử lý đơn nhiều loại sản phẩm sau cùng',
        description: 'Đơn nhiều loại sản phẩm được xử lý sau để không làm chậm các đơn khác'
    }
};

// Function tạo batch tự động theo nguyên tắc 80/20
const createOptimizedBatches = () => {
    // Reset batches hiện tại
    setPickingBatches([]);

    // Lấy các đơn hàng chưa hoàn thành
    const pendingOrders = orders.filter(order =>
        order.status === "pending" || order.status === "processing"
    );

    if (pendingOrders.length === 0) {
        // Thông báo không có đơn hàng        setAlerts([
            {
                id: Math.random().toString(36).substr(2, 9),
                type: "info",
                title: "Không có đơn hàng",
                message: "Không có đơn hàng nào cần xử lý",
                time: new Date().toLocaleTimeString("vi-VN") || '--:--',
            },
            ...alerts
        ]);
        return;
    }

    // 1. Nguyên tắc 1: Xử lý đơn P1 trước
    const p1Orders = pendingOrders.filter(order => order.priority === "P1");

    // 2. Nguyên tắc 2: Xử lý đơn 1 sản phẩm trước
    const singleProductOrders = pendingOrders.filter(order =>
        order.items && order.items.length === 1 && order.priority !== "P1"
    );

    // 3. Nguyên tắc 3: Gom nhóm đơn cùng loại sản phẩm
    // Tìm các sản phẩm phổ biến
    const productCounts = {};
    pendingOrders
        .filter(order => !p1Orders.includes(order) && !singleProductOrders.includes(order))
        .forEach(order => {
            order.items?.forEach(item => {
                productCounts[item.sku] = (productCounts[item.sku] || 0) + 1;
            });
        });

    // Lấy top 3 sản phẩm phổ biến nhất (nguyên tắc 80/20: 20% sản phẩm chiếm 80% đơn hàng)
    const topProducts = Object.entries(productCounts)
        .sort(([_, countA], [__, countB]) => countB - countA)
        .slice(0, 3)
        .map(([sku]) => sku);

    const sameProductOrders = pendingOrders.filter(order =>
        !p1Orders.includes(order) &&
        !singleProductOrders.includes(order) &&
        order.items?.some(item => topProducts.includes(item.sku))
    );

    // 4. Nguyên tắc 4: Nhóm đơn gần vị trí nhau
    // Tìm các vị trí phổ biến
    const locationCounts = {};
    pendingOrders
        .filter(order =>
            !p1Orders.includes(order) &&
            !singleProductOrders.includes(order) &&
            !sameProductOrders.includes(order)
        )
        .forEach(order => {
            order.items?.forEach(item => {
                locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
            });
        });

    // Lấy top 3 vị trí phổ biến nhất
    const topLocations = Object.entries(locationCounts)
        .sort(([_, countA], [__, countB]) => countB - countA)
        .slice(0, 3)
        .map(([location]) => location);

    const nearbyLocationOrders = pendingOrders.filter(order =>
        !p1Orders.includes(order) &&
        !singleProductOrders.includes(order) &&
        !sameProductOrders.includes(order) &&
        order.items?.some(item => topLocations.includes(item.location))
    );

    // 5. Nguyên tắc 5: Các đơn còn lại (nhiều loại sản phẩm)
    const remainingOrders = pendingOrders.filter(order =>
        !p1Orders.includes(order) &&
        !singleProductOrders.includes(order) &&
        !sameProductOrders.includes(order) &&
        !nearbyLocationOrders.includes(order)
    );

    // Tạo các batch theo nguyên tắc 80/20
    const batches = [];

    // Batch 1: Đơn P1
    if (p1Orders.length > 0) {
        // Tìm các vị trí của đơn P1
        const p1Locations = [...new Set(p1Orders.flatMap(order =>
            order.items?.map(item => item.location) || []
        ))];

        batches.push({
            id: `batch-p1-${new Date().getTime()}`,
            name: "Batch #1: Đơn P1 - Gấp",
            orders: p1Orders,
            locations: p1Locations,
            status: "pending",
            createdAt: new Date().toISOString(),
            principle: PARETO_PRINCIPLES.P1_FIRST.id,
            principleLabel: PARETO_PRINCIPLES.P1_FIRST.name
        });
    }

    // Batch 2: Đơn 1 sản phẩm
    if (singleProductOrders.length > 0) {
        // Tìm các vị trí của đơn 1 sản phẩm
        const singleProductLocations = [...new Set(singleProductOrders.flatMap(order =>
            order.items?.map(item => item.location) || []
        ))];

        batches.push({
            id: `batch-single-${new Date().getTime()}`,
            name: "Batch #2: Đơn 1 sản phẩm",
            orders: singleProductOrders,
            locations: singleProductLocations,
            status: "pending",
            createdAt: new Date().toISOString(),
            principle: PARETO_PRINCIPLES.SINGLE_PRODUCT.id,
            principleLabel: PARETO_PRINCIPLES.SINGLE_PRODUCT.name
        });
    }

    // Batch 3: Đơn cùng loại sản phẩm
    if (sameProductOrders.length > 0) {
        // Phân nhóm theo sản phẩm
        for (const productSku of topProducts) {
            const ordersWithProduct = sameProductOrders.filter(order =>
                order.items?.some(item => item.sku === productSku)
            );

            if (ordersWithProduct.length > 0) {
                const product = ordersWithProduct[0].items?.find(item => item.sku === productSku);
                const productName = product ? product.name : productSku;

                // Tìm các vị trí của đơn cùng loại sản phẩm
                const locations = [...new Set(ordersWithProduct.flatMap(order =>
                    order.items?.map(item => item.location) || []
                ))];

                batches.push({
                    id: `batch-same-${productSku}-${new Date().getTime()}`,
                    name: `Batch #3: Đơn ${productName}`,
                    orders: ordersWithProduct,
                    locations,
                    status: "pending",
                    createdAt: new Date().toISOString(),
                    principle: PARETO_PRINCIPLES.SAME_PRODUCTS.id,
                    principleLabel: PARETO_PRINCIPLES.SAME_PRODUCTS.name
                });
            }
        }
    }

    // Batch 4: Đơn gần vị trí nhau
    if (nearbyLocationOrders.length > 0) {
        // Phân nhóm theo vị trí
        for (const location of topLocations) {
            const ordersAtLocation = nearbyLocationOrders.filter(order =>
                order.items?.some(item => item.location === location)
            );

            if (ordersAtLocation.length > 0) {
                const zone = location.charAt(0);
                const zoneName = zone === 'A' ? 'Vali' : zone === 'B' ? 'Phụ kiện' : 'Đặc biệt';

                batches.push({
                    id: `batch-location-${location}-${new Date().getTime()}`,
                    name: `Batch #4: Khu ${zone} - ${zoneName}`,
                    orders: ordersAtLocation,
                    locations: [location],
                    status: "pending",
                    createdAt: new Date().toISOString(),
                    principle: PARETO_PRINCIPLES.NEARBY_LOCATIONS.id,
                    principleLabel: PARETO_PRINCIPLES.NEARBY_LOCATIONS.name
                });
            }
        }
    }

    // Batch 5: Đơn còn lại
    if (remainingOrders.length > 0) {
        // Tìm các vị trí của đơn còn lại
        const remainingLocations = [...new Set(remainingOrders.flatMap(order =>
            order.items?.map(item => item.location) || []
        ))];

        batches.push({
            id: `batch-remaining-${new Date().getTime()}`,
            name: "Batch #5: Đơn nhiều loại sản phẩm",
            orders: remainingOrders,
            locations: remainingLocations,
            status: "pending",
            createdAt: new Date().toISOString(),
            principle: PARETO_PRINCIPLES.MULTI_PRODUCTS.id,
            principleLabel: PARETO_PRINCIPLES.MULTI_PRODUCTS.name
        });
    }

    // Cập nhật state
    setPickingBatches(batches);    // Thêm vào lịch sử hoạt động
    const newLog = {
        id: activityHistory.length + 1,
        type: "picking",
        action: `Tạo ${batches.length} batch picking theo nguyên tắc 80/20`,
        user: currentUser?.name || "System",
        time: new Date().toLocaleTimeString("vi-VN") || '--:--',
    };
    setActivityHistory([newLog, ...activityHistory]);    // Hiển thị thông báo thành công
    setAlerts([
        {
            id: Math.random().toString(36).substr(2, 9),
            type: "success",
            title: "Tạo batch thành công",
            message: `Đã tạo ${batches.length} batch picking theo nguyên tắc 80/20`,
            time: new Date().toLocaleTimeString("vi-VN") || '--:--',
        },
        ...alerts
    ]);

    return batches;
};


// Function render batch picking với hiệu ứng trực quan
const renderBatchPicking = () => {
    return (
        <div id="batch-picking-section" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Đơn hàng theo lộ trình picking</h3>
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
                        {pickingBatches.length === 0 ? "Tạo batch mới" : "Tối ưu lại batch"}
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
                                    : index === 0 && batch.principle === PARETO_PRINCIPLES.P1_FIRST.id
                                        ? "border-l-4 border-red-600 bg-red-900 bg-opacity-5"
                                        : "border-gray-700"
                                } transition-all duration-300 ${batch.status === "processing" ? "shadow-lg" : ""
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium">{batch.name}</span>
                                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${batch.status === "pending"
                                            ? "bg-gray-700 text-gray-300"
                                            : batch.status === "processing"
                                                ? "bg-blue-900 bg-opacity-30 text-blue-400"
                                                : "bg-green-900 bg-opacity-30 text-green-400"
                                            }`}>
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
                                            {batch.orders.reduce((acc, order) =>
                                                acc + (order.items?.length || 0), 0)} SKU
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
                                        <span className="opacity-75">Đơn:</span> {batch.orders.slice(0, 2).map(o => o.id).join(', ')}
                                        {batch.orders.length > 2 && `, +${batch.orders.length - 2} đơn khác`}
                                    </div>
                                    <div>
                                        <span className="opacity-75">Vị trí:</span> {batch.locations.join(', ')}
                                    </div>
                                </div>
                            </div>

                            {batch.status === "processing" && (
                                <div className="mt-3 bg-blue-900 bg-opacity-20 p-2 rounded">
                                    <div className="flex justify-between items-center text-xs">
                                        <span>Tiến độ: {Math.floor(Math.random() * 50) + 50}%</span>
                                        <span className="text-blue-400">
                                            {new Date(new Date(batch.startTime).getTime() + Math.floor(Math.random() * 10) * 60000).toLocaleTimeString()} - Dự kiến hoàn thành trong {Math.floor(Math.random() * 10) + 5} phút
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
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
                <h4 className="text-sm font-medium mb-2">Nguyên tắc lấy hàng theo 80/20</h4>
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
                                                name: `Batch: ${optimization.type === 'product' ? 'Sản phẩm' : 'Vị trí'} ${optimization.location}`,
                                                orders: optimization.orders,
                                                locations: [optimization.location],
                                                status: "pending",
                                                createdAt: new Date().toISOString(),
                                                principle: optimization.type === 'product'
                                                    ? PARETO_PRINCIPLES.SAME_PRODUCTS.id
                                                    : PARETO_PRINCIPLES.NEARBY_LOCATIONS.id,
                                                principleLabel: optimization.type === 'product'
                                                    ? PARETO_PRINCIPLES.SAME_PRODUCTS.name
                                                    : PARETO_PRINCIPLES.NEARBY_LOCATIONS.name
                                            };

                                            setPickingBatches([newBatch, ...pickingBatches]);

                                            // Thông báo
                                            setAlerts([
                                                {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    type: "success",
                                                    title: "Tạo batch mới",
                                                    message: `Đã tạo batch mới cho ${optimization.orders.length} đơn theo gợi ý`,
                                                    time: new Date().toLocaleTimeString("vi-VN"),
                                                },
                                                ...alerts
                                            ]);

                                            // Thêm vào lịch sử hoạt động
                                            const newLog = {
                                                id: activityHistory.length + 1,
                                                type: "picking",
                                                action: `Tạo batch từ gợi ý tối ưu: ${optimization.message}`,
                                                user: currentUser?.name || "System",
                                                time: new Date().toLocaleTimeString("vi-VN"),
                                            };
                                            setActivityHistory([newLog, ...activityHistory]);

                                            // Cuộn đến phần batch picking
                                            document.getElementById('batch-picking-section')?.scrollIntoView({
                                                behavior: 'smooth'
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

export default createOptimizedBatches;

