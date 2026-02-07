# Phân tích & So sánh 3 dự án MIA Logistics

Tài liệu so sánh **Warehouse-System**, **2025-main** và **mia-logistics-manager** (root), kèm đề xuất gộp và đồng bộ UX/UI.

---

## 1. Tổng quan so sánh

| Tiêu chí | mia-logistics-manager (root) | Warehouse-System | 2025-main |
|----------|------------------------------|-------------------|-----------|
| **Vai trò** | App chính, production | Module kho/SLA, demo warehouse | Bản 2025, dashboard kho + staff |
| **React** | 18.2 | 18.2 | **19.1** |
| **Router** | react-router-dom 6.x | react-router-dom **7.x** | react-router-dom 7.x |
| **UI** | **MUI 5** + Tailwind | **Tailwind** + Lucide, Headless UI | **Tailwind** + Lucide, Framer Motion |
| **State** | Context + Zustand | Context (Auth, Data, Permission, Theme) | Context + store (ts) |
| **Ngôn ngữ** | JS + TS (features) | JS | **JSX/TSX** (nhiều TS) |
| **Auth** | AuthContext, RBAC, SecurityGuard | AuthContext + PermissionContext | AuthContext + PermissionContext |
| **Data** | Google Sheets services, API backend | googleSheets.js (đơn giản) | Google Sheets API, json-server |
| **Cấu trúc** | features/ + pages/ + shared/ | components/ + Module/ + contexts/ | modules/ + management/ + placeholder/ |
| **Entry** | App.js (lazy routes) | index.js → App hoặc MainLayout | App.jsx → Header/Sidebar/MainContent |

---

## 2. Chi tiết từng dự án

### 2.1 mia-logistics-manager (root) – App chính

- **Mục đích:** Ứng dụng logistics tổng thể: vận chuyển, kho, đối tác, báo cáo, cài đặt, tích hợp Google Sheets, Telegram, backend Express.
- **Điểm mạnh:**
  - Kiến trúc rõ: `features/` (carriers, shipments, transfers, locations, settings…), `shared/`, `config/`, services.
  - MUI + Tailwind, lazy loading, RBAC, session timeout, i18n (vi/en).
  - Backend (Express), Google Sheets, Sentry, nhiều script deploy/backup.
- **Điểm yếu:**
  - Trộn JS/TS, nhiều file legacy (ui/, components cũ), route trong App.js rất dài.

### 2.2 Warehouse-System – Module kho / SLA

- **Mục đích:** Giao diện kho: đơn hàng, SLA, phân công, nhân viên, báo cáo, cài đặt; chạy độc lập hoặc nhúng.
- **Điểm mạnh:**
  - Tailwind + Lucide, sidebar/header đã chỉnh (MainLayout, AppHeader, AppSidebar).
  - Context thống nhất: Auth, Permission, Data, Theme; route rõ (index.js với placeholder).
  - Nhiều module SLA/picking (sla/, Module/, components/common).
- **Điểm yếu:**
  - React Router 7 khác bản root (6.x); không dùng MUI; auth đơn giản (localStorage, demo user).
  - Nhiều file lớn (EnhancedOrderDashboard, test.js), tên thư mục không nhất quán (Module vs modules).

### 2.3 2025-main – Bản dashboard 2025

- **Mục đích:** Dashboard kho + quản lý nhân viên, đơn hàng, picking, lịch, hiệu suất; có thể là bản “tương lai” của warehouse UI.
- **Điểm mạnh:**
  - React 19, TS/TSX nhiều, Framer Motion, Chart.js/Recharts.
  - Cấu trúc module (OverviewTab, OrderTab, StaffTab, PickingTab…), widget (Alerts, Staff, Schedule), router tập trung (AppRouter.jsx).
  - LayoutContext, ThemeContext, PermissionContext; MainLayoutClean, IntegrationDashboard.
- **Điểm yếu:**
  - Mock data trong App; trùng lặp tính năng với Warehouse-System và root; chưa gắn với backend/Google Sheets thật.

---

## 3. Trùng lặp & khác biệt cần giải quyết

| Tính năng | Root | Warehouse-System | 2025-main |
|-----------|------|------------------|-----------|
| Login / Auth | Có (phức tạp) | Có (đơn giản) | Có (context) |
| Dashboard | Có | Placeholder / welcome | OverviewTab, KPI |
| Đơn hàng | Warehouse/Orders | OrderSLAManagementSystem, test.js | OrderTab, OrdersTab |
| Nhân viên / Staff | Employees | (trong sidebar) | StaffTab, StaffManagement |
| SLA | (rải rác) | Trọng tâm (sla/, Module) | (trong orders/staff) |
| Picking | (khác) | Có (sla/, common) | PickingTab |
| Báo cáo | Reports (Analytics, Financial, Perf) | Reports page | ReportsTab |
| Cài đặt | Settings (General, Api, Security, System) | Settings placeholder | SettingsTab, SystemSettingsPage |
| Google Sheets | Đầy đủ (services) | 1 file api/googleSheets.js | googlesheet/, sheetsService |
| Layout | MainLayout (MUI) | MainLayout (Tailwind, sidebar full height) | Header + Sidebar + MainContent |

