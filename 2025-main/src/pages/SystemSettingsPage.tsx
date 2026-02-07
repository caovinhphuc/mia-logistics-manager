import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Shield,
  Bell,
  Globe,
  Palette,
  Clock,
  Save,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  Server,
  HardDrive,
  Wifi,
  Lock,
  Key,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  BarChart3,
  Users,
  Package,
  Truck,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  Edit,
  Trash,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionContext';
import WidgetWrapper from '../components/layout/WidgetWrapper';

interface SystemSetting {
  id: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select' | 'password';
  options?: string[];
  category: string;
  isAdvanced?: boolean;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  database: 'healthy' | 'warning' | 'error';
  lastBackup: string;
  uptime: string;
}

const SystemSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  // State management
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [filteredSettings, setFilteredSettings] = useState<SystemSetting[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Mock settings data
  useEffect(() => {
    setTimeout(() => {
      const mockSettings: SystemSetting[] = [
        // General Settings
        {
          id: 'company_name',
          name: 'Tên công ty',
          description: 'Tên hiển thị của công ty trong hệ thống',
          value: 'MIA Warehouse Management',
          type: 'text',
          category: 'general'
        },
        {
          id: 'timezone',
          name: 'Múi giờ',
          description: 'Múi giờ mặc định cho hệ thống',
          value: 'Asia/Ho_Chi_Minh',
          type: 'select',
          options: ['Asia/Ho_Chi_Minh', 'UTC', 'Asia/Singapore', 'Asia/Tokyo'],
          category: 'general'
        },
        {
          id: 'language',
          name: 'Ngôn ngữ',
          description: 'Ngôn ngữ mặc định của hệ thống',
          value: 'vi-VN',
          type: 'select',
          options: ['vi-VN', 'en-US', 'zh-CN', 'ja-JP'],
          category: 'general'
        },
        {
          id: 'maintenance_mode',
          name: 'Chế độ bảo trì',
          description: 'Bật chế độ bảo trì để ngăn người dùng truy cập',
          value: false,
          type: 'boolean',
          category: 'general'
        },

        // Security Settings
        {
          id: 'session_timeout',
          name: 'Thời gian hết phiên (phút)',
          description: 'Thời gian tự động đăng xuất khi không hoạt động',
          value: 30,
          type: 'number',
          category: 'security'
        },
        {
          id: 'password_policy',
          name: 'Chính sách mật khẩu mạnh',
          description: 'Yêu cầu mật khẩu phức tạp cho tài khoản mới',
          value: true,
          type: 'boolean',
          category: 'security'
        },
        {
          id: 'two_factor_auth',
          name: 'Xác thực hai yếu tố',
          description: 'Bắt buộc xác thực 2FA cho tất cả người dùng',
          value: false,
          type: 'boolean',
          category: 'security'
        },
        {
          id: 'api_rate_limit',
          name: 'Giới hạn API (requests/phút)',
          description: 'Số lượng request tối đa mỗi phút cho mỗi IP',
          value: 1000,
          type: 'number',
          category: 'security',
          isAdvanced: true
        },

        // Notification Settings
        {
          id: 'email_notifications',
          name: 'Thông báo email',
          description: 'Gửi thông báo hệ thống qua email',
          value: true,
          type: 'boolean',
          category: 'notifications'
        },
        {
          id: 'sms_notifications',
          name: 'Thông báo SMS',
          description: 'Gửi thông báo khẩn cấp qua SMS',
          value: false,
          type: 'boolean',
          category: 'notifications'
        },
        {
          id: 'notification_sound',
          name: 'Âm thanh thông báo',
          description: 'Phát âm thanh khi có thông báo mới',
          value: true,
          type: 'boolean',
          category: 'notifications'
        },
        {
          id: 'email_server',
          name: 'Máy chủ email SMTP',
          description: 'Địa chỉ máy chủ SMTP cho gửi email',
          value: 'smtp.gmail.com',
          type: 'text',
          category: 'notifications',
          isAdvanced: true
        },

        // Performance Settings
        {
          id: 'cache_enabled',
          name: 'Bộ nhớ đệm',
          description: 'Sử dụng bộ nhớ đệm để tăng tốc độ',
          value: true,
          type: 'boolean',
          category: 'performance'
        },
        {
          id: 'auto_backup',
          name: 'Sao lưu tự động',
          description: 'Tự động sao lưu dữ liệu hàng ngày',
          value: true,
          type: 'boolean',
          category: 'performance'
        },
        {
          id: 'backup_retention',
          name: 'Lưu trữ backup (ngày)',
          description: 'Số ngày lưu trữ file backup',
          value: 30,
          type: 'number',
          category: 'performance'
        },
        {
          id: 'log_level',
          name: 'Mức độ log',
          description: 'Chi tiết log hệ thống',
          value: 'info',
          type: 'select',
          options: ['error', 'warn', 'info', 'debug'],
          category: 'performance',
          isAdvanced: true
        },

        // Integration Settings
        {
          id: 'google_sheets_integration',
          name: 'Tích hợp Google Sheets',
          description: 'Đồng bộ dữ liệu với Google Sheets',
          value: true,
          type: 'boolean',
          category: 'integration'
        },
        {
          id: 'barcode_scanner',
          name: 'Máy quét mã vạch',
          description: 'Kích hoạt chức năng quét mã vạch',
          value: true,
          type: 'boolean',
          category: 'integration'
        },
        {
          id: 'api_endpoint',
          name: 'API Endpoint',
          description: 'URL endpoint cho API tích hợp bên ngoài',
          value: 'https://api.warehouse.com/v1',
          type: 'text',
          category: 'integration',
          isAdvanced: true
        }
      ];

      setSettings(mockSettings);
      setFilteredSettings(mockSettings.filter(s => s.category === 'general'));
      setIsLoading(false);
    }, 800);
  }, []);

  // Mock system health data
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth({
        cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
        memory: Math.floor(Math.random() * 40) + 40, // 40-80%
        disk: Math.floor(Math.random() * 20) + 60, // 60-80%
        network: Math.floor(Math.random() * 10) + 85, // 85-95%
        database: Math.random() > 0.8 ? 'warning' : 'healthy',
        lastBackup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        uptime: `${Math.floor(Math.random() * 30) + 1} ngày`
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter settings by category
  useEffect(() => {
    let filtered = settings.filter(setting => setting.category === selectedCategory);

    if (!showAdvanced) {
      filtered = filtered.filter(setting => !setting.isAdvanced);
    }

    setFilteredSettings(filtered);
  }, [settings, selectedCategory, showAdvanced]);

  const categories = [
    { id: 'general', name: 'Tổng quát', icon: Settings },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'performance', name: 'Hiệu năng', icon: Activity },
    { id: 'integration', name: 'Tích hợp', icon: Globe }
  ];

  const handleSettingChange = (settingId: string, newValue: string | number | boolean) => {
    setSettings(prev => prev.map(setting =>
      setting.id === settingId ? { ...setting, value: newValue } : setting
    ));
  };

  const handleSaveSettings = async () => {
    if (!hasPermission('system_config')) return;

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setLastSaved(new Date());
  };

  const getHealthColor = (value: number, type: 'cpu' | 'memory' | 'disk' | 'network') => {
    if (type === 'network') {
      return value >= 90 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600';
    }
    return value <= 50 ? 'text-green-600' : value <= 80 ? 'text-yellow-600' : 'text-red-600';
  };

  const getHealthBarColor = (value: number, type: 'cpu' | 'memory' | 'disk' | 'network') => {
    if (type === 'network') {
      return value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500';
    }
    return value <= 50 ? 'bg-green-500' : value <= 80 ? 'bg-yellow-500' : 'bg-red-500';
  };

  if (!hasPermission('system_settings')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có quyền truy cập</h3>
          <p className="text-gray-500">Bạn không có quyền truy cập vào cài đặt hệ thống.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt hệ thống</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Quản lý cấu hình và theo dõi tình trạng hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Lưu lần cuối: {lastSaved.toLocaleTimeString('vi-VN')}
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving || !hasPermission('system_config')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <RefreshCw size={20} className="mr-2 animate-spin" />
            ) : (
              <Save size={20} className="mr-2" />
            )}
            {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>      {/* System Health Dashboard */}      <WidgetWrapper
        widgetId="system-health"
        title="Tình trạng hệ thống"
        description="Theo dõi hiệu suất và tình trạng hoạt động của hệ thống"
        onRefresh={() => {
          setIsLoading(true);
          // Simulate refresh
          setTimeout(() => {
            setSystemHealth({
              cpu: Math.floor(Math.random() * 100),
              memory: Math.floor(Math.random() * 100),
              disk: Math.floor(Math.random() * 100),
              network: Math.floor(Math.random() * 100),
              database: ['healthy', 'warning', 'error'][Math.floor(Math.random() * 3)] as 'healthy' | 'warning' | 'error',
              lastBackup: new Date().toISOString(),
              uptime: '7 ngày 12 giờ'
            });
            setIsLoading(false);
          }, 1000);
        }}
        onToggleExpand={() => {}}
        headerActions={null}
      >
        {systemHealth ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPU Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">CPU</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(systemHealth.cpu, 'cpu')}`}>
                  {systemHealth.cpu}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getHealthBarColor(systemHealth.cpu, 'cpu')}`}
                  style={{ width: `${systemHealth.cpu}%` }}
                ></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">RAM</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(systemHealth.memory, 'memory')}`}>
                  {systemHealth.memory}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getHealthBarColor(systemHealth.memory, 'memory')}`}
                  style={{ width: `${systemHealth.memory}%` }}
                ></div>
              </div>
            </div>

            {/* Disk Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Server className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Disk</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(systemHealth.disk, 'disk')}`}>
                  {systemHealth.disk}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getHealthBarColor(systemHealth.disk, 'disk')}`}
                  style={{ width: `${systemHealth.disk}%` }}
                ></div>
              </div>
            </div>

            {/* Network */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Network</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(systemHealth.network, 'network')}`}>
                  {systemHealth.network}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getHealthBarColor(systemHealth.network, 'network')}`}
                  style={{ width: `${systemHealth.network}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Additional System Info */}
        {systemHealth && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Database className={`w-5 h-5 ${
                systemHealth.database === 'healthy' ? 'text-green-600' :
                systemHealth.database === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Database</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 capitalize">{systemHealth.database}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Uptime</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{systemHealth.uptime}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Last Backup</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {new Date(systemHealth.lastBackup).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          </div>
        )}
      </WidgetWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}        <div className="lg:col-span-1">          <WidgetWrapper
            widgetId="settings-categories"
            title="Danh mục"
            description="Chọn danh mục cài đặt"
            onRefresh={() => {}}
            onToggleExpand={() => {}}
            headerActions={null}
          >
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Advanced Settings Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAdvanced}
                  onChange={(e) => setShowAdvanced(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hiển thị cài đặt nâng cao
                </span>
              </label>
            </div>
          </WidgetWrapper>
        </div>        {/* Settings Content */}
        <div className="lg:col-span-3">          <WidgetWrapper
            widgetId="settings-content"
            title={categories.find(c => c.id === selectedCategory)?.name || 'Cài đặt'}
            description="Quản lý các thiết lập hệ thống"
            onRefresh={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
            onToggleExpand={() => {}}
            headerActions={null}
          >
            <div className="space-y-6">
              {filteredSettings.map((setting) => (
                <div key={setting.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <label htmlFor={`setting-${setting.id}`} className="block text-sm font-medium text-gray-900 dark:text-white">
                          {setting.name}
                          {setting.isAdvanced && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded">
                              Nâng cao
                            </span>
                          )}
                        </label>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {setting.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {setting.type === 'boolean' ? (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value as boolean}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            disabled={!hasPermission('system_config')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {setting.value ? 'Bật' : 'Tắt'}
                          </span>
                        </label>
                      ) : setting.type === 'select' ? (
                          <select
                          id={`setting-${setting.id}`}
                          value={setting.value as string}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          disabled={!hasPermission('system_config')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                          aria-label={setting.name}
                        >
                          {setting.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : setting.type === 'password' ? (
                        <div className="relative flex-1">
                          <input
                            type="password"
                            value={setting.value as string}
                            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                            disabled={!hasPermission('system_config')}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                            placeholder="••••••••"
                          />
                        </div>
                      ) : (
                        <input
                          id={`setting-${setting.id}`}
                          type={setting.type}
                          value={setting.value as string | number}
                          onChange={(e) => handleSettingChange(
                            setting.id,
                            setting.type === 'number' ? Number(e.target.value) : e.target.value
                          )}
                          disabled={!hasPermission('system_config')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                          placeholder={`Enter ${setting.name}`}
                          aria-label={setting.name}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredSettings.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Không có cài đặt nào
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy cài đặt nào trong danh mục này
                  </p>
                </div>
              )}
            </div>
          </WidgetWrapper>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
