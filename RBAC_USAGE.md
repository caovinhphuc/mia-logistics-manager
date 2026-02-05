# 🔐 RBAC (Role-Based Access Control) Documentation

## 📋 Tổng quan

Hệ thống phân quyền dựa trên vai trò (RBAC) cho MIA Logistics Manager.

## 👥 Roles (Vai trò)

- `admin` - Quản trị viên (Toàn quyền)
- `manager` - Quản lý
- `operator` - Nhân viên điều hành
- `driver` - Tài xế
- `warehouse_staff` - Nhân viên kho
- `hr` - Nhân sự

## 🎫 Permissions (Quyền)

Format: `resource:action`

### Resources & Actions
- `employees` - view, create, update, delete
- `transfers` - view, create, update, delete
- `carriers` - view, create, update, delete
- `locations` - view, create, update, delete
- `transport-requests` - view, create, update, delete
- `inbound-international` - view
- `inbound-domestic` - view
- `inbound-schedule` - view
- `settings` - view, update
- `reports` - view, create
- `partners` - view, create, update, delete

## 📝 Cách sử dụng

### 1. Import utilities

```javascript
import { hasPermission, hasAccess } from '../utils/rbac';
```

### 2. PermissionButton Component

```jsx
import { PermissionButton } from '../components/shared';

// Single permission
<PermissionButton 
  permission="employees:create"
  variant="contained"
  onClick={handleClick}
>
  Thêm nhân viên
</PermissionButton>

// Multiple permissions (any)
<PermissionButton 
  permissions={["employees:update", "employees:delete"]}
  onClick={handleClick}
>
  Sửa/Xóa
</PermissionButton>

// Multiple permissions (all required)
<PermissionButton 
  permissions={["employees:view", "employees:update"]}
  requireAll={true}
  onClick={handleClick}
>
  Chỉnh sửa
</PermissionButton>
```

### 3. PermissionGate Component

```jsx
import { PermissionGate } from '../components/shared';

// Show/hide content
<PermissionGate permission="employees:view">
  <EmployeeList />
</PermissionGate>

// With fallback
<PermissionGate 
  permission="employees:create"
  fallback={<div>Không có quyền</div>}
>
  <CreateEmployeeForm />
</PermissionGate>
```

### 4. HOC Guards

```javascript
import { withPermission, requirePermission } from '../utils/guards';

// Wrap component
const ProtectedComponent = withPermission(
  MyComponent, 
  'employees:view'
);

// Redirect on unauthorized
const RestrictedComponent = requirePermission(
  AdminPanel,
  'settings:update'
);
```

### 5. Utilities

```javascript
import { hasPermission, hasAccess, getAvailableActions } from '../utils/rbac';

// Check permission
if (hasPermission(user.role, 'employees:create')) {
  // User can create employees
}

// Check access
if (hasAccess(user.role, 'employees', 'create')) {
  // User can create employees
}

// Get available actions
const actions = getAvailableActions(user.role, 'employees');
// ['view', 'create', 'update']
```

## 🛡️ Route Protection Example

```jsx
<Route
  path="/employees"
  element={
    <ProtectedRoute requiredRoles={["admin", "manager", "hr"]}>
      <PermissionGate permission="employees:view">
        <MainLayout>
          <Employees />
        </MainLayout>
      </PermissionGate>
    </ProtectedRoute>
  }
/>
```

## ✅ Best Practices

1. **Always check permissions** trước khi hiển thị sensitive actions
2. **Use PermissionButton** để ẩn/hiện buttons tự động
3. **Use PermissionGate** để ẩn/hiện sections lớn
4. **Use HOC guards** cho component-level protection
5. **Validate on backend** - Frontend checks chỉ là UX, không phải security

