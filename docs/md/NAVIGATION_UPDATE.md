# 🚀 CẬP NHẬT ĐIỀU HƯỚNG - MIA LOGISTICS MANAGER

## ✅ Cấu Trúc Routes Hoàn Chỉnh

MIA Logistics Manager sử dụng React Router v6 với cấu trúc routes đầy đủ, role-based access control (RBAC), và protected routes.

### 📋 Danh Sách Routes

#### Public Routes

| Path | Component | Mô tả |
|------|-----------|-------|
| `/login` | Login | Trang đăng nhập |

#### Protected Routes - Core

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/` | Dashboard (redirect) | All | Redirect đến `/dashboard` |
| `/dashboard` | Dashboard | All | Bảng điều khiển tổng quan |
| `/profile` | Profile | All | Hồ sơ cá nhân |
| `/notifications` | NotificationCenter | All | Trung tâm thông báo |
| `/maps` | MapView | All | Bản đồ và định vị |

#### Transport Management (`/transport/*`)

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/transport` | TransportManagement | admin, manager, operator | Quản lý vận chuyển (main) |
| `/transport/requests` | TransportRequests | admin, manager, operator | Đề nghị vận chuyển |
| `/transport/routes` | TransportRoutes | admin, manager | Quản lý tuyến đường |
| `/transport/vehicles` | Vehicles | admin, manager | Quản lý phương tiện |
| `/transport/volume-rules` | VolumeCalculator | admin, manager, operator | Quy tắc tính khối |
| `/transport/locations-saved` | LocationsList | admin, manager, operator | Địa điểm lưu |
| `/transport/pending-delivery` | PendingDelivery | admin, manager, operator | Chờ chuyển giao |

#### Warehouse Management (`/warehouse/*`)

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/warehouse` | WarehouseManagement | admin, manager, warehouse_staff | Quản lý kho (main) |
| `/warehouse/inventory` | Inventory | admin, manager, warehouse_staff | Quản lý tồn kho |
| `/warehouse/orders` | WarehouseOrders | admin, manager, warehouse_staff | Quản lý đơn hàng kho |
| `/warehouse/locations` | WarehouseLocations | admin, manager, warehouse_staff | Vị trí kho |
| `/warehouse/transfers` | WarehouseTransfers | admin, manager, warehouse_staff | Chuyển kho |

#### Partners Management (`/partners/*`)

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/partners` | PartnerManagement | admin, manager, operator | Quản lý đối tác (main) |
| `/partners/suppliers` | Suppliers | admin, manager, operator | Nhà cung cấp |
| `/partners/customers` | Customers | admin, manager, operator | Khách hàng |
| `/partners/contracts` | Contracts | admin, manager | Hợp đồng |

#### Reports (`/reports/*`)

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/reports` | ReportsCenter | admin, manager | Trung tâm báo cáo |
| `/reports/analytics` | Analytics | admin, manager | Phân tích dữ liệu |
| `/reports/financial` | Financial | admin, manager | Báo cáo tài chính |
| `/reports/performance` | Performance | admin, manager | Báo cáo hiệu suất |

#### Settings (`/settings/*`)

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/settings` | Settings | admin | Cài đặt (main) |
| `/settings/general` | General | admin | Cài đặt chung |
| `/settings/api` | Api | admin | Tích hợp API |
| `/settings/security` | Security | admin | Bảo mật hệ thống |
| `/settings/system` | System | admin | Cài đặt hệ thống |

#### Inbound Management

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/inbound-domestic` | InboundDomestic | admin, manager, warehouse_staff | Nhập hàng quốc nội |
| `/inbound-international` | InboundInternational | admin, manager, warehouse_staff | Nhập hàng quốc tế |
| `/inbound-schedule` | InboundSchedule | admin, manager, warehouse_staff | Lịch trình nhập hàng |
| `/inbound-reports` | InboundReports | admin, manager | Báo cáo nhập hàng |

#### Standalone Routes

| Path | Component | Required Roles | Mô tả |
|------|-----------|----------------|-------|
| `/carriers` | CarriersManagement | admin, manager, operator | Quản lý nhà vận chuyển |
| `/transfers` | TransfersManagement | admin, manager, warehouse_staff | Quản lý chuyển kho |

#### Error Routes

| Path | Component | Mô tả |
|------|-----------|-------|
| `/unauthorized` | Unauthorized | Trang không có quyền truy cập |
| `*` | NotFound | Trang 404 - Không tìm thấy |

---

## 🔐 Role-Based Access Control (RBAC)

### Roles

1. **admin** - Toàn quyền hệ thống
2. **manager** - Quản lý vận hành
3. **operator** - Điều hành hàng ngày
4. **driver** - Tài xế vận chuyển
5. **warehouse_staff** - Nhân viên kho

### Protected Routes

Tất cả routes (trừ `/login`) đều được bảo vệ bằng `ProtectedRoute` component:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

### Role-Specific Routes

Một số routes yêu cầu roles cụ thể:

```jsx
<Route
  path="/settings"
  element={
    <ProtectedRoute requiredRoles={["admin"]}>
      <MainLayout>
        <Settings />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

---

## 🎯 Lợi Ích của Cấu Trúc Navigation

### ✅ URL Routing Thực Sự

- Mỗi trang có URL riêng, có thể bookmark
- Browser navigation (Back/Forward) hoạt động
- Direct access - Truy cập trực tiếp vào bất kỳ trang nào

### ✅ SEO Friendly

- Search engines có thể index từng trang
- Meta tags được cập nhật theo route
- Document title tự động thay đổi

### ✅ Security

- Protected routes với authentication check
- Role-based access control (RBAC)
- Unauthorized access redirect

### ✅ User Experience

- Breadcrumbs navigation
- Quick actions menu
- Collapsible sidebar với nested menus
- Mobile-responsive navigation

---

## 📱 Navigation Components

### MainLayout

Component chính chứa:

- **Sidebar** - Navigation menu với nested items
- **Top Bar** - Header với user menu, notifications, search
- **Breadcrumbs** - Hiển thị vị trí hiện tại
- **Quick Actions** - FAB với quick actions menu

### Menu Structure

Menu được định nghĩa trong `MainLayout.js` với:

```javascript
const getMenuItems = (t) => [
  {
    key: "dashboard",
    text: t("navigation.dashboard"),
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: ["admin", "manager", "operator", "driver", "warehouse_staff"],
    color: "primary",
  },
  {
    key: "transport",
    text: t("navigation.transport"),
    icon: <TransportIcon />,
    path: "/transport",
    roles: ["admin", "manager", "operator"],
    children: [
      { key: "requests", text: "Đề nghị vận chuyển", path: "/transport/requests" },
      { key: "routes", text: "Tuyến đường", path: "/transport/routes" },
      // ... more children
    ],
  },
  // ... more menu items
];
```

---

## 🚀 Cách Sử Dụng

### Điều Hướng Từ Code

```jsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/transport/requests');
  };

  return <Button onClick={handleClick}>Go to Requests</Button>;
};
```

### Link Components

```jsx
import { Link } from 'react-router-dom';

<Link to="/dashboard">Dashboard</Link>
<Link to="/transport/volume-rules">Volume Rules</Link>
```

### Programmatic Navigation

```jsx
// With state
navigate('/dashboard', { state: { from: 'login' } });

// Replace current history entry
navigate('/settings', { replace: true });

// Go back
navigate(-1);

// Go forward
navigate(1);
```

---

## 📊 Route Organization

### Nested Routes

Một số routes sử dụng nested structure:

```jsx
<Route path="/transport/*" element={<TransportManagement />} />
<Route path="/warehouse/*" element={<WarehouseManagement />} />
<Route path="/partners/*" element={<PartnerManagement />} />
<Route path="/reports/*" element={<ReportsCenter />} />
<Route path="/settings/*" element={<Settings />} />
```

Các component này xử lý routing con bên trong.

### Standalone Routes

Routes đơn giản không có nested:

```jsx
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/carriers" element={<CarriersManagement />} />
<Route path="/maps" element={<MapView />} />
```

---

## 🔧 Thêm Route Mới

### Bước 1: Tạo Component

```jsx
// src/pages/NewFeature/NewPage.js
const NewPage = () => {
  return <div>New Page Content</div>;
};

export default NewPage;
```

### Bước 2: Lazy Load trong App.js

```jsx
const NewPage = React.lazy(() => import("./pages/NewFeature/NewPage"));
```

### Bước 3: Thêm Route

```jsx
<Route
  path="/new-feature"
  element={
    <ProtectedRoute requiredRoles={["admin"]}>
      <MainLayout>
        <NewPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

### Bước 4: Thêm vào Menu

Trong `MainLayout.js`, thêm vào `getMenuItems`:

```javascript
{
  key: "new_feature",
  text: "Tính năng mới",
  icon: <NewIcon />,
  path: "/new-feature",
  roles: ["admin"],
}
```

### Bước 5: Thêm Document Title

Trong `App.js`, thêm vào `titles` object:

```javascript
const titles = {
  // ... existing titles
  "/new-feature": "Tính năng mới",
};
```

---

## 🧪 Testing Navigation

### Manual Testing Checklist

- [ ] Click vào các menu items trong sidebar
- [ ] Click vào nested menu items
- [ ] Sử dụng browser Back/Forward buttons
- [ ] Truy cập trực tiếp bằng URL
- [ ] Refresh trang vẫn giữ đúng vị trí
- [ ] Unauthorized user không thể truy cập protected routes
- [ ] User không có role không thể truy cập role-specific routes
- [ ] Login redirect về đúng trang trước đó
- [ ] Logout redirect về `/login`
- [ ] Mobile navigation hoạt động

### Testing Scripts

```bash
# Test all routes (manual)
curl http://localhost:3000/dashboard
curl http://localhost:3000/transport
curl http://localhost:3000/warehouse

# Check route protection
# Should redirect to /login if not authenticated
```

---

## 📝 Best Practices

### 1. Lazy Loading

Tất cả routes đều sử dụng lazy loading để tối ưu bundle size:

```jsx
const Dashboard = React.lazy(() => import("./components/dashboard/Dashboard"));
```

### 2. Suspense Boundaries

Wrap routes trong Suspense với fallback:

```jsx
<Suspense fallback={<LoadingScreen />}>
  <Routes>
    {/* routes */}
  </Routes>
