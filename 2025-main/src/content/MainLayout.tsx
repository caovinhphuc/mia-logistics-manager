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
  fullName?: string;
}

interface RoleData {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
}

// Simple error logging function with proper typing
const logError = (errorData: { message: string; error?: unknown; source?: string }) => {
  console.error('MainLayout Error:', errorData);
};

// Hook wrappers with proper typing
const useAuthTyped = () => {
  const auth = useAuth();
  return {
    ...auth,
    user: auth.user || null,
    isLoading: auth.isLoading || false,
    metrics: {} // Replace with actual metrics if available
  };
};

const usePermissionsTyped = () => {
  const permissions = usePermissions();
  return {
    ...permissions,
    hasPermission: permissions?.hasPermission || (() => false),
    canAccess: permissions?.canAccess || (() => false),
    permissions: permissions?.permissions || [],
    getUserPermissions: permissions?.getUserPermissions || (() => []),
    getUserRole: permissions?.getUserRole || (() => null),
  };
};

// Main component
const MainLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<"login" | "userManagement">("login");
  const { user: currentUser, isLoading } = useAuthTyped();
  const authMetrics = useAuthTyped().metrics;
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setActiveView("userManagement");
    } else {
      setActiveView("login");
    }
  }, [isLoggedIn, currentUser]);

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

