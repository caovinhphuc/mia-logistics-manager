import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  UserPlus,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Settings,
  Edit,
  Trash,
  Key,
  Save,
  X,
  Package,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionContext";

// Type definitions
interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  status: string;
  email: string;
  phone: string;
  skills: string[];
  area: string;
  handlingP1: boolean;
  efficiency: number;
  lastLogin: string;
  displayName?: string;
  fullName?: string;
}

interface RoleData {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
}

// Simple error logging function
const logError = (error: any) => {
  console.error('MainLayout Error:', error);
};

// Hook wrappers with proper typing
const useAuthTyped = () => {
  const auth = useAuth();
  return {
    ...auth,
    login: auth.login || ((username: string, password: string) => Promise.resolve()),
    logout: auth.logout || (() => {}),
    user: auth.user || null,
    isLoading: auth.isLoading || false,
  };
};

const usePermissionsTyped = () => {
  const permissions = usePermissions();
  return {
    ...permissions,
    getRoleInfo: () => ({ name: "User" })
  };
};

// Login component
const LoginView: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string>("");

  const { login } = useAuthTyped();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    try {
      if (username === "admin" && password === "admin123") {
        await login(username, password);
        console.debug("Demo login successful");
        setLocalError("");
        setUsername("");
        setPassword("");
        setShowPassword(false);
        setRemember(false);
      } else {
        setLocalError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      logError({ message: "Login error", error });
      setLocalError("Lỗi đăng nhập: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <User size={32} className="text-blue-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Đăng nhập hệ thống
            </h2>

            {localError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {localError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đăng nhập để quản lý SLA và phân bổ đơn hàng
              </p>
              <p className="text-xs text-gray-500 mt-1">
                © 2025 MIA.vn - Warehouse Management System
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
          <p className="text-xs text-blue-800 font-medium mb-1">
            Thông tin đăng nhập demo:
          </p>
          <ul className="text-xs text-blue-700 ml-5 list-disc">
            <li>Tài khoản: admin</li>
            <li>Mật khẩu: admin123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// User Management component
const UserManagementView: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "settings">("users");
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleData, setSelectedRoleData] = useState<RoleData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { logout, user: currentUser } = useAuthTyped();
  const permissionContext = usePermissionsTyped();
  const roleInfo = permissionContext.getRoleInfo();

  // Sample data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Nguyễn Văn Admin",
      username: "admin",
      role: "admin",
      status: "active",
      email: "admin@mia.vn",
      phone: "0901234567",
      skills: ["vali", "balo", "phụ kiện", "đóng gói"],
      area: "HN",
      handlingP1: true,
      efficiency: 100,
      lastLogin: "06/04/2025 08:45",
    },
    {
      id: 2,
      name: "Trần Thị Manager",
      username: "manager",
      role: "manager",
      status: "active",
      email: "manager@mia.vn",
      phone: "0901234568",
      skills: ["vali", "balo", "đóng gói"],
      area: "HN",
      handlingP1: true,
      efficiency: 98,
      lastLogin: "06/04/2025 08:30",
    },
  ]);

  const [roles, setRoles] = useState<RoleData[]>([
    {
      id: "admin",
      name: "Quản trị viên",
      color: "bg-purple-100 text-purple-800",
      description: "Toàn quyền hệ thống",
      permissions: [
        "manage_users",
        "manage_roles",
        "view_all",
        "config_sla",
        "manage_system",
      ],
    },
    {
      id: "manager",
      name: "Trưởng phòng",
      color: "bg-blue-100 text-blue-800",
      description: "Quản lý kho vận",
      permissions: [
        "view_all",
        "assign_orders",
        "manage_staff",
        "view_reports",
      ],
    },
  ]);

  const handleLogout = () => {
    try {
      if (logout) {
        logout();
      } else {
        console.error("Logout function not available");
      }
    } catch (error) {
      logError({ message: "Logout error", error });
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (selectedRole !== "all" && user.role !== selectedRole) {
      return false;
    }

    if (selectedStatus !== "all" && user.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Handler functions
  const handleAddUser = () => {
    setSelectedUser(null);
    setUserFormOpen(true);
  };

  const handleEditUser = (user: User): void => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };

  const handleDeleteUser = (user: User): void => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleResetPassword = (user: User): void => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const renderUsersTab = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Quản lý người dùng</h3>
          <button
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
            onClick={handleAddUser}
            type="button"
          >
            <UserPlus size={16} className="mr-1" />
            <span>Thêm người dùng</span>
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, username, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="roleFilter" className="mb-1 text-sm text-gray-700">Lọc theo vai trò</label>
            <select
              id="roleFilter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="manager">Trưởng phòng</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="statusFilter" className="mb-1 text-sm text-gray-700">Lọc theo trạng thái</label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đăng nhập gần nhất
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "manager"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Quản trị viên"
                        : user.role === "manager"
                          ? "Trưởng phòng"
                          : "Nhân viên"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Chỉnh sửa"
                      onClick={() => handleEditUser(user)}
                      type="button"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 mr-3"
                      title="Xóa"
                      onClick={() => handleDeleteUser(user)}
                      type="button"
                    >
                      <Trash size={16} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="Đặt lại mật khẩu"
                      onClick={() => handleResetPassword(user)}
                      type="button"
                    >
                      <Key size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              Không tìm thấy người dùng nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRolesTab = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Quản lý vai trò</h3>
          <button
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
            onClick={() => setRoleFormOpen(true)}
            type="button"
          >
            <UserPlus size={16} className="mr-1" />
            <span>Thêm vai trò</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        {roles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Shield size={48} className="opacity-50" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Chưa có vai trò nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Bắt đầu bằng cách tạo vai trò mới cho hệ thống.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className={`p-4 ${role.color
                    .replace("text-", "bg-")
                    .replace("100", "50")}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${role.color}`}
                      >
                        {role.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {role.description}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="text-gray-600 hover:text-gray-800 mr-2"
                        onClick={() => setRoleFormOpen(true)}
                        type="button"
                        aria-label="Edit role"
                      >
                        <Edit size={16} />
                      </button>
                      {role.id !== "admin" && (
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          type="button"
                          aria-label="Delete role"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Quyền hạn:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                      >
                        {permission}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Cài đặt hệ thống</h3>
          <button
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
            type="button"
          >
            <Save size={16} className="mr-1" />
            <span>Lưu tất cả cài đặt</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div>
          <label htmlFor="minPasswordLength" className="block text-sm font-medium text-gray-700 mb-1">
            Độ dài tối thiểu
          </label>
          <input
            id="minPasswordLength"
            type="number"
            defaultValue="8"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="minPasswordLengthDescription"
          />
          <p id="minPasswordLengthDescription" className="text-xs text-gray-500 mt-1">Số ký tự tối thiểu cho mật khẩu</p>
        </div>

        <div className="mt-4">
          <label htmlFor="passwordExpiryDays" className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian hết hạn (ngày)
          </label>
          <input
            id="passwordExpiryDays"
            type="number"
            defaultValue="90"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center" htmlFor="requireSpecialChar">
            <input
              id="requireSpecialChar"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-describedby="specialCharDescription"
            />
            <span className="ml-2 text-sm text-gray-700">
              Yêu cầu ký tự đặc biệt
            </span>
          </label>
          <p id="specialCharDescription" className="text-xs text-gray-500 mt-1 ml-6">Mật khẩu phải chứa ít nhất một ký tự đặc biệt</p>
        </div>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-2 flex justify-between items-center bg-white">
        <div>
          <span className="font-medium">
            {currentUser?.name || "User"}
          </span>
          <span className="text-sm ml-2 text-gray-500">
            ({roleInfo?.name || "User"})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm flex items-center hover:bg-red-100"
            type="button"
          >
            <LogOut size={14} className="mr-1" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b">
        <div className="flex space-x-8 px-4">
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === "users"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            onClick={() => setActiveTab("users")}
            type="button"
          >
            <User size={16} className="inline mr-1" />
            Người dùng
          </button>
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === "roles"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            onClick={() => setActiveTab("roles")}
            type="button"
          >
            <Shield size={16} className="inline mr-1" />
            Vai trò
          </button>
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === "settings"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            onClick={() => setActiveTab("settings")}
            type="button"
          >
            <Settings size={16} className="inline mr-1" />
            Cài đặt
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="m-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {activeTab === "users" && renderUsersTab()}
          {activeTab === "roles" && renderRolesTab()}
          {activeTab === "settings" && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

// Main component
const MainLayoutUser: React.FC = () => {
  const [activeView, setActiveView] = useState<"login" | "userManagement">("login");
  const { user: currentUser, isLoading } = useAuthTyped();

  useEffect(() => {
    if (!isLoading && currentUser) {
      setActiveView("userManagement");
    } else {
      setActiveView("login");
    }
  }, [isLoading, currentUser]);

  const renderView = () => {
    switch (activeView) {
      case "login":
        return <LoginView />;
      case "userManagement":
        return <UserManagementView />;
      default:
        return <LoginView />;
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-gray-50">
      <div className="bg-gray-800 text-white p-4">
        <h3 className="text-lg font-medium">Module Đăng nhập và Quản lý người dùng</h3>
        <p className="text-sm text-gray-300">Dashboard SLA & Phân bổ Đơn hàng - MIA.vn</p>
      </div>
      {renderView()}
    </div>
  );
};

export default MainLayoutUser;