</Suspense>
```

### 3. Protected Routes

Luôn wrap routes cần authentication trong `ProtectedRoute`:

```jsx
<ProtectedRoute requiredRoles={["admin", "manager"]}>
  <Component />
</ProtectedRoute>
```

### 4. Consistent Path Naming

- Use kebab-case: `/transport/volume-rules`
- Avoid camelCase: `/transport/volumeRules` ❌
- Use plural for collections: `/carriers`, `/transfers`

### 5. Document Titles

Luôn cập nhật document title trong `titles` object:

```javascript
const titles = {
  "/new-route": "Tên trang",
};
```

---

## 🎯 Quick Reference

### Common Routes

```bash
# Dashboard
http://localhost:3000/dashboard

# Transport
http://localhost:3000/transport
http://localhost:3000/transport/requests
http://localhost:3000/carriers

# Warehouse
http://localhost:3000/warehouse/inventory
http://localhost:3000/transfers

# Settings
http://localhost:3000/settings
http://localhost:3000/settings/general
```

### Navigation Hooks

```jsx
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Navigate
const navigate = useNavigate();
navigate('/dashboard');

// Get current location
const location = useLocation();
console.log(location.pathname); // "/dashboard"

// Get route params
const { id } = useParams();
```

---

## 📞 Support

Nếu gặp vấn đề với navigation:

1. **Check console** - Xem có lỗi routing không
2. **Verify routes** - Kiểm tra routes đã được định nghĩa đúng trong `App.js`
3. **Check permissions** - Đảm bảo user có đúng roles
4. **Clear cache** - Xóa browser cache và refresh
5. **Check ProtectedRoute** - Verify authentication state

---

**Last Updated:** 2025-01-30
**Version:** 2.1.0
**React Router:** v6.20.1

**Made with ❤️ for MIA Logistics Manager**
