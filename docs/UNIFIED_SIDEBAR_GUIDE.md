# Hướng dẫn thêm mục Sidebar (Unified)

Tài liệu này mô tả cách **thêm mục menu vào Sidebar** trong bản unified. **Unified = `src/unified/`**. Chạy: `npm run start:unified`. Nguồn chính: [UNIFIED.md](./UNIFIED.md).

---

## Vị trí code

| Thành phần | File | Ghi chú |
|------------|------|--------|
| **Danh sách menu** | `src/unified/shared/layout/AppSidebar.tsx` | Mảng `menuItems` |
| **Định nghĩa route** | `src/unified/app/router.tsx` | Các `<Route>` trong `<MainLayout />` |
| **Layout chứa Sidebar** | `src/unified/shared/layout/MainLayout.tsx` | Không cần sửa khi chỉ thêm mục |

---

## Cách thêm một mục Sidebar

### Bước 1: Thêm route trong `router.tsx`

Mở `src/unified/app/router.tsx`, trong nhánh `<Route path="/" element={<MainLayout />}>` thêm route mới:

```tsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<Placeholder title="Tổng quan" />} />
  <Route path="dashboard" element={<Placeholder title="Dashboard" />} />
  <Route path="orders" element={<Placeholder title="Đơn hàng" />} />
  <Route path="warehouse" element={<Placeholder title="Kho vận" />} />
  <Route path="reports" element={<Placeholder title="Báo cáo" />} />
  <Route path="settings" element={<Placeholder title="Cài đặt" />} />
  {/* Thêm mục mới - ví dụ: Phân loại SLA */}
  <Route path="sla" element={<Placeholder title="Phân loại SLA" />} />
</Route>
```

Nếu trang đã có component thật, thay `Placeholder` bằng lazy import:

```tsx
const SLAPage = lazy(() => import('@/features/warehouse/sla/SLAClassificationPage'))

// Trong Routes:
<Route path="sla" element={<SLAPage />} />
```

### Bước 2: Thêm mục menu trong `AppSidebar.tsx`

Mở `src/unified/shared/layout/AppSidebar.tsx`:

1. Import icon (nếu cần) từ `@mui/icons-material`:

```tsx
import {
  Dashboard as DashboardIcon,
  Inventory as OrdersIcon,
  Warehouse as WarehouseIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Schedule as SlaIcon,  // thêm icon mới
} from '@mui/icons-material'
```

2. Thêm object vào mảng `menuItems`:

```tsx
const menuItems = [
  { label: 'Tổng quan', path: '/', icon: <DashboardIcon /> },
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Đơn hàng', path: '/orders', icon: <OrdersIcon /> },
  { label: 'Kho vận', path: '/warehouse', icon: <WarehouseIcon /> },
  { label: 'Phân loại SLA', path: '/sla', icon: <SlaIcon /> },  // mục mới
  { label: 'Báo cáo', path: '/reports', icon: <ReportsIcon /> },
  { label: 'Cài đặt', path: '/settings', icon: <SettingsIcon /> },
]
```

**Lưu ý:** `path` phải trùng với `path` trong `router.tsx` (không cần leading `/` vì route con đã nằm dưới `/`).

---

## Cấu trúc mở rộng (menu có con, phân quyền)

Sau này nếu cần **menu có cấp con** hoặc **chỉ hiện theo quyền**:

- **Menu con:** Đổi `menuItems` thành cấu trúc có `children`, và trong `AppSidebar.tsx` render `ListItemButton` + `Collapse` + danh sách con (giống Warehouse-System).
- **Phân quyền:** Dùng `useAuth()` hoặc `usePermission()` từ `src/contexts`, lọc `menuItems` theo role/permission trước khi `map`.

Ví dụ lọc theo quyền:

```tsx
const { hasPermission } = usePermission()
const filteredItems = menuItems.filter(
  (item) => !item.permission || hasPermission(item.permission)
)
// render filteredItems thay vì menuItems
```

---

## Tóm tắt checklist thêm mục

1. [ ] Thêm `<Route path="slug" element={<Component />} />` trong `src/unified/app/router.tsx`.
2. [ ] Thêm `{ label: 'Tên hiển thị', path: '/slug', icon: <Icon /> }` vào `menuItems` trong `src/unified/shared/layout/AppSidebar.tsx`.
3. [ ] (Tùy chọn) Tạo component trang trong `src/unified/features/...` hoặc `src/features/...` và lazy load trong router.

---

**Chạy bản unified:** `npm run start:unified` (hoặc `REACT_APP_ENTRY=unified npm start`).