- **Trùng lặp:** Auth, Dashboard, Orders, Staff, Reports, Settings, layout (sidebar + header).
- **Khác biệt:** Root = MUI + backend + i18n; Warehouse = SLA/kho + Tailwind; 2025 = React 19 + modules/widgets + TS.

---

## 4. Đề xuất gộp thành một dự án & đồng bộ UX/UI

### 4.1 Nguyên tắc

1. **Một codebase:** Lấy **mia-logistics-manager (root)** làm nền, tích hợp logic và UI tốt nhất từ Warehouse-System và 2025-main.
2. **Chuẩn TSX/TS:** Code mới và cấu trúc gộp dùng **TypeScript** (`.tsx` cho component, `.ts` cho utils/types); file `.js`/`.jsx` cũ giữ tạm, chuyển dần khi sửa.
3. **Một UI system:** Thống nhất dùng **MUI 5** (đã có ở root) + **Tailwind** cho spacing/theme; giảm dần Tailwind thuần để tránh hai hệ thống trực chọi.
4. **Một bộ Auth & Permission:** Giữ AuthContext + RBAC của root; chuẩn hóa API (login, roles, permissions) để Warehouse/2025 dùng chung.
5. **Một router:** React Router **6.x** (khớp root), định nghĩa route theo feature (dashboard, warehouse, orders, staff, reports, settings…).

### 4.2 Triển khai an toàn: thư mục riêng từng bước

**Nên tạo một thư mục mới** để làm bản “unified” song song với `src/` hiện tại, tránh sửa trực tiếp code cũ đến khi ổn định.

**Cấu trúc đã triển khai (unified = src/unified/, xem [UNIFIED.md](./UNIFIED.md)):**

```text
mia-logistics-manager/
├── src/
│   ├── index.js                # REACT_APP_ENTRY=unified → unified/app/App.tsx
│   ├── App.js                  # App chính (npm start)
│   ├── unified/                # Toàn bộ code unified (app/, shared/layout/)
│   └── contexts/  components/  pages/  features/  services/  ...
```

**Cách dùng:**

1. **Unified tại `src/unified/`** – code TSX, import từ `src/` (contexts, components, services). Xem [UNIFIED.md](./UNIFIED.md).
2. **Entry:** `src/index.js` đọc `REACT_APP_ENTRY=unified` → `import('./unified/app/App')`.
3. **Chạy:** `npm run start:unified` hoặc `REACT_APP_ENTRY=unified npm start`.
4. **Khi ổn định:** Gộp nội dung `src/unified/` vào `src/` (app/, shared/, features/ mở rộng).

**Lợi ích:** App cũ vẫn chạy; bản mới phát triển riêng; rollback chỉ cần đổi lại entry.

### 4.3 Kiến trúc đề xuất sau gộp (kết quả cuối)

```text
mia-logistics-manager/
├── src/
│   ├── app/                    # Entry, router tổng, providers (chuẩn TSX/TS)
│   │   ├── App.tsx
│   │   ├── router.tsx         # Route config (lazy, guard)
│   │   └── providers.tsx      # Auth, Theme, Permission, Data
│   ├── features/               # Giữ + mở rộng
│   │   ├── dashboard/
│   │   ├── warehouse/         # Gộp từ Warehouse-System
│   │   │   ├── orders/        # Order list, SLA (EnhancedOrderDashboard tinh gọn)
│   │   │   ├── sla/           # SLA logic từ Warehouse-System
│   │   │   ├── picking/       # Từ 2025-main + Warehouse
│   │   │   └── staff/         # Staff từ 2025-main
│   │   ├── carriers/
│   │   ├── shipments/
│   │   ├── settings/
│   │   └── ...
│   ├── shared/
│   │   ├── layout/            # Một MainLayout (sidebar + header) thống nhất – TSX
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AppSidebar.tsx # Cấu trúc menu giống Warehouse, style MUI
│   │   │   └── AppHeader.tsx
│   │   ├── components/
│   │   └── hooks/
│   ├── services/              # Giữ Google Sheets, API backend
│   └── contexts/              # Auth, Theme, Permission, Language (root)
```

### 4.4 Các bước thực hiện (theo phase)

**Phase 1 – Chuẩn hóa layout & navigation (đồng bộ UX)**  
- Tạo **một** `MainLayout` trong `shared/layout/`: sidebar + header + outlet.  
- Sidebar: cấu trúc menu giống Warehouse-System (Dashboard, Đơn hàng, Quản lý SLA, Phân công, Người dùng, Báo cáo, Cài đặt) + các mục từ root (Transport, Partners, Inbound…).  
- Dùng component MUI (Drawer, AppBar, List) + Tailwind cho spacing/breakpoint.  
- Xóa hoặc deprecated layout cũ trong từng dự án con (Warehouse MainLayout, 2025 Header/Sidebar) sau khi chuyển xong.

**Phase 2 – Auth & permission thống nhất**  
- Giữ AuthContext + RBAC của root làm chuẩn.  
- Đổi Warehouse-System và 2025-main sang dùng cùng Auth/Permission (hoặc adapter nhỏ nếu cần).  
- Route bảo vệ: dùng chung một `ProtectedRoute`/SecurityGuard (role/permission).