// Login component
const LoginView: React.FC = () => {

  const [username, setUsername] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [localUsername, setLocalUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string>("");
  const logError = (errorData: { message: string; error?: unknown; source?: string }) => {
    console.error('LoginView Error:', errorData);
  };
  useEffect(() => {
    // Load saved username if available
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setLocalUsername(savedUsername);
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    // Save username to localStorage if remember is checked
    if (remember) {
      localStorage.setItem("savedUsername", username);
    } else {
      localStorage.removeItem("savedUsername");
    }
  }, [remember, username]);

  // Auth context
  const { user, isLoading, metrics } = useAuthTyped();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    console.debug("User already logged in, redirecting to user management view");
    return <UserManagementView />;
  }

  console.debug("Rendering LoginView");

  const { login } = useAuthTyped();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    const startTime = performance.now();

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
      const endTime = performance.now();
      console.debug(`Login process in UI took ${endTime - startTime}ms`);
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-4 text-center">
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
  const { logout, user: currentUser } = useAuthTyped();
  const permissionContext = usePermissionsTyped();
  const userRole = permissionContext.getUserRole();

  // State management
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "settings">("users");
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [selectedRoleData, setSelectedRoleData] = useState<RoleData | null>(null);

  // Sample data
  const [users, setUsers] = useState([
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
    {
      id: 3,
      name: "Lê Văn Supervisor",
      username: "supervisor",
      role: "supervisor",
      status: "active",
      email: "supervisor@mia.vn",
      phone: "0901234569",
      skills: ["vali", "phụ kiện"],
      area: "A",
      handlingP1: true,
      efficiency: 95,
      lastLogin: "05/04/2025 17:20",
    },
    {
      id: 4,
      name: "Phạm Thị Staff",
      username: "staff1",
      role: "staff",
      status: "active",
      email: "staff1@mia.vn",
      phone: "0901234570",
      skills: ["balo", "phụ kiện"],
      area: "B",
      handlingP1: false,
      efficiency: 92,
      lastLogin: "06/04/2025 07:50",
    },
    {
      id: 5,
      name: "Hoàng Văn Staff",
      username: "staff2",
      role: "staff",
      status: "inactive",
      email: "staff2@mia.vn",
      phone: "0901234571",
      skills: ["balo", "đóng gói"],
      area: "C",
      handlingP1: false,
      efficiency: 90,
      lastLogin: "01/04/2025 09:15",
    },
  ]);

  const [roles, setRoles] = useState([
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
    {
      id: "supervisor",
      name: "Giám sát khu vực",
      color: "bg-green-100 text-green-800",
      description: "Quản lý khu vực",
      permissions: ["view_area", "assign_area_orders", "manage_area_staff"],
    },
    {
      id: "staff",
      name: "Nhân viên kho vận",
      color: "bg-yellow-100 text-yellow-800",
      description: "Xử lý đơn hàng",
      permissions: ["view_assigned", "process_orders"],
    },
  ]);

  const handleLogout = () => {
    try {
      if (logout) {
        logout();
      } else {
        console.error("Logout function not available");
      }    } catch (error) {
      logError({
        message: "Logout error",
        error,
        source: "UserManagementView.handleLogout"
      });
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

  const confirmDeleteUser = (): void => {
    try {
      if (!selectedUser) {
        console.error("No user selected for deletion");
        return;
      }

      const updatedUsers = users.filter((u) => u.id !== selectedUser.id);
      setUsers(updatedUsers);

      setSuccessMessage(
        `Đã xóa người dùng ${selectedUser.username} thành công`
      );
      setTimeout(() => setSuccessMessage(""), 3000);      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      logError({
        message: "Error deleting user",
        error,
        source: "UserManagementView.confirmDeleteUser"
      });
      setSuccessMessage("");
    }
  };

  const confirmResetPassword = (newPassword: string): void => {
    try {
      if (!selectedUser) {
        console.error("No user selected for password reset");
        return;
      }

      console.debug(`Resetting password for user ${selectedUser.username}`);

      setSuccessMessage(
        `Đã đặt lại mật khẩu cho người dùng ${selectedUser.username} thành công`
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      setIsPasswordModalOpen(false);
      setSelectedUser(null);    } catch (error) {
      logError({
        message: "Error resetting password",
        error,
        source: "UserManagementView.confirmResetPassword"
      });
      setSuccessMessage("");
    }
  };

  const handleSaveUser = (userData: Partial<User>): void => {
    try {
      if (!userData) {
        console.error("No user data provided");
        return;
      }

      if (selectedUser) {
        const updatedUsers = users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...userData } : u
        );
        setUsers(updatedUsers);
        setSuccessMessage(
          `Đã cập nhật thông tin người dùng ${
            userData.username || ""
          } thành công`
        );
      } else {
        const newUser = {
          id: users.length + 1,
          name: userData.name || "",
          username: userData.username || "",
          role: userData.role || "staff",
          email: userData.email || "",
          phone: userData.phone || "",
          skills: userData.skills || [],
          area: userData.area || "",
          handlingP1: userData.handlingP1 || false,
          efficiency: userData.efficiency || 90,
          lastLogin: "-",
          status: "active",
          ...userData,
        };
        setUsers([...users, newUser]);
        setSuccessMessage(
          `Đã thêm người dùng ${userData.username || ""} thành công`
        );
      }

      setTimeout(() => setSuccessMessage(""), 3000);
      setUserFormOpen(false);
      setSelectedUser(null);    } catch (error) {
      logError({
        message: "Error saving user",
        error,
        source: "UserManagementView.handleSaveUser"
      });
      setSuccessMessage("");
    }
  };

  const handleChangeUserStatus = (userId: number, newStatus: string): void => {
    try {
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);
      setSuccessMessage("Đã cập nhật trạng thái người dùng thành công");
      setTimeout(() => setSuccessMessage(""), 3000);    } catch (error) {
      logError({
        message: "Error changing user status",
        error,
        source: "MainLayout.handleChangeUserStatus"
      });
    }
  };

  // Role management functions
  const handleAddRole = (): void => {
    try {
      setSelectedRoleData(null);
      setRoleFormOpen(true);    } catch (error) {
      logError({
        message: "Error adding role",
        error,
        source: "MainLayout.handleAddRole"
      });
    }
  };

  const handleEditRole = (roleId: string): void => {
    try {
      const roleToEdit = roles.find((role) => role.id === roleId);
      if (roleToEdit) {
        setSelectedRoleData(roleToEdit);
        setRoleFormOpen(true);
      }    } catch (error) {
      logError({
        message: "Error editing role",
        error,
        source: "MainLayout.handleEditRole"
      });
    }
  };

  const handleSaveRole = (roleData: Partial<RoleData>): void => {
    try {
      if (selectedRoleData) {
        const updatedRoles = roles.map((r) =>
          r.id === selectedRoleData.id ? { ...r, ...roleData } : r
        );
        setRoles(updatedRoles);
        setSuccessMessage(`Đã cập nhật vai trò ${roleData.name} thành công`);
      } else {
        const newRole = {
          id: roleData.id || `role_${roles.length + 1}`,
          name: roleData.name || "New Role",
          description: roleData.description || "New role description",
          color: roleData.color || "bg-blue-100 text-blue-800",
          permissions: roleData.permissions || [],
        };
        setRoles([...roles, newRole]);
        setSuccessMessage(`Đã thêm vai trò ${roleData.name} thành công`);
      }

      setTimeout(() => setSuccessMessage(""), 3000);
      setRoleFormOpen(false);
      setSelectedRoleData(null);    } catch (error) {
      logError({
        message: "Error saving role",
        error,
        source: "MainLayout.handleSaveRole"
      });
    }
  };

  const handleDeleteRole = (roleId: string): void => {
    try {
      if (!roleId) {
        console.error("No role ID provided for deletion");
        return;
      }

      const updatedRoles = roles.filter((role) => role.id !== roleId);
      setRoles(updatedRoles);

            setSuccessMessage("Đã xóa vai trò thành công");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      logError({
        message: "Error deleting role",
        error,
        source: "UserManagementView.handleDeleteRole"
      });
      setSuccessMessage("");
    }
  };
  // Settings functions
  const handleSaveSettings = (settingType: string): void => {
    try {
      console.debug(`Lưu cài đặt ${settingType}`);
      setSuccessMessage(`Đã lưu cài đặt ${settingType} thành công`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      logError({
        message: "Error saving settings",
        error,
        source: "MainLayout.handleSaveSettings"
      });
    }
  };

  const handleResetSettings = (settingType: string): void => {
    try {
      console.debug(`Đặt lại cài đặt ${settingType}`);
      setSuccessMessage(`Đã đặt lại cài đặt ${settingType} về mặc định`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      logError({
        message: "Error resetting settings",
        error,
        source: "MainLayout.handleResetSettings"
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-2 flex justify-between items-center bg-white">        <div>
          <span className="font-medium">
            {currentUser?.name || "User"}
          </span>
          <span className="text-sm ml-2 text-gray-500">
            ({userRole || "User"})
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
            Phân quyền
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

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm flex justify-between items-center">
            <div className="flex items-center">
              <Info size={16} className="mr-2" />
              {successMessage}
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-500 hover:text-green-700"
              type="button"
              aria-label="Close success message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-500 hover:text-red-700"
              type="button"
              aria-label="Close error message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Tab content based on activeTab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Danh sách người dùng</h3>
                <button
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
                  onClick={handleAddUser}
                  type="button"
                >
                  <UserPlus size={16} className="mr-1" />
                  <span>Thêm người dùng</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="relative flex-grow max-w-xs">
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchTerm("")}
                      type="button"
                      aria-label="Clear search"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>

                <select
                  className="border border-gray-300 rounded px-3 py-2"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  aria-label="Chọn vai trò"
                >
                  <option value="all">Tất cả vai trò</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-gray-300 rounded px-3 py-2"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  aria-label="Chọn trạng thái"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khu vực
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hiệu suất
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đăng nhập gần nhất
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                : user.role === "supervisor"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Quản trị viên"
                            : user.role === "manager"
                              ? "Trưởng phòng"
                              : user.role === "supervisor"
                                ? "Giám sát khu vực"
                                : "Nhân viên kho vận"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.area}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2 text-sm font-medium">
                            {user.efficiency}%
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                user.efficiency >= 95
                                  ? "bg-green-500"
                                  : user.efficiency >= 90
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${user.efficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status === "active"
                              ? "Đang hoạt động"
                              : "Không hoạt động"}
                          </span>
                          <button
                            onClick={() =>
                              handleChangeUserStatus(
                                user.id,
                                user.status === "active" ? "inactive" : "active"
                              )
                            }
                            className="text-gray-500 hover:text-gray-700"
                            title={
                              user.status === "active"
                                ? "Vô hiệu hóa"
                                : "Kích hoạt"
                            }
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-refresh-cw"
                            >
                              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                              <path d="M21 3v5h-5"></path>
                              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                              <path d="M8 16H3v5"></path>
                            </svg>
                          </button>
                        </div>
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
        )}

        {activeTab === "roles" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Quản lý vai trò</h3>
                <button
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
                  onClick={handleAddRole}
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
                  <div className="mt-6">
                    <button
                      onClick={handleAddRole}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center mx-auto"
                      type="button"
                    >
                      <UserPlus size={16} className="mr-1" />
                      <span>Thêm vai trò</span>
                    </button>
                  </div>
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
                              onClick={() => handleEditRole(role.id)}
                              type="button"
                              aria-label="Edit role"
                            >
                              <Edit size={16} />
                            </button>
                            {role.id !== "admin" && (
                              <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={() => handleDeleteRole(role.id)}
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
                              {permission === "manage_users"
                                ? "Quản lý người dùng"
                                : permission === "manage_roles"
                                  ? "Quản lý vai trò"
                                  : permission === "view_all"
                                    ? "Xem tất cả dữ liệu"
                                    : permission === "config_sla"
                                      ? "Cấu hình SLA"
                                      : permission === "manage_system"
                                        ? "Quản lý hệ thống"
                                        : permission === "assign_orders"
                                          ? "Phân bổ đơn hàng"
                                          : permission === "manage_staff"
                                            ? "Quản lý nhân viên"
                                            : permission === "view_reports"
                                              ? "Xem báo cáo"
                                              : permission === "view_area"
                                                ? "Xem khu vực"
                                                : permission === "assign_area_orders"
                                                  ? "Phân bổ đơn khu vực"
                                                  : permission === "manage_area_staff"
                                                    ? "Quản lý nhân viên khu vực"
                                                    : permission === "view_assigned"
                                                      ? "Xem đơn được gán"
                                                      : permission === "process_orders"
                                                        ? "Xử lý đơn hàng"
                                                        : permission}
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
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Cài đặt hệ thống</h3>
                <button
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
                  onClick={() => handleSaveSettings("all")}
                  type="button"
                >
                  <Save size={16} className="mr-1" />
                  <span>Lưu tất cả cài đặt</span>
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Authentication Settings Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Lock size={18} className="text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium">Cài đặt xác thực</h3>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h4 className="font-medium text-gray-700">
                      Chính sách mật khẩu
                    </h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enforce_complexity"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="enforce_complexity"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Áp dụng độ phức tạp mật khẩu (ít nhất 8 ký tự, bao gồm
                        chữ hoa, chữ thường, số và ký tự đặc biệt)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enforce_history"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="enforce_history"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Không cho phép sử dụng 5 mật khẩu gần nhất
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enforce_expiry"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="enforce_expiry"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Yêu cầu đổi mật khẩu sau 90 ngày
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enforce_lockout"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="enforce_lockout"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Khóa tài khoản sau 5 lần đăng nhập sai
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h4 className="font-medium text-gray-700">
                      Xác thực hai lớp (2FA)
                    </h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="require_2fa_admin"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="require_2fa_admin"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Bắt buộc 2FA cho tài khoản Quản trị viên
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="optional_2fa_others"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="optional_2fa_others"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Cho phép 2FA tùy chọn cho các vai trò khác
                      </label>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 border-t flex justify-end">
                    <button
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded flex items-center mr-2 hover:bg-gray-200"
                      onClick={() => handleResetSettings("authentication")}
                      type="button"
                    >
                      <span>Đặt lại mặc định</span>
                    </button>
                    <button
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center hover:bg-blue-700"
                      onClick={() => handleSaveSettings("authentication")}
                      type="button"
                    >
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* General Settings Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Settings size={18} className="text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium">Cài đặt chung</h3>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="system_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên hệ thống
                        </label>
                        <input
                          type="text"
                          id="system_name"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          defaultValue="Warehouse Management System"
                          placeholder="Nhập tên hệ thống"
                          aria-label="Tên hệ thống"
                        />
                      </div>
                      <div>
                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Đơn vị
                        </label>
                        <input
                          type="text"
                          id="company_name"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          defaultValue="MIA.vn"
                          placeholder="Nhập tên đơn vị"
                          aria-label="Đơn vị"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 border-t flex justify-end">
                    <button
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded flex items-center mr-2 hover:bg-gray-200"
                      onClick={() => handleResetSettings("general")}
                      type="button"
                    >
                      <span>Đặt lại mặc định</span>
                    </button>
                    <button
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center hover:bg-blue-700"
                      onClick={() => handleSaveSettings("general")}
                      type="button"
                    >
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
