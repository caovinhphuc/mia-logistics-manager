// PermissionsTab.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Shield, Users, EyeOff, Edit, Trash2, CheckSquare,
  XCircle, PlusCircle, Save, RefreshCw, Search,
  Download,  AlertTriangle
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../config/systemConfig';
// Import các context cần thiết
import { AuthContext } from '../context/AuthContext';

// ==================== PERMISSIONS TAB COMPONENT ====================
const PermissionsTab = ({ themeClasses }) => {

  // Workaround for SearchIcon - sử dụng Search nhưng đổi tên để tránh conflict
const SearchIcon = Search;

  // Sử dụng context để cập nhật quyền khi thay đổi
  const { refreshUserPermissions } = useContext(AuthContext);

  // State cho quản lý roles và permissions
  const [roles, setRoles] = useState(() => {
    // Khởi tạo từ SYSTEM_CONFIG hoặc localStorage nếu có
    const savedRoles = localStorage.getItem('warehouse_roles');
    return savedRoles ? JSON.parse(savedRoles) : SYSTEM_CONFIG.ROLES;
  });

  // State cho các module trong hệ thống
  const [modules, setModules] = useState([
    { id: 'dashboard', name: 'Tổng quan', description: 'Xem dashboard và metrics' },
    { id: 'orders', name: 'Quản lý đơn hàng', description: 'Xem và quản lý đơn hàng' },
    { id: 'staff', name: 'Quản lý nhân sự', description: 'Xem và quản lý thông tin nhân sự' },
    { id: 'analytics', name: 'Phân tích & Báo cáo', description: 'Xem báo cáo và phân tích dữ liệu' },
    { id: 'settings', name: 'Cài đặt hệ thống', description: 'Cấu hình và thiết lập hệ thống' },
    { id: 'reports', name: 'Báo cáo', description: 'Tạo và xuất báo cáo' },
    { id: 'permissions', name: 'Phân quyền', description: 'Quản lý phân quyền hệ thống' },
    { id: 'profile', name: 'Hồ sơ cá nhân', description: 'Xem và cập nhật thông tin cá nhân' }
  ]);
  // State cho chức năng tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State cho chức năng thêm mới và chỉnh sửa
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // State cho modal xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // State cho thông báo
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Hiển thị thông báo
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };
  // Lưu roles vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('warehouse_roles', JSON.stringify(roles));

    // Cập nhật permissions cho người dùng hiện tại nếu có thay đổi
    refreshUserPermissions();

    // Kích hoạt sự kiện storage để các tab khác cũng nhận được thay đổi
    window.dispatchEvent(new Event('storage'));
  }, [roles, refreshUserPermissions]);

  // Xử lý chọn role
  const handleSelectRole = (roleId) => {
    const role = Object.values(roles).find(r => r.id === roleId);
    setSelectedRole(role);
    setEditedRole({ ...role });
    setEditMode(false);
  };

  // Xử lý thay đổi permission
  const handlePermissionChange = (permissionId) => {
    if (!editMode) return;

    setEditedRole(prev => {
      const updatedPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];

      return {
        ...prev,
        permissions: updatedPermissions
      };
    });
  };

  // Lưu thay đổi
  const handleSaveChanges = () => {
    if (isCreatingNew) {
      // Thêm role mới
      const updatedRoles = {
        ...roles,
        [editedRole.id.toUpperCase()]: editedRole
      };
      setRoles(updatedRoles);
      showNotification(`Đã tạo vai trò ${editedRole.label} thành công!`);
    } else {
      // Cập nhật role đã có
      const updatedRoles = {
        ...roles,
        [editedRole.id.toUpperCase()]: editedRole
      };
      setRoles(updatedRoles);
      showNotification(`Đã cập nhật vai trò ${editedRole.label} thành công!`);
    }

    setEditMode(false);
    setIsCreatingNew(false);
    setSelectedRole(editedRole);
  };

  // Xử lý xóa role
  const handleDeleteRole = () => {
    if (Object.keys(roles).length <= 1) {
      showNotification('Không thể xóa vai trò cuối cùng trong hệ thống!', 'error');
      setShowDeleteConfirm(false);
      return;
    }

    const { [roleToDelete.id.toUpperCase()]: roleToRemove, ...remainingRoles } = roles;
    setRoles(remainingRoles);
    setSelectedRole(null);
    setEditedRole(null);
    setShowDeleteConfirm(false);
    showNotification(`Đã xóa vai trò ${roleToDelete.label} thành công!`);
  };

  // Tạo role mới
  const handleCreateNewRole = () => {
    const newRole = {
      id: `role_${Date.now()}`,
      label: 'Vai trò mới',
      permissions: []
    };
    setEditedRole(newRole);
    setSelectedRole(null);
    setEditMode(true);
    setIsCreatingNew(true);
  };

  // Lọc modules theo tìm kiếm
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'all') return matchesSearch;

    const hasPermission = selectedRole?.permissions.includes(module.id);
    if (filterType === 'granted') return matchesSearch && hasPermission;
    if (filterType === 'denied') return matchesSearch && !hasPermission;

    return matchesSearch;
  });

  // Xuất cấu hình phân quyền
  const handleExportConfig = () => {
    const dataStr = JSON.stringify(roles, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'warehouse_roles_config.json');
    linkElement.click();

    showNotification('Đã xuất cấu hình phân quyền thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary}`}>
            Quản lý phân quyền
          </h1>
          <p className={`mt-1 ${themeClasses.text.muted}`}>
            Thiết lập và quản lý vai trò, quyền hạn trong hệ thống
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateNewRole}
            className={`px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2`}
          >
            <PlusCircle size={16} />
            <span>Thêm vai trò mới</span>
          </button>

          <button
            onClick={handleExportConfig}
            className={`px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} border hover:${themeClasses.surfaceHover} transition-colors flex items-center gap-2`}
          >
            <Download size={16} />
            <span>Xuất cấu hình</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - Roles list */}
        <div className={`w-full lg:w-1/4 ${themeClasses.surface} ${themeClasses.border} border rounded-xl p-4 shadow-sm`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users size={18} className="mr-2" />
            Vai trò hệ thống
          </h2>

          <div className="space-y-2">
            {Object.values(roles).map((role) => (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between
                  ${selectedRole?.id === role.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500'
                    : `${themeClasses.surfaceHover} hover:shadow-md`}
                `}
              >
                <div className="flex items-center">
                  <Shield size={16} className={`mr-2 ${selectedRole?.id === role.id ? 'text-blue-600' : ''}`} />
                  <div>
                    <div className="font-medium">{role.label}</div>
                    <div className={`text-xs ${themeClasses.text.muted}`}>
                      {role.permissions.length} quyền
                    </div>
                  </div>
                </div>

                {editMode && selectedRole?.id === role.id && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Đang chỉnh sửa
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right content - Permissions */}
        <div className={`flex-1 ${themeClasses.surface} ${themeClasses.border} border rounded-xl p-4 shadow-sm`}>
          {!selectedRole && !isCreatingNew ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <Shield size={48} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chọn vai trò để xem chi tiết phân quyền</h3>
              <p className={`${themeClasses.text.muted} max-w-md`}>
                Chọn một vai trò từ danh sách bên trái hoặc tạo vai trò mới để thiết lập quyền hạn
              </p>
            </div>
          ) : (
            <>
              {/* Role header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  {editMode ? (
                    <input
                      type="text"
                      value={editedRole.label}
                      onChange={(e) => setEditedRole({...editedRole, label: e.target.value})}
                      className={`text-xl font-bold px-2 py-1 rounded ${themeClasses.input} w-full sm:w-auto`}
                    />
                  ) : (
                    <h2 className="text-xl font-bold flex items-center">
                      <Shield size={20} className="mr-2 text-blue-600" />
                      {selectedRole?.label || editedRole?.label}
                    </h2>
                  )}
                  <p className={`mt-1 ${themeClasses.text.muted}`}>
                    {editMode ? 'Chỉnh sửa quyền hạn cho vai trò này' : 'Danh sách quyền hạn cho vai trò này'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleSaveChanges}
                        className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Save size={16} />
                        <span>Lưu thay đổi</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setIsCreatingNew(false);
                          if (selectedRole) setEditedRole({...selectedRole});
                        }}
                        className={`px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} border hover:${themeClasses.surfaceHover} transition-colors flex items-center gap-2`}
                      >
                        <XCircle size={16} />
                        <span>Hủy</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Edit size={16} />
                        <span>Chỉnh sửa</span>
                      </button>
                      {!isCreatingNew && (
                        <button
                          onClick={() => {
                            setRoleToDelete(selectedRole);
                            setShowDeleteConfirm(true);
                          }}
                          className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          <span>Xóa</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Search and filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm module..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${themeClasses.input} pl-10 pr-4 py-2 rounded-lg w-full`}
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`${themeClasses.input} px-4 py-2 rounded-lg`}
                  >
                    <option value="all">Tất cả</option>
                    <option value="granted">Đã cấp quyền</option>
                    <option value="denied">Chưa cấp quyền</option>
                  </select>

                  <button
                    onClick={() => setSearchTerm('')}
                    className={`px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} border hover:${themeClasses.surfaceHover} transition-colors`}
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Modules/Permissions list */}
              <div className="space-y-2 mt-6">
                {filteredModules.length === 0 ? (
                  <div className="text-center py-8">
                    <SearchIcon size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className={`${themeClasses.text.muted}`}>Không tìm thấy module phù hợp</p>
                  </div>
                ) : (
                  filteredModules.map((module) => {
                    const hasPermission = editedRole?.permissions.includes(module.id);
                    return (
                      <div
                        key={module.id}
                        onClick={() => editMode && handlePermissionChange(module.id)}
                        className={`p-4 rounded-lg transition-colors ${themeClasses.border} border
                          ${editMode ? 'cursor-pointer hover:shadow-md' : ''}
                          ${hasPermission
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
                            : `${themeClasses.surface}`}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="font-semibold">{module.name}</h3>
                              <div className={`ml-2 text-xs px-2 py-0.5 rounded
                                ${hasPermission
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
                              `}>
                                {module.id}
                              </div>
                            </div>
                            <p className={`mt-1 text-sm ${themeClasses.text.muted}`}>
                              {module.description}
                            </p>
                          </div>

                          <div className="ml-4">
                            {hasPermission ? (
                              <CheckSquare
                                size={20}
                                className={`text-green-600 ${editMode ? 'hover:text-green-700' : ''}`}
                              />
                            ) : (
                              <EyeOff
                                size={20}
                                className={`text-gray-400 ${editMode ? 'hover:text-gray-500' : ''}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className={`${themeClasses.surface} rounded-xl p-6 max-w-md mx-4 shadow-xl`}>
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Xác nhận xóa vai trò</h3>
            </div>

            <p className={`${themeClasses.text.primary} mb-6`}>
              Bạn có chắc chắn muốn xóa vai trò <strong>{roleToDelete?.label}</strong>?
              Hành động này không thể hoàn tác và có thể ảnh hưởng đến người dùng đang có vai trò này.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} border hover:${themeClasses.surfaceHover} transition-colors`}
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Xóa vai trò
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm animate-fade-in transition-all
          ${notification.type === 'success'
            ? 'bg-green-100 border-l-4 border-green-500 text-green-800 dark:bg-green-900/80 dark:text-green-100'
            : 'bg-red-100 border-l-4 border-red-500 text-red-800 dark:bg-red-900/80 dark:text-red-100'
          }
        `}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default PermissionsTab;



// ==================== EXPORTS ====================