**Phase 3 – Gom tính năng Warehouse & 2025 vào root**  
- **Warehouse-System:**  
  - Đưa màn hình SLA/đơn hàng quan trọng vào `features/warehouse/orders` (ví dụ: OrderSLAManagementSystem rút gọn, EnhancedOrderDashboard tinh gọn).  
  - Đưa logic SLA (sla/, Module) vào `features/warehouse/sla` hoặc services.  
  - Đưa API Google Sheets (nếu cần) vào `services/googleSheets` của root, gọi từ warehouse features.  
- **2025-main:**  
  - Đưa module hữu ích (OrderTab, StaffTab, PickingTab, Alerts, Widgets) vào `features/warehouse/` tương ứng.  
  - Chuyển dần sang MUI component (DataGrid, Card, Tabs) thay cho component thuần Tailwind nếu cần đồng bộ.

**Phase 4 – Router & entry point**  
- Một `router.tsx` (hoặc config router): định nghĩa tất cả route (dashboard, warehouse/orders, warehouse/staff, warehouse/sla, reports, settings…).  
- App.tsx chỉ render Router + Providers + layout; không nhúng logic nghiệp vụ.  
- Lazy load từng feature để giữ performance.

**Phase 5 – Dọn dẹp**  
- Sau khi chuyển xong tính năng và layout: đánh dấu **Warehouse-System** và **2025-main** là deprecated hoặc chỉ dùng làm reference.  
- Có thể giữ hai thư mục dưới dạng “archive” hoặc xóa khi không cần nữa.

### 4.5 Đồng bộ UI cụ thể

- **Màu sắc & theme:** Một theme (MUI + CSS variables hoặc Tailwind theme) cho toàn app: primary/secondary, background sidebar, header, trạng thái (success, warning, error).  
- **Sidebar:** Độ rộng cố định (ví dụ 256px), collapse trên mobile; icon + label; active state thống nhất.  
- **Header:** Search, notification, user menu, theme toggle – một component dùng chung.  
- **Bảng dữ liệu:** Ưu tiên MUI DataGrid hoặc shared DataTable (đã có ở root) cho danh sách đơn hàng, nhân viên, báo cáo.  
- **Form & nút:** Dùng MUI Button, TextField, Select; style (outlined, contained) thống nhất.  
- **Feedback:** Một hệ thống toast/snackbar (root đã có); thay thế toast riêng của Warehouse/2025 bằng hệ chung.

---

## 5. Rủi ro & lưu ý

- **React 19 (2025-main):** Root và Warehouse đang dùng React 18. Nếu gộp vào root, nên giữ React 18 đến khi nâng cấp toàn bộ; logic từ 2025-main chuyển sang không phụ thuộc React 19.  
- **React Router 7 (Warehouse):** Root dùng v6; nên giữ v6 cho toàn bộ, chuyển route Warehouse sang cú pháp v6.  
- **File lớn:** EnhancedOrderDashboard, test.js (Warehouse) nên tách thành component con và đưa vào feature nhỏ hơn.  
- **Google Sheets:** Giữ một đầu mối (services trong root); Warehouse/2025 gọi qua service, không duplicate logic.

---

## 6. Tóm tắt hành động

| Ưu tiên | Hành động |
|--------|------------|
| 1 | Thiết kế **một MainLayout** (sidebar + header) trong root, đồng bộ cấu trúc menu với Warehouse + root. |
| 2 | Chuẩn hóa **Auth/Permission**; Warehouse & 2025 dùng chung context/guard của root. |
| 3 | Tạo **features/warehouse/** trong root; chuyển SLA, orders, picking, staff từ Warehouse-System và 2025-main. |
| 4 | Thống nhất **router** (React Router 6), lazy load, ProtectedRoute. |
| 5 | Thống nhất **UI**: MUI + một theme; DataTable/DataGrid; toast/snackbar chung. |
| 6 | Deprecated hoặc archive **Warehouse-System** và **2025-main** sau khi gộp xong. |

**Chuẩn ngôn ngữ:** Code mới và phần gộp dùng **TSX/TS** (`.tsx`, `.ts`); file JS/JSX cũ giữ tạm, chuyển dần khi sửa.

**Tài liệu unified (canonical:** [UNIFIED.md](./UNIFIED.md)**):**
- **Thêm mục Sidebar:** [UNIFIED_SIDEBAR_GUIDE.md](./UNIFIED_SIDEBAR_GUIDE.md) – Route + menu trong `src/unified/`.
- **Layout Configuration:** [UNIFIED_LAYOUT_CONFIG_GUIDE.md](./UNIFIED_LAYOUT_CONFIG_GUIDE.md) – Nút Cấu hình Layout, LayoutConfigManager trong `src/unified/`.

Nếu bạn muốn, bước tiếp theo có thể là: (1) thêm mục Sidebar theo UNIFIED_SIDEBAR_GUIDE, hoặc (2) triển khai nút + modal Layout Config theo UNIFIED_LAYOUT_CONFIG_GUIDE.
