import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Search,
  RefreshCw,
  Package,
  Clock,
  DollarSign,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

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

const OnlineOrderReportSystem = () => {
  // States for filters and data
  const [dateRange, setDateRange] = useState('today');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, detailed, export

  // Sample data - trong thực tế sẽ fetch từ API
  const [orderData, setOrderData] = useState([
    {
      id: 'SO20250101001',
      channel: 'Shopee',
      orderDate: '2025-01-01T08:30:00',
      amount: 450000,
      status: 'completed',
      customerCode: 'SP001',
      products: ['Vali 28L', 'Tag hành lý'],
      sla: 'P2',
      location: 'HN-A-05',
      processingTime: 25,
      paymentMethod: 'COD'
    },
    {
      id: 'SO20250101002',
      channel: 'Lazada',
      orderDate: '2025-01-01T09:15:00',
      amount: 680000,
      status: 'completed',
      customerCode: 'LZ001',
      products: ['Balo du lịch', 'Phụ kiện'],
      sla: 'P1',
      location: 'HN-B-12',
      processingTime: 18,
      paymentMethod: 'Prepaid'
    },
    {
      id: 'SO20250101003',
      channel: 'TikTok Shop',
      orderDate: '2025-01-01T10:45:00',
      amount: 320000,
      status: 'processing',
      customerCode: 'TT001',
      products: ['Túi xách'],
      sla: 'P3',
      location: 'HN-C-08',
      processingTime: null,
      paymentMethod: 'COD'
    },
    // Thêm nhiều dữ liệu mẫu cho các ngày khác
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `SO2024123${String(i + 1).padStart(3, '0')}`,
      channel: ['Shopee', 'Lazada', 'TikTok Shop', 'Website'][Math.floor(Math.random() * 4)],
      orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: Math.floor(Math.random() * 1000000) + 100000,
      status: ['completed', 'processing', 'cancelled'][Math.floor(Math.random() * 3)],
      customerCode: `CUS${String(i + 1).padStart(3, '0')}`,
      products: [['Vali 28L'], ['Balo du lịch', 'Phụ kiện'], ['Túi xách', 'Ví'], ['Vali 24L', 'Tag hành lý']][Math.floor(Math.random() * 4)],
      sla: ['P1', 'P2', 'P3'][Math.floor(Math.random() * 3)],
      location: `HN-${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
      processingTime: Math.floor(Math.random() * 40) + 10,
      paymentMethod: ['COD', 'Prepaid'][Math.floor(Math.random() * 2)]
    }))
  ]);

  // Filtered data based on selections
  const filteredData = useMemo(() => {
    let filtered = [...orderData];

    // Date range filter
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'yesterday':
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'custom':
        if (customDateFrom && customDateTo) {
          startDate = new Date(customDateFrom);
          endDate = new Date(customDateTo);
        }
        break;
    }

    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Channel filter
    if (selectedChannel !== 'all') {
      filtered = filtered.filter(order => order.channel === selectedChannel);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(term) ||
        order.customerCode.toLowerCase().includes(term) ||
        order.products.some(p => p.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [orderData, dateRange, customDateFrom, customDateTo, selectedChannel, searchTerm]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalOrders = filteredData.length;
    const completedOrders = filteredData.filter(o => o.status === 'completed').length;
    const processingOrders = filteredData.filter(o => o.status === 'processing').length;
    const cancelledOrders = filteredData.filter(o => o.status === 'cancelled').length;

    const totalRevenue = filteredData.reduce((sum, order) => sum + order.amount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const completedWithTime = filteredData.filter(o => o.status === 'completed' && o.processingTime);
    const avgProcessingTime = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, o) => sum + o.processingTime, 0) / completedWithTime.length
      : 0;

    const codOrders = filteredData.filter(o => o.paymentMethod === 'COD').length;
    const codRate = totalOrders > 0 ? (codOrders / totalOrders) * 100 : 0;

    return {
      totalOrders,
      completedOrders,
      processingOrders,
      cancelledOrders,
      totalRevenue,
      avgOrderValue,
      avgProcessingTime,
      codRate,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    };
  }, [filteredData]);

  // Chart data for trends
  const chartData = useMemo(() => {
    const dataByDate = {};

    filteredData.forEach(order => {
      const date = new Date(order.orderDate).toISOString().split('T')[0];
      if (!dataByDate[date]) {
        dataByDate[date] = {
          date,
          orders: 0,
          revenue: 0,
          completed: 0,
          processing: 0,
          cancelled: 0
        };
      }

      dataByDate[date].orders += 1;
      dataByDate[date].revenue += order.amount;
      dataByDate[date][order.status] += 1;
    });

    return Object.values(dataByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  // Channel distribution
  const channelData = useMemo(() => {
    const channels = {};
    filteredData.forEach(order => {
      channels[order.channel] = (channels[order.channel] || 0) + 1;
    });

    return Object.entries(channels).map(([channel, count]) => ({
      name: channel,
      value: count,
      percentage: ((count / filteredData.length) * 100).toFixed(1)
    }));
  }, [filteredData]);

  // SLA performance
  const slaData = useMemo(() => {
    const slaStats = {};
    filteredData.forEach(order => {
      slaStats[order.sla] = (slaStats[order.sla] || 0) + 1;
    });

    return Object.entries(slaStats).map(([sla, count]) => ({
      name: sla,
      value: count,
      percentage: ((count / filteredData.length) * 100).toFixed(1)
    }));
  }, [filteredData]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Refresh data
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Export functions
  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Kênh', 'Ngày đặt', 'Giá trị', 'Trạng thái', 'SLA', 'Thời gian xử lý', 'Thanh toán'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(order => [
        order.id,
        order.channel,
        new Date(order.orderDate).toLocaleString('vi-VN'),
        order.amount,
        order.status,
        order.sla,
        order.processingTime || 'N/A',
        order.paymentMethod
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `order_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [filteredData]);

  const exportToExcel = useCallback(() => {
    // Simplified Excel export - in production would use a library like xlsx
    const data = filteredData.map(order => ({
      'Mã đơn hàng': order.id,
      'Kênh bán': order.channel,
      'Ngày đặt hàng': new Date(order.orderDate).toLocaleString('vi-VN'),
      'Giá trị đơn hàng': order.amount,
      'Trạng thái': order.status,
      'SLA': order.sla,
      'Thời gian xử lý (phút)': order.processingTime || 'N/A',
      'Phương thức thanh toán': order.paymentMethod,
      'Sản phẩm': order.products.join(', '),
      'Vị trí kho': order.location
    }));

    console.log('Exporting to Excel:', data);
    alert('Tính năng xuất Excel sẽ được triển khai với thư viện xlsx');
  }, [filteredData]);

  // Render metric cards
  const MetricCard = ({ title, value, icon: Icon, change, format = 'number' }) => {
    const formatValue = (val) => {
      switch (format) {
        case 'currency':
          return val.toLocaleString('vi-VN') + ' ₫';
        case 'percentage':
          return val.toFixed(1) + '%';
        case 'time':
          return val.toFixed(1) + ' phút';
        default:
          return val.toLocaleString('vi-VN');
      }
    };

    return (
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{formatValue(value)}</p>
              {change && (
                <p className={`text-sm flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(change).toFixed(1)}%
                </p>
              )}
            </div>
            <Icon className="w-8 h-8 text-blue-500" />
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo đơn hàng Online</h1>
            <p className="text-gray-600">Thống kê và phân tích đơn hàng theo thời gian tùy chỉnh</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <div className="text-sm text-gray-500">
              Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Khoảng thời gian
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                  <input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                  <input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Channel Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Kênh bán hàng
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả kênh</option>
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
                <option value="TikTok Shop">TikTok Shop</option>
                <option value="Website">Website</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Mã đơn, khách hàng, sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* View Mode Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'dashboard'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'detailed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Chi tiết
          </button>
          <button
            onClick={() => setViewMode('export')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'export'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {viewMode === 'dashboard' && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard
              title="Tổng đơn hàng"
              value={metrics.totalOrders}
              icon={Package}
              change={5.2}
            />
            <MetricCard
              title="Doanh thu"
              value={metrics.totalRevenue}
              icon={DollarSign}
              format="currency"
              change={8.1}
            />
            <MetricCard
              title="Giá trị TB/đơn"
              value={metrics.avgOrderValue}
              icon={TrendingUp}
              format="currency"
              change={2.3}
            />
            <MetricCard
              title="Thời gian xử lý TB"
              value={metrics.avgProcessingTime}
              icon={Clock}
              format="time"
              change={-1.5}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <MetricCard
              title="Tỷ lệ hoàn thành"
              value={metrics.completionRate}
              icon={Activity}
              format="percentage"
              change={3.2}
            />
            <MetricCard
              title="Đơn COD"
              value={metrics.codRate}
              icon={Users}
              format="percentage"
              change={-0.8}
            />
            <MetricCard
              title="Đang xử lý"
              value={metrics.processingOrders}
              icon={Package}
              change={-2.1}
            />
            <MetricCard
              title="Đã hủy"
              value={metrics.cancelledOrders}
              icon={Package}
              change={-5.3}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Orders Trend */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold mb-4">Xu hướng đơn hàng theo thời gian</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => new Date(label).toLocaleDateString('vi-VN')}
                      formatter={(value, name) => [value, name === 'orders' ? 'Đơn hàng' : 'Doanh thu']}
                    />
                    <Area type="monotone" dataKey="orders" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold mb-4">Xu hướng doanh thu</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => new Date(label).toLocaleDateString('vi-VN')}
                      formatter={(value) => [value.toLocaleString('vi-VN') + ' ₫', 'Doanh thu']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Channel Distribution */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold mb-4">Phân bổ theo kênh</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* SLA Distribution */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold mb-4">Phân bổ SLA</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={slaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hoàn thành</span>
                    <span className="font-medium">{metrics.completedOrders} ({metrics.completionRate.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${metrics.completionRate}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đang xử lý</span>
                    <span className="font-medium">{metrics.processingOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(metrics.processingOrders / metrics.totalOrders) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đã hủy</span>
                    <span className="font-medium">{metrics.cancelledOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(metrics.cancelledOrders / metrics.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {/* Detailed View */}
      {viewMode === 'detailed' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Mã đơn hàng</th>
                    <th className="text-left p-2">Kênh</th>
                    <th className="text-left p-2">Ngày đặt</th>
                    <th className="text-left p-2">Giá trị</th>
                    <th className="text-left p-2">Trạng thái</th>
                    <th className="text-left p-2">SLA</th>
                    <th className="text-left p-2">Thời gian xử lý</th>
                    <th className="text-left p-2">Thanh toán</th>
                    <th className="text-left p-2">Sản phẩm</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 20).map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-sm">{order.id}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {order.channel}
                        </span>
                      </td>
                      <td className="p-2 text-sm">
                        {new Date(order.orderDate).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-2 font-medium">
                        {order.amount.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.sla === 'P1' ? 'bg-red-100 text-red-800' :
                          order.sla === 'P2' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.sla}
                        </span>
                      </td>
                      <td className="p-2 text-sm">
                        {order.processingTime ? `${order.processingTime} phút` : 'N/A'}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.paymentMethod === 'COD' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-2 text-sm">
                        {order.products.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length > 20 && (
                <div className="mt-4 text-center text-gray-500">
                  Hiển thị 20/{filteredData.length} đơn hàng đầu tiên
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Export View */}
      {viewMode === 'export' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold mb-4">Xuất báo cáo</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* Export Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-medium">Xuất CSV</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Xuất dữ liệu dạng CSV để xử lý trong Excel hoặc Google Sheets
                  </p>
                  <button
                    onClick={exportToCSV}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Tải file CSV
                  </button>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-medium">Xuất Excel</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Xuất báo cáo Excel với định dạng và biểu đồ đầy đủ
                  </p>
                  <button
                    onClick={exportToExcel}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Tải file Excel
                  </button>
                </div>
              </div>

              {/* Preview Export Data */}
              <div>
                <h3 className="text-lg font-medium mb-4">Xem trước dữ liệu xuất</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tổng số bản ghi:</span>
                      <div className="text-blue-600">{filteredData.length}</div>
                    </div>
                    <div>
                      <span className="font-medium">Khoảng thời gian:</span>
                      <div className="text-blue-600">{dateRange}</div>
                    </div>
                    <div>
                      <span className="font-medium">Kênh lọc:</span>
                      <div className="text-blue-600">{selectedChannel}</div>
                    </div>
                    <div>
                      <span className="font-medium">Dung lượng ước tính:</span>
                      <div className="text-blue-600">{Math.round(filteredData.length * 0.5)} KB</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Summary */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tóm tắt báo cáo</h3>
                <div className="bg-white border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{metrics.totalOrders}</div>
                      <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {metrics.totalRevenue.toLocaleString('vi-VN')} ₫
                      </div>
                      <div className="text-sm text-gray-600">Tổng doanh thu</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {metrics.completionRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {metrics.avgProcessingTime.toFixed(1)} phút
                      </div>
                      <div className="text-sm text-gray-600">Thời gian xử lý TB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default OnlineOrderReportSystem;
