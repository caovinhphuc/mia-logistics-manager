import React, { useState, useCallback } from 'react';
import Card, { CardHeader } from '../components/ui/Card.tsx';
import { Upload, FileSpreadsheet, FileJson, CheckCircle, AlertCircle, BarChart3, TrendingUp, Package, Truck } from 'lucide-react';
import Papa from 'papaparse';

// Simple Card sub-components to match the expected API
const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const WarehouseDataUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [parsedData, setParsedData] = useState({});
  const [analysisResults, setAnalysisResults] = useState({});
  const [activeTab, setActiveTab] = useState('upload');

  // Cấu hình file types theo thứ tự xử lý
  const fileConfigs = [
    {
      key: 'online',
      name: 'Đơn hàng Online',
      description: 'Đơn hàng ecom (Shopee, TikTok, Lazada, Facebook) - chưa tính hủy đơn và thu hồi',
      type: '.json',
      icon: <FileJson className="w-5 h-5" />,
      color: 'bg-cyan-500',
      priority: 1,
      status: 'processing'
    },
    {
      key: 'chuyenkho',
      name: 'Chuyển kho JSON',
      description: 'Luân chuyển KTT ↔ Siêu thị (xuất/rút hàng + COD)',
      type: '.json',
      icon: <FileJson className="w-5 h-5" />,
      color: 'bg-indigo-500',
      priority: 2,
      status: 'waiting'
    },
    {
      key: 'exim',
      name: 'Container Nhập (Exim)',
      description: 'Số lượng container nhập từ Trung Quốc qua Eximvina',
      type: '.xlsx',
      icon: <Truck className="w-5 h-5" />,
      color: 'bg-green-500',
      priority: 3,
      status: 'waiting'
    },
    {
      key: 'tonkhoban',
      name: 'Tồn kho Vali (TonKhoBan)',
      description: 'File tham chiếu phân loại sản phẩm: Vali vs Balo/PK/Quà tặng',
      type: '.xlsx',
      icon: <Package className="w-5 h-5" />,
      color: 'bg-blue-500',
      priority: 4,
      status: 'waiting'
    }
  ];

  // Parse Excel file using FileReader
  const parseExcelFile = useCallback(async (file, key) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            // Giả lập parse Excel - trong thực tế sẽ dùng SheetJS
            const mockData = {
              sheets: ['Sheet1'],
              data: [
                { column1: 'Sample', column2: 'Data', column3: file.name },
                { column1: 'Row 2', column2: 'Value 2', column3: 'Test' }
              ]
            };
            resolve(mockData);
          } catch (parseError) {
            reject(parseError);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Error parsing Excel:', error);
      return null;
    }
  }, []);

  // Parse JSON file using FileReader
  const parseJsonFile = useCallback(async (file, key) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);

            // Xử lý cụ thể cho đơn hàng online
            if (key === 'online') {
              const result = parseOnlineOrders(jsonData);
              resolve(result);
            } else {
              resolve(jsonData);
            }
          } catch (parseError) {
            reject(parseError);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file, 'utf-8');
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }, []);

  // Xử lý dữ liệu đơn hàng online
  const parseOnlineOrders = (jsonData) => {
    // Xử lý structure API response thực tế
    const orders = jsonData.data ? jsonData.data : (Array.isArray(jsonData) ? jsonData : [jsonData]);

    const analysis = {
      totalOrders: orders.length,
      totalSKU: 0,
      channels: {},
      transporters: {},
      cities: {},
      ordersByDate: {},
      productTypes: {},
      skuDetails: [],
      codOrders: 0,
      totalCOD: 0,
      totalAmount: 0
    };

    orders.forEach(order => {
      // Parse detail field để tính SKU
      const detail = order.detail || '';
      const skuCount = parseDetailToSKU(detail);
      analysis.totalSKU += skuCount;

      // Phân loại theo customer (kênh bán)
      const channel = classifyChannel(order.customer);
      analysis.channels[channel] = (analysis.channels[channel] || 0) + 1;

      // Phân loại theo đơn vị vận chuyển
      const transporter = order.transporter || 'Unknown';
      analysis.transporters[transporter] = (analysis.transporters[transporter] || 0) + 1;

      // Phân loại theo thành phố
      const city = order.city || 'Unknown';
      analysis.cities[city] = (analysis.cities[city] || 0) + 1;

      // Phân loại theo ngày
      const orderDate = order.date_order ? order.date_order.split(' ')[0] : '';
      if (orderDate) {
        analysis.ordersByDate[orderDate] = (analysis.ordersByDate[orderDate] || 0) + skuCount;
      }

      // Phân tích sản phẩm từ detail
      const productAnalysis = analyzeProductFromDetail(detail);
      Object.entries(productAnalysis).forEach(([type, count]) => {
        analysis.productTypes[type] = (analysis.productTypes[type] || 0) + count;
      });

      // Tính toán COD và doanh thu
      const codAmount = parseFloat(order.cod_total) || 0;
      const totalAmount = parseFloat(order.amount_total) || 0;

      if (codAmount > 0) {
        analysis.codOrders++;
        analysis.totalCOD += codAmount;
      }
      analysis.totalAmount += totalAmount;

      // Chi tiết SKU
      analysis.skuDetails.push({
        orderId: order.id,
        orderName: order.name,
        channel: channel,
        skuCount: skuCount,
        products: detail,
        city: city,
        transporter: transporter,
        codAmount: codAmount,
        totalAmount: totalAmount,
        date: orderDate
      });
    });

    return analysis;
  };

  // Parse detail field để đếm SKU
  const parseDetailToSKU = (detail) => {
    if (!detail) return 0;

    // Tìm pattern số trong ngoặc đơn (1), (2), etc.
    const matches = detail.match(/\((\d+)\)/g);
    if (!matches) return 1; // Nếu không có số trong ngoặc, assume 1 SKU

    return matches.reduce((total, match) => {
      const num = parseInt(match.replace(/[()]/g, ''));
      // Bỏ qua các item không phải sản phẩm (như phí vận chuyển)
      if (detail.includes('Thu phí') || detail.includes('phí vận chuyển')) {
        return total; // Không tính phí vận chuyển
      }
      return total + num;
    }, 0);
  };

  // Phân loại kênh bán
  const classifyChannel = (customer) => {
    if (!customer) return 'Unknown';

    const customerLower = customer.toLowerCase();
    if (customerLower.includes('shopee')) return 'Shopee';
    if (customerLower.includes('tiktok') || customerLower.includes('tik tok')) return 'TikTok';
    if (customerLower.includes('lazada')) return 'Lazada';
    if (customerLower.includes('tiki')) return 'Tiki';
    if (customerLower.includes('facebook') || customerLower.includes('fb')) return 'Facebook';

    // Nếu là tên người -> có thể là Facebook hoặc kênh trực tiếp
    if (customer.includes(' ')) return 'Facebook/Trực tiếp';

    return 'Khác';
  };

  // Phân tích loại sản phẩm từ detail
  const analyzeProductFromDetail = (detail) => {
    const result = {};
    if (!detail) return result;

    const detailLower = detail.toLowerCase();

    // Tách từng sản phẩm (ngăn cách bởi dấu phẩy)
    const items = detail.split(',');

    items.forEach(item => {
      if (item.includes('phí vận chuyển') || item.includes('Thu phí')) {
        return; // Bỏ qua phí vận chuyển
      }

      const itemLower = item.toLowerCase();
      let productType = 'Unknown';

      // Phân loại dựa trên tên sản phẩm
      if (itemLower.includes('vali') ||
          itemLower.includes('cover') ||
          itemLower.includes('larita') ||
          itemLower.includes('mia') ||
          /\d+["']\s*(l|m|s)\s/.test(itemLower)) { // Pattern size vali 20" L, 26" L
        productType = 'Vali';
      } else if (itemLower.includes('balo') || itemLower.includes('backpack')) {
        productType = 'Balo';
      } else if (itemLower.includes('túi') || itemLower.includes('bag')) {
        productType = 'Túi xách';
      } else if (itemLower.includes('phụ kiện') || itemLower.includes('accessory')) {
        productType = 'Phụ kiện';
      } else if (itemLower.includes('quà') || itemLower.includes('gift')) {
        productType = 'Quà tặng';
      } else {
        productType = 'Vali'; // Default assumption cho hàng lý
      }

      // Đếm số lượng
      const qtyMatch = item.match(/\((\d+)\)/);
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;

      result[productType] = (result[productType] || 0) + qty;
    });    return result;
  };

  // Analyze uploaded data
  const analyzeData = useCallback((key, data) => {
    const analysis = {};

    switch (key) {
      case 'online':
        // Dữ liệu đã được xử lý trong parseOnlineOrders
        return data;

      case 'chuyenkho':
        // Phân tích chuyển kho: KTT ↔ Siêu thị
        const transfers = Array.isArray(data) ? data : [];
        analysis.totalTransfers = transfers.length;
        analysis.kttExports = 0; // KTT xuất hàng cho siêu thị
        analysis.kttImports = 0; // KTT rút hàng (bao gồm COD)
        analysis.retailTransfers = 0; // Siêu thị luân chuyển
        analysis.totalSKU = 0;
        analysis.transferDetails = [];

        transfers.forEach(transfer => {
          const source = transfer.source || '';
          const destination = transfer.destination || '';
          const type = transfer.type || '';
          const quantity = transfer.quantity || 0;

          analysis.totalSKU += quantity;

          if (type === 'xuất_siêu_thị' || source.includes('KTT')) {
            analysis.kttExports += quantity;
          } else if (type === 'rút_hàng' || destination.includes('KTT')) {
            analysis.kttImports += quantity;
          } else if (type === 'luân_chuyển_siêu_thị') {
            analysis.retailTransfers += quantity;
          }

          analysis.transferDetails.push({
            id: transfer.id,
            date: transfer.date,
            type: type,
            route: `${source} → ${destination}`,
            products: transfer.products,
            quantity: quantity,
            note: transfer.note
          });
        });
        break;

      case 'exim':
        // Phân tích container nhập
        const containers = data.containers || [];
        analysis.totalContainers = containers.length;
        analysis.totalSKU = containers.reduce((sum, cont) => sum + (cont.total_sku || 0), 0);
        analysis.avgSKUPerContainer = analysis.totalContainers > 0 ? Math.round(analysis.totalSKU / analysis.totalContainers) : 0;
        analysis.totalProcessingTime = containers.reduce((sum, cont) => sum + (cont.processing_time || 0), 0);
        analysis.processingCost = analysis.totalContainers * 2400000; // VNĐ per container
        analysis.totalVali = containers.reduce((sum, cont) => sum + (cont.vali_count || 0), 0);
        analysis.totalBalo = containers.reduce((sum, cont) => sum + (cont.balo_count || 0), 0);
        analysis.totalAccessory = containers.reduce((sum, cont) => sum + (cont.accessory_count || 0), 0);
        analysis.valiPercentage = analysis.totalSKU > 0 ? Math.round((analysis.totalVali / analysis.totalSKU) * 100) : 0;

        analysis.containerDetails = containers.map(cont => ({
          id: cont.id,
          date: cont.date,
          route: `${cont.from} → ${cont.to}`,
          totalSKU: cont.total_sku,
          composition: `Vali: ${cont.vali_count}, Balo: ${cont.balo_count}, PK: ${cont.accessory_count}`,
          processingTime: cont.processing_time,
          staff: `${cont.staff.nv} NV + ${cont.staff.ctv} CTV`
        }));
        break;

      case 'tonkhoban':
        // Phân tích tồn kho
        const categories = data.categories || [];
        analysis.totalProducts = data.total || 0;
        analysis.valiProducts = 0;
        analysis.baloProducts = 0;
        analysis.accessoryProducts = 0;
        analysis.bagProducts = 0;

        categories.forEach(cat => {
          switch(cat.type) {
            case 'Vali':
              analysis.valiProducts = cat.count;
              analysis.valiPercentage = cat.percentage;
              break;
            case 'Balo':
              analysis.baloProducts = cat.count;
              break;
            case 'Túi xách':
              analysis.bagProducts = cat.count;
              break;
            case 'Phụ kiện':
              analysis.accessoryProducts = cat.count;
              break;
          }
        });

        analysis.categoryBreakdown = categories.map(cat => ({
          type: cat.type,
          count: cat.count,
          percentage: cat.percentage
        }));
        break;

      default:
        // Fallback cho các file khác
        analysis.message = "Chưa có dữ liệu để phân tích";
        break;
    }

    return analysis;
  }, []);

  // Demo dữ liệu cho tất cả các file
  const demoAllData = useCallback(() => {
    // 1. Demo Online Orders
    const onlineData = {
      "error": false,
      "message": "OK",
      "data": [
        {
          "id": 464532,
          "name": "SO08052025:0875219",
          "transporter": "S - SPX Instant",
          "customer": "Shopee",
          "phone": "18002000",
          "amount_total": "139000",
          "cod_total": "0",
          "date_order": "2025-05-08 08:08:03",
          "city": "Hồ Chí Minh",
          "detail": "Mia Cover City 2_26\" L Black(1)"
        },
        {
          "id": 464891,
          "name": "SO08052025:0875578",
          "transporter": "Ahamove",
          "customer": "Nguyễn Thị Thu Hồng",
          "amount_total": "849000",
          "cod_total": "849000",
          "date_order": "2025-05-08 17:37:42",
          "city": "Hồ Chí Minh",
          "detail": "Larita TOSA ZH1601_20 S Light Blue(1), Thu phí vận chuyển(1)"
        },
        {
          "id": 464892,
          "name": "SO08052025:0875579",
          "transporter": "Giao hàng nhanh",
          "customer": "TikTok Shop",
          "amount_total": "1299000",
          "cod_total": "1299000",
          "date_order": "2025-05-08 19:15:20",
          "city": "Hà Nội",
          "detail": "Vali Samsonite Pro DLX5_28\" XL Silver(1), Balo Laptop Business(2)"
        }
      ]
    };

    // 2. Demo Chuyển kho JSON
    const chuyenkhoData = [
      {
        "id": "CK001",
        "date": "2025-05-08",
        "source": "KTT - Kho Tân Thuận",
        "destination": "Siêu thị Bitexco",
        "products": "Vali Samsonite 24\" Blue(5), Balo Laptop(3)",
        "quantity": 8,
        "type": "xuất_siêu_thị",
        "note": "Bổ sung hàng cho siêu thị"
      },
      {
        "id": "CK002",
        "date": "2025-05-08",
        "source": "Siêu thị Landmark",
        "destination": "KTT - Kho Tân Thuận",
        "products": "Vali cũ model cũ(2), Túi xách lỗi(1)",
        "quantity": 3,
        "type": "rút_hàng",
        "note": "COD - Thu hồi hàng lỗi"
      },
      {
        "id": "CK003",
        "date": "2025-05-08",
        "source": "Siêu thị Vinhomes",
        "destination": "Siêu thị Estella",
        "products": "Vali du lịch 20\"(4)",
        "quantity": 4,
        "type": "luân_chuyển_siêu_thị",
        "note": "Cân bằng tồn kho"
      }
    ];

    // 3. Demo Container data
    const eximData = {
      containers: [
        {
          "id": "CONT001",
          "date": "2025-05-07",
          "from": "Guangzhou, China",
          "to": "Cảng Cát Lái, HCM",
          "container_type": "40 feet",
          "total_sku": 1650,
          "vali_count": 1485,
          "balo_count": 120,
          "accessory_count": 45,
          "processing_time": 8,
          "staff": { "nv": 2, "ctv": 6 }
        },
        {
          "id": "CONT002",
          "date": "2025-05-05",
          "from": "Guangzhou, China",
          "to": "Cảng Cát Lái, HCM",
          "container_type": "40 feet",
          "total_sku": 1580,
          "vali_count": 1422,
          "balo_count": 110,
          "accessory_count": 48,
          "processing_time": 8,
          "staff": { "nv": 2, "ctv": 6 }
        }
      ]
    };

    // 4. Demo Tồn kho data
    const tonkhoData = {
      categories: [
        { type: "Vali", count: 850, percentage: 92 },
        { type: "Balo", count: 45, percentage: 5 },
        { type: "Túi xách", count: 20, percentage: 2 },
        { type: "Phụ kiện", count: 10, percentage: 1 }
      ],
      total: 925
    };

    // Set all upload statuses
    setUploadedFiles({
      online: { file: { name: 'Demo_invoiceJSON.json' }, status: 'success', timestamp: new Date(), recordCount: 3 },
      chuyenkho: { file: { name: 'Demo_chuyenkho.json' }, status: 'success', timestamp: new Date(), recordCount: 3 },
      exim: { file: { name: 'Demo_container.xlsx' }, status: 'success', timestamp: new Date(), recordCount: 2 },
      tonkhoban: { file: { name: 'Demo_tonkho.xlsx' }, status: 'success', timestamp: new Date(), recordCount: 4 }
    });

    // Parse and analyze all data
    const onlineResult = parseOnlineOrders(onlineData);
    const chuyenkhoResult = analyzeData('chuyenkho', chuyenkhoData);
    const eximResult = analyzeData('exim', eximData);
    const tonkhoResult = analyzeData('tonkhoban', tonkhoData);

    setParsedData({
      online: onlineResult,
      chuyenkho: chuyenkhoData,
      exim: eximData,
      tonkhoban: tonkhoData
    });

    setAnalysisResults({
      online: onlineResult,
      chuyenkho: chuyenkhoResult,
      exim: eximResult,
      tonkhoban: tonkhoResult
    });

    // Switch to analysis tab
    setActiveTab('analysis');
  }, [parseOnlineOrders, analyzeData]);

  // Demo chỉ online orders (giữ lại cho compatibility)
  const demoOnlineOrders = useCallback(() => {
    demoAllData();
  }, [demoAllData]);
  const handleFileUpload = useCallback(async (event, config) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFiles(prev => ({
      ...prev,
      [config.key]: { file, status: 'parsing', timestamp: new Date() }
    }));

    try {
      let parsedResult;
      if (config.type === '.xlsx') {
        parsedResult = await parseExcelFile(file, config.key);
      } else if (config.type === '.json') {
        parsedResult = await parseJsonFile(file, config.key);
      }

      if (parsedResult) {
        setParsedData(prev => ({
          ...prev,
          [config.key]: parsedResult
        }));

        setUploadedFiles(prev => ({
          ...prev,
          [config.key]: {
            ...prev[config.key],
            status: 'success',
            recordCount: Array.isArray(parsedResult.data) ? parsedResult.data.length : Object.keys(parsedResult).length
          }
        }));

        // Trigger analysis if this is a priority file
        if (config.priority <= 3) {
          analyzeData(config.key, parsedResult);
        }
      }
    } catch (error) {
      setUploadedFiles(prev => ({
        ...prev,
        [config.key]: { ...prev[config.key], status: 'error', error: error.message }
      }));
    }  }, [parseExcelFile, parseJsonFile]);

  // Calculate overall productivity metrics
  const calculateProductivityMetrics = () => {
    const online = analysisResults.online || {};
    const chuyenkho = analysisResults.chuyenkho || {};
    const exim = analysisResults.exim || {};
    const tonkho = analysisResults.tonkhoban || {};

    return {
      // Tổng SKU xử lý
      totalSKUProcessed: (online.totalSKU || 0) + (chuyenkho.totalSKU || 0) + (exim.totalSKU || 0),

      // Hiệu suất xuất hàng online
      onlineOrderProductivity: online.totalOrders > 0 ? Math.round((online.totalSKU / online.totalOrders) * 10) / 10 : 0, // SKU/đơn

      // Hiệu suất chuyển kho
      transferEfficiency: chuyenkho.totalTransfers > 0 ? Math.round((chuyenkho.totalSKU / chuyenkho.totalTransfers) * 10) / 10 : 0, // SKU/lượt chuyển

      // Hiệu suất container
      containerProductivity: exim.totalContainers > 0 ? Math.round(exim.totalSKU / exim.totalContainers) : 0, // SKU/container

      // Tỷ lệ Vali dominant
      valiDominance: tonkho.valiPercentage || 0, // %

      // Chi phí ước tính
      estimatedCost: (exim.processingCost || 0) + ((online.totalSKU || 0) * 5000), // VNĐ

      // Nhân sự cần thiết
      staffNeeded: Math.ceil(((online.totalSKU || 0) / 100) + ((chuyenkho.totalSKU || 0) / 150) + ((exim.totalSKU || 0) / 200)), // người/ngày

      // Thời gian xử lý
      processingTime: Math.ceil(((online.totalSKU || 0) / 100) + ((chuyenkho.totalSKU || 0) / 150) + (exim.totalProcessingTime || 0)) // giờ
    };
  };

  const productivityMetrics = calculateProductivityMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-blue-600" />
            Module Upload & Parse Dữ liệu Kho vận
            <span className="text-sm text-gray-500">03/06/2025</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upload Files
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'analysis'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Phân tích Dữ liệu
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'summary'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tổng quan Năng suất
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Progress Steps */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {fileConfigs.slice(0, 4).map((config, index) => (
                    <div key={config.key} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        uploadedFiles[config.key]?.status === 'success'
                          ? 'bg-green-500'
                          : config.priority === 1
                          ? 'bg-cyan-500'
                          : 'bg-gray-300'
                      }`}>
                        {config.priority}
                      </div>
                      <div className="ml-3 text-sm">
                        <p className="font-medium">{config.name}</p>
                        <p className="text-gray-500">
                          {uploadedFiles[config.key]?.status === 'success' ? '✅ Hoàn thành' :
                           config.priority === 1 ? '🔄 Đang xử lý' : '⏳ Chờ xử lý'}
                        </p>
                      </div>
                      {index < 3 && <div className="mx-4 w-8 h-0.5 bg-gray-300"></div>}
                    </div>
                  ))}
                </div>

                {/* Global Demo Button */}
                <button
                  onClick={() => demoAllData()}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-colors shadow-md"
                >
                  🚀 Demo Tất cả Dữ liệu
                </button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fileConfigs.map((config) => {
              const fileStatus = uploadedFiles[config.key];
              const isCurrentStep = config.priority === 1 || (config.priority > 1 && Object.keys(uploadedFiles).filter(k => uploadedFiles[k]?.status === 'success').length >= config.priority - 1);

              return (
                <Card key={config.key} className={`hover:shadow-md transition-shadow ${
                  config.priority === 1 ? 'ring-2 ring-cyan-200 bg-cyan-50' :
                  !isCurrentStep ? 'opacity-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${config.color} text-white relative`}>
                        {config.icon}
                        {config.priority === 1 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            !
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{config.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            config.priority === 1 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            Bước {config.priority}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {config.description}
                        </p>

                        <div className="space-y-2">
                          <input
                            type="file"
                            accept={config.type}
                            onChange={(e) => handleFileUpload(e, config)}
                            className="hidden"
                            id={`file-${config.key}`}
                            disabled={!isCurrentStep}
                          />
                          <div className="flex gap-2">
                            <label
                              htmlFor={`file-${config.key}`}
                              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                !isCurrentStep ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                fileStatus?.status === 'success'
                                  ? 'bg-green-100 text-green-700 border border-green-200'
                                  : config.priority === 1
                                  ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border border-cyan-200'
                                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                              }`}
                            >
                              {fileStatus?.status === 'success' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : fileStatus?.status === 'error' ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}

                              {!isCurrentStep ? 'Chờ bước trước' :
                               fileStatus?.status === 'success'
                                ? 'Đã upload'
                                : fileStatus?.status === 'parsing'
                                ? 'Đang xử lý...'
                                : fileStatus?.status === 'error'
                                ? 'Lỗi upload'
                                : config.priority === 1
                                ? `🔥 Upload ${config.type}`
                                : `Upload ${config.type}`
                              }
                            </label>

                            {/* Demo button chỉ cho đơn hàng online */}
                            {config.key === 'online' && !fileStatus && (
                              <button
                                onClick={() => demoAllData()}
                                className="px-3 py-2 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                              >
                                📊 Demo All
                              </button>
                            )}
                          </div>

                          {fileStatus && (
                            <div className="text-xs text-gray-500">
                              {fileStatus.file?.name}
                              {fileStatus.recordCount && ` • ${fileStatus.recordCount} records`}
                              {fileStatus.timestamp && ` • ${fileStatus.timestamp.toLocaleTimeString()}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          {Object.entries(analysisResults).map(([key, analysis]) => {
            const config = fileConfigs.find(c => c.key === key);
            if (!config) return null;

            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded ${config.color} text-white`}>
                      {config.icon}
                    </div>
                    Phân tích: {config.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {key === 'online' && analysis.skuDetails ? (
                    // Hiển thị chi tiết cho đơn hàng online
                    <div className="space-y-6">
                      {/* KPIs chính */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                          <p className="text-sm text-cyan-600 font-medium">Tổng đơn hàng</p>
                          <p className="text-3xl font-bold text-cyan-700">{analysis.totalOrders}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">Tổng SKU xuất</p>
                          <p className="text-3xl font-bold text-blue-700">{analysis.totalSKU}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">SKU/Đơn (TB)</p>
                          <p className="text-3xl font-bold text-green-700">
                            {analysis.totalOrders > 0 ? (analysis.totalSKU / analysis.totalOrders).toFixed(1) : 0}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">Đơn COD</p>
                          <p className="text-3xl font-bold text-purple-700">
                            {analysis.codOrders}/{analysis.totalOrders}
                          </p>
                        </div>
                      </div>

                      {/* Doanh thu */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-600 font-medium">Tổng doanh thu</p>
                          <p className="text-2xl font-bold text-yellow-700">
                            {analysis.totalAmount?.toLocaleString()} VNĐ
                          </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-600 font-medium">Tổng COD</p>
                          <p className="text-2xl font-bold text-orange-700">
                            {analysis.totalCOD?.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>

                      {/* Phân tích chi tiết */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-3 text-blue-700">📱 Kênh bán hàng</h4>
                          <div className="space-y-2">
                            {Object.entries(analysis.channels || {}).map(([channel, count]) => (
                              <div key={channel} className="flex justify-between items-center">
                                <span className="text-sm">{channel}</span>
                                <span className="font-bold text-blue-600">{count} đơn</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-3 text-green-700">📦 Phân loại Sản phẩm</h4>
                          <div className="space-y-2">
                            {Object.entries(analysis.productTypes || {}).map(([type, count]) => (
                              <div key={type} className="flex justify-between items-center">
                                <span className="text-sm">{type}</span>
                                <span className="font-bold text-green-600">{count} SKU</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-3 text-purple-700">🚚 Đơn vị vận chuyển</h4>
                          <div className="space-y-2">
                            {Object.entries(analysis.transporters || {}).map(([transporter, count]) => (
                              <div key={transporter} className="flex justify-between items-center">
                                <span className="text-sm text-xs">{transporter}</span>
                                <span className="font-bold text-purple-600">{count} đơn</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Phân bố địa lý */}
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-indigo-700">🌍 Phân bố Địa lý</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(analysis.cities || {}).map(([city, count]) => (
                            <div key={city} className="text-center">
                              <p className="text-sm text-indigo-600">{city}</p>
                              <p className="font-bold text-indigo-800">{count} đơn</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insights kho vận */}
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-700 mb-2">💡 Insights Kho vận (từ dữ liệu thực tế)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Năng suất xuất hàng:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• {analysis.totalSKU} SKU cần xuất kho</li>
                              <li>• {Math.ceil(analysis.totalSKU / 100)} giờ xử lý (ước tính 100 SKU/giờ)</li>
                              <li>• {Math.ceil(analysis.totalSKU / 800)} người/ngày (8h/người)</li>
                            </ul>
                          </div>
                          <div>
                            <p><strong>Đặc điểm đơn hàng:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Tỷ lệ COD: {analysis.totalOrders > 0 ? Math.round((analysis.codOrders / analysis.totalOrders) * 100) : 0}%</li>
                              <li>• Giá trị TB/đơn: {analysis.totalOrders > 0 ? Math.round(analysis.totalAmount / analysis.totalOrders).toLocaleString() : 0} VNĐ</li>
                              <li>• Chủ yếu {Object.keys(analysis.productTypes || {})[0] || 'Vali'}</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Sample data preview */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3">📋 Dữ liệu mẫu (3 đơn đầu tiên)</h4>
                        <div className="space-y-2 text-xs">
                          {analysis.skuDetails.slice(0, 3).map((order, idx) => (
                            <div key={idx} className="bg-white p-2 rounded border">
                              <div className="grid grid-cols-2 gap-2">
                                <span><strong>Đơn:</strong> {order.orderName}</span>
                                <span><strong>Kênh:</strong> {order.channel}</span>
                                <span><strong>SKU:</strong> {order.skuCount}</span>
                                <span><strong>Sản phẩm:</strong> {order.products.substring(0, 30)}...</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : key === 'chuyenkho' && analysis.transferDetails ? (
                    // Hiển thị chi tiết cho chuyển kho
                    <div className="space-y-6">
                      {/* KPIs chính */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                          <p className="text-sm text-indigo-600 font-medium">Tổng lượt chuyển</p>
                          <p className="text-3xl font-bold text-indigo-700">{analysis.totalTransfers}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">KTT xuất siêu thị</p>
                          <p className="text-3xl font-bold text-green-700">{analysis.kttExports} SKU</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-600 font-medium">KTT rút hàng</p>
                          <p className="text-3xl font-bold text-orange-700">{analysis.kttImports} SKU</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">Luân chuyển ST</p>
                          <p className="text-3xl font-bold text-purple-700">{analysis.retailTransfers} SKU</p>
                        </div>
                      </div>

                      {/* Chi tiết chuyển kho */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-indigo-700">🔄 Chi tiết Chuyển kho</h4>
                        <div className="space-y-3">
                          {analysis.transferDetails.map((transfer, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <strong>Mã:</strong> {transfer.id}<br/>
                                  <strong>Ngày:</strong> {transfer.date}
                                </div>
                                <div>
                                  <strong>Tuyến:</strong> {transfer.route}<br/>
                                  <strong>Loại:</strong> <span className={`px-2 py-1 rounded text-xs ${
                                    transfer.type === 'xuất_siêu_thị' ? 'bg-green-100 text-green-700' :
                                    transfer.type === 'rút_hàng' ? 'bg-orange-100 text-orange-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>{transfer.type.replace('_', ' ')}</span>
                                </div>
                                <div>
                                  <strong>SKU:</strong> {transfer.quantity}<br/>
                                  <strong>Sản phẩm:</strong> {transfer.products.substring(0, 30)}...
                                </div>
                              </div>
                              {transfer.note && (
                                <div className="mt-2 text-xs text-gray-600 italic">
                                  Note: {transfer.note}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-700 mb-2">💡 Insights Chuyển kho</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Hiệu suất chuyển kho:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Tổng {analysis.totalSKU} SKU được chuyển</li>
                              <li>• Tỷ lệ xuất/nhập: {analysis.kttExports}/{analysis.kttImports}</li>
                              <li>• Luân chuyển nội bộ: {analysis.retailTransfers} SKU</li>
                            </ul>
                          </div>
                          <div>
                            <p><strong>Đề xuất tối ưu:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Gộp chuyến để giảm chi phí</li>
                              <li>• Lên lịch chuyển kho theo chu kỳ</li>
                              <li>• Tối ưu tuyến đường vận chuyển</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : key === 'exim' && analysis.containerDetails ? (
                    // Hiển thị chi tiết cho container
                    <div className="space-y-6">
                      {/* KPIs chính */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">Tổng Container</p>
                          <p className="text-3xl font-bold text-green-700">{analysis.totalContainers}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">Tổng SKU nhập</p>
                          <p className="text-3xl font-bold text-blue-700">{analysis.totalSKU?.toLocaleString()}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-600 font-medium">SKU/Container</p>
                          <p className="text-3xl font-bold text-yellow-700">{analysis.avgSKUPerContainer}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">Tỷ lệ Vali</p>
                          <p className="text-3xl font-bold text-purple-700">{analysis.valiPercentage}%</p>
                        </div>
                      </div>

                      {/* Phân tích sản phẩm */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-bold text-blue-700">Vali</h4>
                          <p className="text-2xl font-bold">{analysis.totalVali?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{analysis.valiPercentage}% tổng SKU</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold text-green-700">Balo</h4>
                          <p className="text-2xl font-bold">{analysis.totalBalo?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{Math.round((analysis.totalBalo/analysis.totalSKU)*100)}% tổng SKU</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-bold text-orange-700">Phụ kiện</h4>
                          <p className="text-2xl font-bold">{analysis.totalAccessory?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{Math.round((analysis.totalAccessory/analysis.totalSKU)*100)}% tổng SKU</p>
                        </div>
                      </div>

                      {/* Chi tiết container */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-green-700">📦 Chi tiết Container</h4>
                        <div className="space-y-3">
                          {analysis.containerDetails.map((container, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <strong>Mã:</strong> {container.id}<br/>
                                  <strong>Ngày:</strong> {container.date}
                                </div>
                                <div>
                                  <strong>Tuyến:</strong> {container.route}<br/>
                                  <strong>SKU:</strong> {container.totalSKU?.toLocaleString()}
                                </div>
                                <div>
                                  <strong>Nhân sự:</strong> {container.staff}<br/>
                                  <strong>Thời gian:</strong> {container.processingTime}h
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-blue-600">
                                <strong>Thành phần:</strong> {container.composition}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-700 mb-2">💡 Insights Container</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Hiệu suất xử lý:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• {analysis.totalProcessingTime}h tổng thời gian xử lý</li>
                              <li>• {Math.round(analysis.totalSKU/analysis.totalProcessingTime)} SKU/giờ trung bình</li>
                              <li>• Chi phí: {analysis.processingCost?.toLocaleString()} VNĐ</li>
                            </ul>
                          </div>
                          <div>
                            <p><strong>Đặc điểm hàng hóa:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Chủ yếu Vali ({analysis.valiPercentage}%)</li>
                              <li>• Cần tối ưu layout kho cho Vali</li>
                              <li>• Chuẩn hóa quy trình xử lý</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : key === 'tonkhoban' && analysis.categoryBreakdown ? (
                    // Hiển thị chi tiết cho tồn kho
                    <div className="space-y-6">
                      {/* KPIs chính */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">Tổng sản phẩm</p>
                          <p className="text-3xl font-bold text-blue-700">{analysis.totalProducts}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">Vali</p>
                          <p className="text-3xl font-bold text-green-700">{analysis.valiProducts}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-600 font-medium">Balo</p>
                          <p className="text-3xl font-bold text-orange-700">{analysis.baloProducts}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">Tỷ lệ Vali</p>
                          <p className="text-3xl font-bold text-purple-700">{analysis.valiPercentage}%</p>
                        </div>
                      </div>

                      {/* Phân loại chi tiết */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-blue-700">📊 Phân loại Sản phẩm</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysis.categoryBreakdown.map((category, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-medium">{category.type}</h5>
                                  <p className="text-2xl font-bold text-blue-600">{category.count}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-600">{category.percentage}%</p>
                                  <p className="text-xs text-gray-500">của tổng</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-700 mb-2">💡 Insights Tồn kho</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Đặc điểm tồn kho:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Vali chiếm ưu thế ({analysis.valiPercentage}%)</li>
                              <li>• Cần tối ưu không gian cho Vali</li>
                              <li>• Đa dạng hóa các loại khác</li>
                            </ul>
                          </div>
                          <div>
                            <p><strong>Đề xuất quản lý:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Layout kho ưu tiên Vali</li>
                              <li>• Phân khu theo loại sản phẩm</li>
                              <li>• FIFO cho hàng theo mùa</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Hiển thị chi tiết cho đơn hàng online
                    <div className="space-y-6">
                      {/* KPIs chính */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                          <p className="text-sm text-cyan-600 font-medium">Tổng đơn hàng</p>
                          <p className="text-3xl font-bold text-cyan-700">{analysis.totalOrders}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">Tổng SKU xuất</p>
                          <p className="text-3xl font-bold text-blue-700">{analysis.totalSKU}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">SKU/Đơn (TB)</p>
                          <p className="text-3xl font-bold text-green-700">
                            {analysis.totalOrders > 0 ? (analysis.totalSKU / analysis.totalOrders).toFixed(1) : 0}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">Đơn COD</p>
                          <p className="text-3xl font-bold text-purple-700">
                            {analysis.codOrders}/{analysis.totalOrders}
                          </p>
                        </div>
                      </div>

                      {/* Doanh thu */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-600 font-medium">Tổng doanh thu</p>
                          <p className="text-2xl font-bold text-yellow-700">
                            {analysis.totalAmount?.toLocaleString()} VNĐ
                          </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-600 font-medium">Tổng COD</p>
                          <p className="text-2xl font-bold text-orange-700">
                            {analysis.totalCOD?.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>

                      {/* Phân tích chi tiết */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-3 text-blue-700">📱 Kênh bán hàng</h4>
                          <div className="space-y-2">
                            {Object.entries(analysis.channels || {}).map(([channel, count]) => (
                              <div key={channel} className="flex justify-between items-center">
                                <span className="text-sm">{channel}</span>
                                <span className="font-bold text-blue-600">{count} đơn</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-3 text-green-700">📦 Phân loại Sản phẩm</h4>
                          <div className="space-y-2">
                            {Object.entries(analysis.productTypes || {}).map(([type, count]) => (
                              <div key={type} className="flex justify-between items-center">
                                <span className="text-sm">{type}</span>
                                <span className="font-bold text-green-600">{count} SKU</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-3 text-purple-700">🚚 Đơn vị vận chuyển</h4>
                          <div className="space-y-2">
                            {Object.entries(analysis.transporters || {}).map(([transporter, count]) => (
                              <div key={transporter} className="flex justify-between items-center">
                                <span className="text-sm text-xs">{transporter}</span>
                                <span className="font-bold text-purple-600">{count} đơn</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Phân bố địa lý */}
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-indigo-700">🌍 Phân bố Địa lý</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(analysis.cities || {}).map(([city, count]) => (
                            <div key={city} className="text-center">
                              <p className="text-sm text-indigo-600">{city}</p>
                              <p className="font-bold text-indigo-800">{count} đơn</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insights kho vận */}
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-700 mb-2">💡 Insights Kho vận (từ dữ liệu thực tế)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Năng suất xuất hàng:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• {analysis.totalSKU} SKU cần xuất kho</li>
                              <li>• {Math.ceil(analysis.totalSKU / 100)} giờ xử lý (ước tính 100 SKU/giờ)</li>
                              <li>• {Math.ceil(analysis.totalSKU / 800)} người/ngày (8h/người)</li>
                            </ul>
                          </div>
                          <div>
                            <p><strong>Đặc điểm đơn hàng:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Tỷ lệ COD: {analysis.totalOrders > 0 ? Math.round((analysis.codOrders / analysis.totalOrders) * 100) : 0}%</li>
                              <li>• Giá trị TB/đơn: {analysis.totalOrders > 0 ? Math.round(analysis.totalAmount / analysis.totalOrders).toLocaleString() : 0} VNĐ</li>
                              <li>• Chủ yếu {Object.keys(analysis.productTypes || {})[0] || 'Vali'}</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Sample data preview */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3">📋 Dữ liệu mẫu (3 đơn đầu tiên)</h4>
                        <div className="space-y-2 text-xs">
                          {analysis.skuDetails.slice(0, 3).map((order, idx) => (
                            <div key={idx} className="bg-white p-2 rounded border">
                              <div className="grid grid-cols-2 gap-2">
                                <span><strong>Đơn:</strong> {order.orderName}</span>
                                <span><strong>Kênh:</strong> {order.channel}</span>
                                <span><strong>SKU:</strong> {order.skuCount}</span>
                                <span><strong>Sản phẩm:</strong> {order.products.substring(0, 30)}...</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )  (
                    // Hiển thị cho các loại file khác
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(analysis).map(([metric, value]) => (
                        <div key={metric} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 capitalize">
                            {metric.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                            {metric.includes('Percentage') && '%'}
                            {metric.includes('Cost') && ' VNĐ'}
                            {metric.includes('Time') && ' giờ'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Chỉ số Năng suất Tổng quan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Tổng SKU xử lý</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {productivityMetrics.totalSKUProcessed.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">Online + Chuyển kho + Container</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Hiệu suất Đơn Online</p>
                  <p className="text-3xl font-bold text-green-700">
                    {productivityMetrics.onlineOrderProductivity} SKU/đơn
                  </p>
                  <p className="text-xs text-gray-600">Trung bình sản phẩm/đơn hàng</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Hiệu suất Container</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {productivityMetrics.containerProductivity.toLocaleString()} SKU/cont
                  </p>
                  <p className="text-xs text-gray-600">Năng lực nhận hàng</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Nhân sự Cần thiết</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {productivityMetrics.staffNeeded} người/ngày
                  </p>
                  <p className="text-xs text-gray-600">Ước tính cho khối lượng hiện tại</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân tích 20/80 & Đề xuất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <h4 className="font-bold text-red-700">🎯 20% Ưu tiên cao (80% tác động)</h4>
                  <ul className="text-sm text-red-600 mt-2 space-y-1">
                    <li>• <strong>Container processing:</strong> {productivityMetrics.containerProductivity.toLocaleString()} SKU/cont - tối ưu quy trình nhận hàng</li>
                    <li>• <strong>Vali dominance:</strong> {productivityMetrics.valiDominance}% - chuẩn hóa layout kho cho Vali</li>
                    <li>• <strong>Online orders:</strong> {(analysisResults.online?.totalOrders || 0)} đơn - nâng cao tốc độ xử lý</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <h4 className="font-bold text-yellow-700">⚡ Cần theo dõi</h4>
                  <ul className="text-sm text-yellow-600 mt-2 space-y-1">
                    <li>• Transfer efficiency: {productivityMetrics.transferEfficiency} SKU/lượt</li>
                    <li>• Processing time: {productivityMetrics.processingTime}h tổng</li>
                    <li>• COD ratio: {analysisResults.online?.totalOrders > 0 ? Math.round((analysisResults.online?.codOrders / analysisResults.online?.totalOrders) * 100) : 0}%</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-bold text-blue-700">📊 Insights chính</h4>
                  <ul className="text-sm text-blue-600 mt-2 space-y-1">
                    <li>• <strong>Chi phí ước tính:</strong> {productivityMetrics.estimatedCost.toLocaleString()} VNĐ</li>
                    <li>• <strong>Kênh chính:</strong> {Object.keys(analysisResults.online?.channels || {})[0] || 'Shopee'}</li>
                    <li>• <strong>Sản phẩm chủ đạo:</strong> Vali ({productivityMetrics.valiDominance}%)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-bold text-green-700">🚀 Action Items</h4>
                  <ul className="text-sm text-green-600 mt-2 space-y-1">
                    <li>• Tối ưu workflow container (80% khối lượng)</li>
                    <li>• Setup dedicated area cho đơn online</li>
                    <li>• Implement FIFO cho Vali</li>
                    <li>• Cross-train nhân viên cho flexibility</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Chi tiết Khối lượng Công việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-cyan-50 p-4 rounded-lg border">
                  <h4 className="font-bold text-cyan-700">📱 Đơn Online</h4>
                  <p className="text-2xl font-bold">{analysisResults.online?.totalOrders || 0}</p>
                  <p className="text-sm text-gray-600">{analysisResults.online?.totalSKU || 0} SKU xuất</p>
                  <p className="text-xs text-cyan-600 mt-2">
                    {Object.keys(analysisResults.online?.channels || {}).length} kênh bán
                  </p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg border">
                  <h4 className="font-bold text-indigo-700">🔄 Chuyển Kho</h4>
                  <p className="text-2xl font-bold">{analysisResults.chuyenkho?.totalTransfers || 0}</p>
                  <p className="text-sm text-gray-600">{analysisResults.chuyenkho?.totalSKU || 0} SKU chuyển</p>
                  <p className="text-xs text-indigo-600 mt-2">
                    KTT ↔ Siêu thị + Luân chuyển
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border">
                  <h4 className="font-bold text-green-700">📦 Container</h4>
                  <p className="text-2xl font-bold">{analysisResults.exim?.totalContainers || 0}</p>
                  <p className="text-sm text-gray-600">{(analysisResults.exim?.totalSKU || 0).toLocaleString()} SKU nhập</p>
                  <p className="text-xs text-green-600 mt-2">
                    {analysisResults.exim?.totalProcessingTime || 0}h xử lý
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-700">📊 Tồn Kho</h4>
                  <p className="text-2xl font-bold">{analysisResults.tonkhoban?.totalProducts || 0}</p>
                  <p className="text-sm text-gray-600">Sản phẩm tham chiếu</p>
                  <p className="text-xs text-blue-600 mt-2">
                    {productivityMetrics.valiDominance}% Vali
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WarehouseDataUploader;
