import React, { useState, useEffect } from 'react';
import {
  User,
  UserPlus,
  Edit,
  Trash,
  Eye,
  Search,
  Shield,
  Mail,
  Phone,
  Activity,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionContext';
import WidgetWrapper from '../components/layout/WidgetWrapper';

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  efficiency: number;
  completedTasks: number;
  area: string;
  skills: string[];
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  newThisMonth: number;
}

const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  // State management
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers: UserData[] = [
        {
          id: 1,
          name: 'Nguyen Van Admin',
          username: 'admin',
          email: 'admin@warehouse.com',
          phone: '+84 901 234 567',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2023-01-01T00:00:00Z',
          efficiency: 98,
          completedTasks: 1250,
          area: 'All Areas',
          skills: ['Management', 'Analytics', 'System Admin']
        },
        {
          id: 2,
          name: 'Tran Thi Manager',
          username: 'manager1',
          email: 'manager@warehouse.com',
          phone: '+84 902 345 678',
          role: 'manager',
          status: 'active',
          lastLogin: '2024-01-15T09:15:00Z',
          createdAt: '2023-03-15T00:00:00Z',
          efficiency: 95,
          completedTasks: 890,
          area: 'Receiving',
          skills: ['Team Management', 'Quality Control', 'Training']
        },
        {
          id: 3,
          name: 'Le Van Staff',
          username: 'staff1',
          email: 'staff1@warehouse.com',
          phone: '+84 903 456 789',
          role: 'staff',
          status: 'active',
          lastLogin: '2024-01-15T08:45:00Z',
          createdAt: '2023-06-01T00:00:00Z',
          efficiency: 87,
          completedTasks: 567,
          area: 'Picking',
          skills: ['Order Picking', 'Inventory', 'Equipment Operation']
        },
        {
          id: 4,
          name: 'Pham Thi Trainee',
          username: 'trainee1',
          email: 'trainee@warehouse.com',
          phone: '+84 904 567 890',
          role: 'staff',
          status: 'pending',
          lastLogin: 'Never',
          createdAt: '2024-01-10T00:00:00Z',
          efficiency: 0,
          completedTasks: 0,
          area: 'Training',
          skills: ['Basic Operations']
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Calculate stats
  const stats: UserStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
    newThisMonth: users.filter(u => {
      const created = new Date(u.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staff': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <UserX size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  // Refresh function for widgets
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (!hasPermission('user_management')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có quyền truy cập</h3>
          <p className="text-gray-500">Bạn không có quyền truy cập vào trang quản lý người dùng.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Quản lý tài khoản, phân quyền và theo dõi hoạt động của người dùng
          </p>
        </div>
        {hasPermission('user_create') && (
          <button
            onClick={() => setShowUserModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={20} className="mr-2" />
            Thêm người dùng
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WidgetWrapper
          widgetId="user-total-stats"
          title="Tổng người dùng"
          description="Tổng số nhân viên trong hệ thống"
          isRefreshable={true}
          onRefresh={handleRefresh}
          onToggleExpand={() => {}}
          headerActions={<></>}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : stats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                +{stats.newThisMonth} tháng này
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </WidgetWrapper>

        <WidgetWrapper
          widgetId="user-active-stats"
          title="Đang hoạt động"
          description="Nhân viên đang hoạt động"
          isRefreshable={true}
          onRefresh={handleRefresh}
          onToggleExpand={() => {}}
          headerActions={<></>}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : stats.active}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% tổng số
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </WidgetWrapper>

        <WidgetWrapper
          widgetId="user-pending-stats"
          title="Chờ duyệt"
          description="Nhân viên chờ phê duyệt"
          isRefreshable={true}
          onRefresh={handleRefresh}
          onToggleExpand={() => {}}
          headerActions={<></>}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : stats.pending}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Cần xử lý
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </WidgetWrapper>

        <WidgetWrapper
          widgetId="user-efficiency-stats"
          title="Hiệu suất trung bình"
          description="Hiệu suất làm việc trung bình"
          isRefreshable={true}
          onRefresh={handleRefresh}
          onToggleExpand={() => {}}
          headerActions={<></>}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? '...' : users.length > 0 ? (users.reduce((acc, u) => acc + u.efficiency, 0) / users.length).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Tất cả người dùng
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </WidgetWrapper>
      </div>

      {/* Filters and Search */}
      <WidgetWrapper
        widgetId="user-filters"
        title="Bộ lọc và tìm kiếm"
        description="Tìm kiếm và lọc danh sách người dùng"
        onRefresh={handleRefresh}
        onToggleExpand={() => {}}
        headerActions={<></>}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc username..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            aria-label="Lọc theo vai trò"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </select>
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="pending">Chờ duyệt</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Hiển thị dạng lưới"
              aria-label="Hiển thị dạng lưới"
            >
              <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Hiển thị dạng danh sách"
              aria-label="Hiển thị dạng danh sách"
            >
              <div className="w-5 h-5 flex flex-col gap-1">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </WidgetWrapper>

      {/* Users List/Grid */}
      <WidgetWrapper
        widgetId="user-list"
        title={`Danh sách người dùng (${filteredUsers.length})`}
        description="Quản lý thông tin chi tiết người dùng"
        isRefreshable={true}
        onRefresh={handleRefresh}
        onToggleExpand={() => {}}
        headerActions={<></>}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userData) => (
              <div
                key={userData.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{userData.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">@{userData.username}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 ${getStatusColor(userData.status)}`}>
                    {getStatusIcon(userData.status)}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail size={16} className="mr-2" />
                    {userData.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone size={16} className="mr-2" />
                    {userData.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Activity size={16} className="mr-2" />
                    Hiệu suất: {userData.efficiency}%
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(userData.role)}`}>
                    {userData.role}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedUser(userData)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                    {hasPermission('user_edit') && (
                      <button
                        onClick={() => {
                          setSelectedUser(userData);
                          setShowUserModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Người dùng</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Vai trò</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Hiệu suất</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Đăng nhập cuối</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userData) => (
                  <tr key={userData.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{userData.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{userData.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(userData.role)}`}>
                        {userData.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`flex items-center space-x-1 ${getStatusColor(userData.status)}`}>
                        {getStatusIcon(userData.status)}
                        <span className="text-sm font-medium capitalize">{userData.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${userData.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {userData.efficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {userData.lastLogin === 'Never' ? 'Chưa đăng nhập' : new Date(userData.lastLogin).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(userData)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        {hasPermission('user_edit') && (
                          <button
                            onClick={() => {
                              setSelectedUser(userData);
                              setShowUserModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {hasPermission('user_delete') && userData.id !== user?.id && (
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                                setUsers(users.filter(u => u.id !== userData.id));
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Xóa"
                          >
                            <Trash size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Không tìm thấy người dùng
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </WidgetWrapper>
    </div>
  );
};

export default UserManagementPage;
