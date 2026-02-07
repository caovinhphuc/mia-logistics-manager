import React, { useState, useCallback, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
  Database,
  FileJson,
  FileSpreadsheet,
  Eye,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  Truck,
  MapPin,
  Users,
  Calendar,
  Filter,
  Settings,
  ArrowRight,
  Activity
} from 'lucide-react';

// Hàm tính SLA theo logic từ slaCalculations.js
const calculateSLA = (orderDate, platform) => {
  const now = new Date();
  const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

  if ((platform.toLowerCase().includes("shopee") && platform.toLowerCase().includes("express")) || hoursDiff < 2) {
    return "P1 - Gấp 🚀";
  } else if (hoursDiff < 4) {
    return "P2 - Cảnh báo ⚠️";
  } else if (hoursDiff < 8) {
    return "P3 - Bình thường ✅";
  } else {
    return "P4 - Chờ xử lý 🕒";
  }
};

// Simple Card components to replace UI directory dependencies
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const OnlineOrderDataUploader = ({ onDataUploaded, onNavigateToReport }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // File upload configurations
  const uploadConfigs = [
    {
      key: 'online_orders',
      title: 'Đơn hàng Online',
      description: 'Upload file JSON/Excel chứa dữ liệu đơn hàng từ các kênh online',
      acceptedFormats: ['.json', '.xlsx', '.csv'],
      icon: FileJson,
      color: 'blue',
      required: true
    }
  ];

  // Parse JSON file
  const parseJsonFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  // Parse Excel/CSV file (simplified)
  const parseExcelFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      // In production, use a library like xlsx or papaparse
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Simplified CSV parsing for demo
          if (file.name.endsWith('.csv')) {
            const text = e.target.result;
            const lines = text.split('\n');
            const headers = lines[0].split(',');
            const data = lines.slice(1).map(line => {
              const values = line.split(',');
              const row = {};
              headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() || '';
              });
              return row;
            });
            resolve(data);
          } else {
            reject(new Error('Excel parsing requires xlsx library'));
          }
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);
  // Process and analyze uploaded data
  const analyzeOrderData = useCallback((data) => {
    console.log('Raw data received:', data);

    // Xử lý nhiều định dạng dữ liệu khác nhau
    let processedData = data;

    // Nếu data là object và có thuộc tính chứa mảng đơn hàng
    if (!Array.isArray(data) && typeof data === 'object') {
      // Thử các key phổ biến cho đơn hàng
      const possibleKeys = ['orders', 'data', 'items', 'results', 'records', 'order_list'];

      for (const key of possibleKeys) {
        if (data[key] && Array.isArray(data[key])) {
          processedData = data[key];
          console.log(`Found orders in key: ${key}`, processedData);
          break;
        }
      }

      // Nếu vẫn không tìm thấy mảng, thử lấy giá trị đầu tiên là mảng
      if (!Array.isArray(processedData)) {
        const arrayValues = Object.values(data).filter(value => Array.isArray(value));
        if (arrayValues.length > 0) {
          processedData = arrayValues[0];
          console.log('Using first array found:', processedData);
        }
      }

      // Nếu data có chỉ 1 object, có thể đó là 1 đơn hàng
      if (!Array.isArray(processedData) && Object.keys(data).length > 0) {
        // Kiểm tra xem có phải là 1 đơn hàng không
        const hasOrderFields = ['id', 'order_id', 'channel', 'amount', 'status'].some(field =>
          field in data || `order_${field}` in data
        );

        if (hasOrderFields) {
          processedData = [data]; // Wrap trong mảng
          console.log('Single order detected, wrapped in array:', processedData);
        }
      }
    }

    // Kiểm tra cuối cùng
    if (!Array.isArray(processedData)) {
      throw new Error(`Dữ liệu không đúng định dạng. Cần một mảng đơn hàng hoặc object chứa mảng đơn hàng.
        Dữ liệu nhận được: ${typeof data}.
        Vui lòng kiểm tra định dạng file JSON hoặc tải file mẫu để tham khảo.`);
    }    if (processedData.length === 0) {
      throw new Error('Không có đơn hàng nào trong dữ liệu');
    }

    console.log(`Processing ${processedData.length} orders`);    const analysis = {
      totalOrders: processedData.length,
      totalAmount: 0,
      totalCODAmount: 0,
      channels: {},
      transporters: {},
      statuses: {},
      slaDistribution: {},
      paymentMethods: {},
      cities: {},
      districts: {},
      avgOrderValue: 0,
      avgCODValue: 0,
      codVsPrepaidRatio: { cod: 0, prepaid: 0 },
      dateRange: { earliest: null, latest: null },
      productCategories: {},
      topProducts: {}
    };processedData.forEach((order, index) => {
      console.log(`Processing order ${index + 1}:`, order);

      // Process amount - hỗ trợ dữ liệu thực từ hệ thống
      const amount = parseFloat(
        order.amount_total ||  // Field chính từ hệ thống
        order.amount ||
        order.total ||
        order.order_total ||
        order.value ||
        order.price ||
        order.total_amount ||
        order.subtotal ||
        order.grand_total ||
        0
      );
      console.log(`Order ${index + 1} amount:`, amount);
      analysis.totalAmount += amount;

      // Parse product details - "detail" field chứa danh sách sản phẩm và số lượng
      let products = [];
      if (order.detail) {
        try {
          // Split products by comma, parse quantity in parentheses
          const productStrings = order.detail.split(',');
          products = productStrings.map(productStr => {
            const match = productStr.trim().match(/^(.*?)\((\d+)\)$/);
            if (match) {
              return {
                name: match[1].trim(),
                quantity: parseInt(match[2])
              };
            } else {
              return {
                name: productStr.trim(),
                quantity: 1
              };
            }
          });
        } catch (error) {
          console.warn(`Failed to parse products for order ${index + 1}:`, error);
          products = [{ name: order.detail, quantity: 1 }];
        }
      }
      console.log(`Order ${index + 1} products:`, products);      // Count channels - ưu tiên field "customer" từ dữ liệu thực
      let channel = order.customer ||  // Field chính từ hệ thống thực
        order.channel ||
        order.platform ||
        order.source ||
        order.marketplace ||
        order.sales_channel ||
        order.vendor ||
        order.store ||
        order.shop;// Chuẩn hóa tên channel với hỗ trợ tiếng Việt tốt hơn
      if (channel) {
        const channelLower = channel.toLowerCase();
        // Mapping chi tiết cho các kênh tiếng Việt/English
        if (channelLower.includes('shopee') || channelLower.includes('sp') || channelLower.includes('sp express')) {
          channel = 'Shopee';
        } else if (channelLower.includes('lazada') || channelLower.includes('lzd')) {
          channel = 'Lazada';
        } else if (channelLower.includes('tiktok') || channelLower.includes('tik tok')) {
          channel = 'TikTok Shop';
        } else if (channelLower.includes('sendo') || channelLower.includes('sd')) {
          channel = 'Sendo';
        } else if (channelLower.includes('tiki') && !channelLower.includes('tiktok')) {
          channel = 'Tiki';
        } else if (channelLower.includes('website') || channelLower.includes('web') || channelLower === 'website' || channelLower.includes('trang web')) {
          channel = 'Website';
        } else if (channelLower.includes('facebook') || channelLower.includes('fb')) {
          channel = 'Facebook';
        } else if (channelLower.includes('zalo')) {
          channel = 'Zalo';
        } else if (channelLower.includes('offline') || channelLower.includes('cửa hàng') || channelLower.includes('store')) {
          channel = 'Offline';
        } else if (channelLower.includes('instagram') || channelLower.includes('ig')) {
          channel = 'Instagram';
        } else {
          channel = channel; // Giữ nguyên nếu không match
        }
      } else {
        channel = 'Không xác định';
      }
      console.log(`Order ${index + 1} channel:`, channel);
      analysis.channels[channel] = (analysis.channels[channel] || 0) + 1;      // Count statuses - hỗ trợ nhiều tên field và chuẩn hóa tiếng Việt
      let status = order.status ||
        order.state ||
        order.order_status ||
        order.order_state ||
        order.delivery_status ||
        order.trạng_thái ||
        order.tình_trạng ||
        'processing'; // Default to processing

      // Chuẩn hóa trạng thái tiếng Việt
      if (status) {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('hoàn thành') || statusLower.includes('completed') || statusLower.includes('done') || statusLower.includes('delivered')) {
          status = 'completed';
        } else if (statusLower.includes('đang xử lý') || statusLower.includes('processing') || statusLower.includes('đang giao') || statusLower.includes('shipping')) {
          status = 'processing';
        } else if (statusLower.includes('hủy') || statusLower.includes('cancelled') || statusLower.includes('cancel') || statusLower.includes('huỷ')) {
          status = 'cancelled';
        } else if (statusLower.includes('chờ') || statusLower.includes('pending') || statusLower.includes('waiting')) {
          status = 'pending';
        } else if (statusLower.includes('trả hàng') || statusLower.includes('returned') || statusLower.includes('return')) {
          status = 'returned';
        }
      }
      console.log(`Order ${index + 1} status:`, status);
      analysis.statuses[status] = (analysis.statuses[status] || 0) + 1;      // Count SLA - logic dựa trên thời gian và loại đơn hàng (theo slaCalculations.js)
      let sla = order.sla ||
        order.priority ||
        order.urgency ||
        order.service_level;

      // Nếu không có SLA, tự động phân loại theo logic SLA từ slaCalculations.js
      if (!sla) {
        const orderDate = new Date(
          order.orderDate ||
          order.date_order ||
          order.created_at ||
          order.order_date ||
          order.date_created ||
          order.timestamp ||
          order.created ||
          order.date ||
          order.time
        );

        if (!isNaN(orderDate.getTime())) {
          sla = calculateSLA(orderDate, channel);
        } else {
          // Fallback nếu không có ngày hợp lệ
          const amount = parseFloat(order.amount_total || 0);
          const isExpressChannel = (order.customer || '').toLowerCase().includes('express');

          if (isExpressChannel) {
            sla = 'P1 - Gấp 🚀';
          } else if (amount > 1000000) {
            sla = 'P2 - Cảnh báo ⚠️';
          } else {
            sla = 'P3 - Bình thường ✅';
          }
        }
      }
      console.log(`Order ${index + 1} sla:`, sla);
      analysis.slaDistribution[sla] = (analysis.slaDistribution[sla] || 0) + 1;      // Count payment methods - logic và mapping tiếng Việt
      let payment = order.paymentMethod ||
        order.payment_method ||
        order.payment ||
        order.payment_type ||
        order.pay_method ||
        order.payment_option ||
        order.phương_thức_thanh_toán ||
        order.thanh_toán;

      // Chuẩn hóa payment method
      if (payment) {
        const paymentLower = payment.toLowerCase();
        if (paymentLower.includes('cod') || paymentLower.includes('tiền mặt') || paymentLower.includes('thu hộ')) {
          payment = 'COD';
        } else if (paymentLower.includes('prepaid') || paymentLower.includes('trả trước') || paymentLower.includes('banking') || paymentLower.includes('chuyển khoản')) {
          payment = 'Prepaid';
        } else if (paymentLower.includes('credit') || paymentLower.includes('thẻ tín dụng')) {
          payment = 'Credit Card';
        } else if (paymentLower.includes('momo') || paymentLower.includes('zalopay') || paymentLower.includes('wallet') || paymentLower.includes('ví điện tử')) {
          payment = 'E-Wallet';
        }
      }

      // Nếu không có payment method, phân loại dựa trên COD amount
      if (!payment) {
        const codAmount = parseFloat(order.cod_total || order.ecom_cod_amount || order.tiền_cod || 0);
        if (codAmount > 0) {
          payment = 'COD';
        } else {
          payment = 'Prepaid';
        }
      }      console.log(`Order ${index + 1} payment:`, payment);
      analysis.paymentMethods[payment] = (analysis.paymentMethods[payment] || 0) + 1;

      // Enhanced analysis for real data structure

      // Track COD amounts
      const codAmount = parseFloat(order.cod_total || order.ecom_cod_amount || 0);
      analysis.totalCODAmount += codAmount;

      // COD vs Prepaid ratio
      if (payment === 'COD') {
        analysis.codVsPrepaidRatio.cod += 1;
      } else {
        analysis.codVsPrepaidRatio.prepaid += 1;
      }

      // Track transporters
      const transporter = order.transporter || order.shipper || order.shipping_method || 'Unknown';
      analysis.transporters[transporter] = (analysis.transporters[transporter] || 0) + 1;

      // Track cities and districts
      if (order.city) {
        analysis.cities[order.city] = (analysis.cities[order.city] || 0) + 1;
      }
      if (order.district) {
        analysis.districts[order.district] = (analysis.districts[order.district] || 0) + 1;
      }

      // Track products from detail field
      if (products && products.length > 0) {
        products.forEach(product => {
          if (product.name) {
            analysis.topProducts[product.name] = (analysis.topProducts[product.name] || 0) + (product.quantity || 1);

            // Simple product category detection
            const productName = product.name.toLowerCase();
            let category = 'Khác';
            if (productName.includes('vali') || productName.includes('túi') || productName.includes('balo')) {
              category = 'Túi & Vali';
            } else if (productName.includes('giày') || productName.includes('dép')) {
              category = 'Giày dép';
            } else if (productName.includes('áo') || productName.includes('quần')) {
              category = 'Thời trang';
            } else if (productName.includes('phụ kiện') || productName.includes('ví')) {
              category = 'Phụ kiện';
            }
            analysis.productCategories[category] = (analysis.productCategories[category] || 0) + 1;
          }
        });
      }// Track date range - hỗ trợ nhiều tên field tiếng Việt/English
      const orderDate = new Date(
        order.orderDate ||
        order.date_order ||
        order.created_at ||
        order.order_date ||
        order.date_created ||
        order.timestamp ||
        order.created ||
        order.date ||
        order.time ||
        order.ngày_đặt ||
        order.ngày_tạo ||
        order.thời_gian ||
        order.ngày
      );
      if (!isNaN(orderDate.getTime())) {
        if (!analysis.dateRange.earliest || orderDate < analysis.dateRange.earliest) {
          analysis.dateRange.earliest = orderDate;
        }
        if (!analysis.dateRange.latest || orderDate > analysis.dateRange.latest) {
          analysis.dateRange.latest = orderDate;
        }
      }

      // Log first few orders to see structure
      if (index < 3) {
        console.log(`Sample order ${index + 1} keys:`, Object.keys(order));
        console.log(`Sample order ${index + 1} data:`, order);
      }
    });    analysis.avgOrderValue = analysis.totalOrders > 0 ? analysis.totalAmount / analysis.totalOrders : 0;
    analysis.avgCODValue = analysis.codVsPrepaidRatio.cod > 0 ? analysis.totalCODAmount / analysis.codVsPrepaidRatio.cod : 0;

    // Sort top products by quantity
    const sortedProducts = Object.entries(analysis.topProducts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    analysis.topProducts = Object.fromEntries(sortedProducts);

    console.log('Final analysis result:', analysis);
    console.log('Total amount:', analysis.totalAmount);
    console.log('Total COD amount:', analysis.totalCODAmount);
    console.log('Channels:', analysis.channels);
    console.log('Transporters:', analysis.transporters);
    console.log('Cities:', analysis.cities);
    console.log('Top products:', analysis.topProducts);
    console.log('Product categories:', analysis.productCategories);

    return { analysis, processedData };
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (event, config) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus('uploading');
    setErrorMessage('');

    // Update upload status
    setUploadedFiles(prev => ({
      ...prev,
      [config.key]: {
        file,
        status: 'uploading',
        timestamp: new Date(),
        config
      }
    }));

    try {
      let parsedData;

      if (file.name.endsWith('.json')) {
        parsedData = await parseJsonFile(file);
      } else if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        parsedData = await parseExcelFile(file);
      } else {
        throw new Error('Unsupported file format');
      }

      // Analyze the data
      const { analysis, processedData } = analyzeOrderData(parsedData);

      // Update success status
      setUploadedFiles(prev => ({
        ...prev,
        [config.key]: {
          ...prev[config.key],
          status: 'success',
          analysis,
          data: processedData,
          recordCount: processedData.length
        }
      }));

      setAnalysisResults(analysis);
      setPreviewData(processedData.slice(0, 10)); // Show first 10 records
      setUploadStatus('success');

      // Notify parent component
      if (onDataUploaded) {
        onDataUploaded(processedData, analysis);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.message);
      setUploadStatus('error');

      setUploadedFiles(prev => ({
        ...prev,
        [config.key]: {
          ...prev[config.key],
          status: 'error',
          error: error.message
        }
      }));
    }
  }, [parseJsonFile, parseExcelFile, analyzeOrderData, onDataUploaded]);

  // Remove uploaded file
  const removeFile = useCallback((configKey) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[configKey];
      return updated;
    });

    if (Object.keys(uploadedFiles).length <= 1) {
      setAnalysisResults(null);
      setPreviewData([]);
      setUploadStatus('idle');
    }
  }, [uploadedFiles]);
  // Download sample file with real data structure
  const downloadSampleFile = useCallback(() => {
    const sampleData = {
      error: false,
      message: "OK",
      data: [
        {
          id: 459085,
          name: "SO01052025:0869778",
          transporter: "Shopee Express",
          customer: "Shopee",
          phone: "18002000",
          amount_total: "450000",
          cod_total: "450000",
          shipment_id: "510564960008008",
          shipment_code: "SP0342341465VNA",
          ecom_order_weight: "0.5",
          ecom_recipient_code: "",
          ecom_cod_amount: "0",
          date_order: "2025-01-01 08:14:24",
          address: "117 Bạch Đằng",
          district: "Quận Bình Thạnh",
          city: "Hồ Chí Minh",
          detail: "Vali 28L(1), Tag hành lý(2)"
        },
        {
          id: 459086,
          name: "SO01052025:0869779",
          transporter: "Lazada Express",
          customer: "Lazada",
          phone: "18003000",
          amount_total: "680000",
          cod_total: "0",
          shipment_id: "510564960008009",
          shipment_code: "LZ0342341465VNA",
          ecom_order_weight: "1.2",
          ecom_recipient_code: "",
          ecom_cod_amount: "0",
          date_order: "2025-01-01 09:15:24",
          address: "45 Nguyễn Huệ",
          district: "Quận 1",
          city: "Hồ Chí Minh",
          detail: "Balo du lịch(1), Phụ kiện(3)"
        },
        {
          id: 459087,
          name: "SO01052025:0869780",
          transporter: "TikTok Shop Express",
          customer: "TikTok Shop",
          phone: "18004000",
          amount_total: "320000",
          cod_total: "320000",
          shipment_id: "510564960008010",
          shipment_code: "TT0342341465VNA",
          ecom_order_weight: "0.8",
          ecom_recipient_code: "",
          ecom_cod_amount: "0",
          date_order: "2025-01-01 10:30:24",
          address: "123 Lê Lợi",
          district: "Quận Gò Vấp",
          city: "Hồ Chí Minh",
          detail: "Túi xách(1), Ví da(1)"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_online_orders.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);
  // Load demo data with real structure
  const loadDemoData = useCallback(() => {
    const demoData = {
      error: false,
      message: "OK",
      data: Array.from({ length: 30 }, (_, i) => {
        const customers = ['Shopee', 'Lazada', 'TikTok Shop', 'Sendo', 'Website'];
        const transporters = ['Shopee Express', 'Lazada Express', 'TikTok Shop Express', 'Sendo Express', 'Website Express'];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const transporter = transporters[customers.indexOf(customer)];
        const isCOD = Math.random() > 0.5;
        const amount = Math.floor(Math.random() * 1000000) + 100000;

        return {
          id: 459085 + i,
          name: `SO0105202${String(i + 1).padStart(2, '0')}:086977${String(i + 8)}`,
          transporter: transporter,
          customer: customer,
          phone: `1800${String(Math.floor(Math.random() * 9000) + 1000)}`,
          amount_total: String(amount),
          cod_total: isCOD ? String(amount) : "0",
          shipment_id: `51056496000800${String(i + 8)}`,
          shipment_code: `${customer.slice(0, 2).toUpperCase()}034234146${String(i + 5)}VNA`,
          ecom_order_weight: String((Math.random() * 2 + 0.1).toFixed(1)),
          ecom_recipient_code: "",
          ecom_cod_amount: "0",
          date_order: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
          address: `${Math.floor(Math.random() * 999) + 1} ${['Nguyễn Huệ', 'Lê Lợi', 'Trần Hưng Đạo', 'Bạch Đằng', 'Hai Bà Trưng'][Math.floor(Math.random() * 5)]}`,
          district: ['Quận 1', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Tân Bình', 'Quận 3'][Math.floor(Math.random() * 5)],
          city: "Hồ Chí Minh",
          detail: [
            "Vali 28L(1), Tag hành lý(2)",
            "Balo du lịch(1), Phụ kiện(3)",
            "Túi xách(1), Ví da(1)",
            "Giày thể thao(1)",
            "Áo khoác(2), Quần jean(1)"
          ][Math.floor(Math.random() * 5)]
        };
      })
    };

    try {
      const analysis = analyzeOrderData(demoData);

      setUploadedFiles({
        online_orders: {
          file: { name: 'demo_orders.json' },
          status: 'success',
          timestamp: new Date(),
          analysis,
          data: demoData.data,
          recordCount: demoData.data.length,
          config: uploadConfigs[0]
        }
      });

      setAnalysisResults(analysis);
      setPreviewData(demoData.data.slice(0, 10));
      setUploadStatus('success');

      if (onDataUploaded) {
        onDataUploaded(demoData.data, analysis);
      }
    } catch (error) {
      console.error('Demo data error:', error);
      setErrorMessage('Failed to load demo data');
      setUploadStatus('error');
    }
  }, [analyzeOrderData, onDataUploaded]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>        <CardHeader>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            Upload Dữ liệu Đơn hàng Online
            <span className="text-sm text-gray-500 font-normal">
              Tải lên và phân tích dữ liệu đơn hàng từ các kênh online
            </span>
          </h3>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <div className="grid grid-cols-1 gap-6">
        {uploadConfigs.map((config) => {
          const uploadInfo = uploadedFiles[config.key];
          const Icon = config.icon;

          return (
            <Card key={config.key}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-8 h-8 text-${config.color}-500`} />
                    <div>
                      <h3 className="text-lg font-medium">{config.title}</h3>
                      <p className="text-sm text-gray-600">{config.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Định dạng hỗ trợ: {config.acceptedFormats.join(', ')}
                      </p>
                    </div>
                  </div>

                  {config.required && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Bắt buộc
                    </span>
                  )}
                </div>

                {/* Upload Status */}
                {uploadInfo ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {uploadInfo.status === 'uploading' && (
                          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                        )}
                        {uploadInfo.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {uploadInfo.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}

                        <div>
                          <p className="font-medium">{uploadInfo.file.name}</p>
                          <p className="text-sm text-gray-600">
                            {uploadInfo.status === 'uploading' && 'Đang xử lý...'}
                            {uploadInfo.status === 'success' && `${uploadInfo.recordCount} bản ghi • ${uploadInfo.timestamp.toLocaleString('vi-VN')}`}
                            {uploadInfo.status === 'error' && uploadInfo.error}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(config.key)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Analysis Results */}
                    {uploadInfo.status === 'success' && uploadInfo.analysis && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium">Tổng đơn hàng</p>
                          <p className="text-2xl font-bold text-blue-700">{uploadInfo.analysis.totalOrders}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">Tổng doanh thu</p>
                          <p className="text-2xl font-bold text-green-700">
                            {uploadInfo.analysis.totalAmount.toLocaleString('vi-VN')} ₫
                          </p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm text-purple-600 font-medium">Giá trị TB/đơn</p>
                          <p className="text-2xl font-bold text-purple-700">
                            {uploadInfo.analysis.avgOrderValue.toLocaleString('vi-VN')} ₫
                          </p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-sm text-orange-600 font-medium">Kênh bán</p>
                          <p className="text-2xl font-bold text-orange-700">
                            {Object.keys(uploadInfo.analysis.channels).length}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={config.acceptedFormats.join(',')}
                      onChange={(e) => handleFileUpload(e, config)}
                      className="hidden"
                    />

                    <Icon className={`w-12 h-12 text-gray-400 mx-auto mb-4`} />                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Kéo thả file hoặc click để chọn
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {config.acceptedFormats.join(', ')} - Không giới hạn dung lượng
                    </p>

                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-2 bg-${config.color}-600 text-white rounded-lg hover:bg-${config.color}-700 transition-colors`}
                      >
                        Chọn file
                      </button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadSampleFile}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Tải file mẫu
        </button>

        <button
          onClick={loadDemoData}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Database className="w-4 h-4 mr-2" />
          Tải dữ liệu demo
        </button>

        {previewData.length > 0 && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Ẩn' : 'Xem'} dữ liệu
          </button>
        )}

        {analysisResults && onNavigateToReport && (
          <button
            onClick={onNavigateToReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Xem báo cáo
          </button>
        )}
      </div>

      {/* Data Preview */}
      {showPreview && previewData.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold mb-4">Xem trước dữ liệu ({previewData.length} bản ghi đầu tiên)</h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Mã đơn hàng</th>
                    <th className="text-left p-2">Tên đơn hàng</th>
                    <th className="text-left p-2">Kênh</th>
                    <th className="text-left p-2">Vận chuyển</th>
                    <th className="text-left p-2">Ngày đặt</th>
                    <th className="text-left p-2">Giá trị</th>
                    <th className="text-left p-2">COD</th>
                    <th className="text-left p-2">SLA</th>
                    <th className="text-left p-2">Sản phẩm</th>
                    <th className="text-left p-2">Địa chỉ</th>
                  </tr>
                </thead>                <tbody>
                  {previewData.map((order, index) => {
                    // Parse products from detail field
                    let products = [];
                    if (order.detail) {
                      try {
                        const productStrings = order.detail.split(',');
                        products = productStrings.map(productStr => {
                          const match = productStr.trim().match(/^(.*?)\((\d+)\)$/);
                          if (match) {
                            return `${match[1].trim()}(${match[2]})`;
                          } else {
                            return productStr.trim();
                          }
                        });
                      } catch (error) {
                        products = [order.detail];
                      }
                    }

                    // Display the processed/normalized data
                    const displayOrder = {
                      id: order.id || `Order-${index + 1}`,
                      name: order.name || order.order_name || `SO${order.id}`,
                      channel: order.customer || order.channel || order.platform || 'Unknown',
                      transporter: order.transporter || order.shipper || 'N/A',
                      orderDate: order.date_order || order.orderDate || order.created_at,
                      amount: parseFloat(order.amount_total || order.amount || 0),
                      codAmount: parseFloat(order.cod_total || order.ecom_cod_amount || 0),
                      sla: order.sla || order.priority || 'P3',
                      products: products.slice(0, 2), // Show first 2 products
                      address: `${order.address || ''} ${order.district || ''} ${order.city || ''}`.trim() || 'N/A'
                    };

                    return (
                      <tr key={`preview-${displayOrder.id}-${index}`} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs" title={`ID: ${displayOrder.id}`}>
                          {displayOrder.id}
                        </td>
                        <td className="p-2 text-xs" title={displayOrder.name}>
                          {displayOrder.name.length > 15 ? `${displayOrder.name.slice(0, 15)}...` : displayOrder.name}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            displayOrder.channel === 'Shopee' ? 'bg-orange-100 text-orange-800' :
                            displayOrder.channel === 'Lazada' ? 'bg-blue-100 text-blue-800' :
                            displayOrder.channel === 'TikTok Shop' ? 'bg-black text-white' :
                            displayOrder.channel === 'Sendo' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {displayOrder.channel}
                          </span>
                        </td>
                        <td className="p-2 text-xs" title={displayOrder.transporter}>
                          {displayOrder.transporter.length > 12 ? `${displayOrder.transporter.slice(0, 12)}...` : displayOrder.transporter}
                        </td>
                        <td className="p-2 text-xs">
                          {displayOrder.orderDate ? new Date(displayOrder.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="p-2 text-right text-xs font-medium">
                          {displayOrder.amount ? displayOrder.amount.toLocaleString('vi-VN') : '0'} ₫
                        </td>
                        <td className="p-2 text-right text-xs">
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            displayOrder.codAmount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {displayOrder.codAmount > 0 ? 'COD' : 'Prepaid'}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            displayOrder.sla.includes('P1') ? 'bg-red-100 text-red-800' :
                            displayOrder.sla.includes('P2') ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {displayOrder.sla}
                          </span>
                        </td>
                        <td className="p-2 text-xs" title={order.detail || 'No products'}>
                          {displayOrder.products.length > 0 ?
                            `${displayOrder.products.join(', ')}${products.length > 2 ? '...' : ''}` :
                            'N/A'
                          }
                        </td>
                        <td className="p-2 text-xs" title={displayOrder.address}>
                          {displayOrder.address.length > 20 ? `${displayOrder.address.slice(0, 20)}...` : displayOrder.address}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Error Display */}
      {uploadStatus === 'error' && errorMessage && (
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-medium">Lỗi khi xử lý dữ liệu</h3>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}      {/* Success Summary */}
      {uploadStatus === 'success' && analysisResults && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Upload thành công!</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Thống kê chung</h4>
                <ul className="text-sm space-y-1">
                  <li>• Tổng đơn hàng: <strong>{analysisResults.totalOrders}</strong></li>
                  <li>• Tổng doanh thu: <strong>{analysisResults.totalAmount.toLocaleString('vi-VN')} ₫</strong></li>
                  <li>• Giá trị TB/đơn: <strong>{analysisResults.avgOrderValue.toLocaleString('vi-VN')} ₫</strong></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Kênh bán hàng</h4>                <ul className="text-sm space-y-1">
                  {Object.keys(analysisResults.channels).length > 0 ? (
                    Object.entries(analysisResults.channels).map(([channel, count], index) => (
                      <li key={`channel-${index}-${channel}`}>• {channel}: <strong>{count}</strong></li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Không tìm thấy thông tin kênh</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Trạng thái đơn hàng</h4>                <ul className="text-sm space-y-1">
                  {Object.keys(analysisResults.statuses).length > 0 ? (
                    Object.entries(analysisResults.statuses).map(([status, count], index) => (
                      <li key={`status-${index}-${status}`}>• {status}: <strong>{count}</strong></li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Không tìm thấy thông tin trạng thái</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Debug Information */}
            {previewData.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Debug - Cấu trúc dữ liệu mẫu:</h4>
                <div className="text-xs text-gray-600">
                  <p><strong>Các field có trong bản ghi đầu tiên:</strong></p>
                  <p className="font-mono bg-white p-2 rounded mt-1">
                    {Object.keys(previewData[0] || {}).join(', ')}
                  </p>
                  {previewData[0] && (
                    <div className="mt-2">
                      <p><strong>Dữ liệu mẫu:</strong></p>
                      <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">
                        {JSON.stringify(previewData[0], null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default OnlineOrderDataUploader;
