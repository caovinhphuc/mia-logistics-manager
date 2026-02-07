# Cấu trúc và kiến trúc dự án MIA Logistics Manager

Tài liệu mô tả **cấu trúc hiện tại** và **hướng kiến trúc dự kiến** (cùng với [PROJECT_CONSOLIDATION_ANALYSIS.md](./PROJECT_CONSOLIDATION_ANALYSIS.md)). Kiến trúc không đổi so với đề xuất gộp – chỉ khác **vị trí unified** (trong `src/` để CRA build được).

---

## 1. Hiện trạng: hai cách chạy

| Cách chạy | Entry | Ứng dụng | Port (mặc định) |
|-----------|--------|-----------|------------------|
| **make start** / **npm start** | `src/index.js` → `App.js` | App chính (đầy đủ menu, routes, backend) | 3000 |
| **npm run start:unified** | `src/index.js` → `src/unified/app/App.tsx` | Unified app (layout mới, ít route, dùng lại contexts) | 3000 (hoặc 3001 nếu 3000 bận) |

- **Backend:** `make start-backend` hoặc `make start` → Express tại **5050**.
- **Unified** dùng chung **contexts** (Auth, Theme, Language, Notification), **components/settings** (trang Cài đặt 7 tab), **components/auth/Login**; có **QueryClientProvider** riêng trong `unified/app/providers.tsx`.

---

## 2. Cấu trúc thư mục chính (root)

```text
mia-logistics-manager/
├── backend/                 # API Express (port 5050)
├── src/
│   ├── index.js            # Entry: đọc REACT_APP_ENTRY → App.js hoặc unified
│   ├── App.js              # App chính: Routes, MainLayout, lazy pages
│   ├── contexts/           # Auth, Theme, Language, Notification, Google
│   ├── components/         # Layout, auth, settings (7 tab), reports, ...
│   ├── pages/              # Trang theo từng màn (Employees, Reports, Settings/Roles|Users|...)
│   ├── features/           # Feature-module (carriers, shipments, settings CRUD, reports, ...)
│   ├── services/           # API client, Google Sheets, Telegram, email, ...
│   ├── unified/            # Bản unified (TSX) – xem docs/UNIFIED.md
│   │   ├── app/            # App.tsx, router.tsx, providers.tsx
│   │   └── shared/layout/  # MainLayout, AppSidebar, AppHeader, LayoutConfigManager
│   │   # (sau: features/warehouse/ gộp từ Warehouse-System / 2025-main)
│   ├── config/             # Router config, constants
│   ├── hooks/
│   ├── locales/
│   └── utils/
├── docs/                    # Tài liệu (PROJECT_CONSOLIDATION_ANALYSIS, UNIFIED_*_GUIDE, ...)
├── scripts/
├── public/
├── .github/                 # PR template, CONTRIBUTING, workflows
├── Warehouse-System/        # Module kho/SLA (chạy riêng hoặc tham khảo)
├── 2025-main/               # Bản dashboard 2025 (tham khảo)
└── ai-service/              # ML service (port 8000)
```

---

## 3. Luồng theo từng app

### 3.1 App chính (make start)

- **Route:** Định nghĩa trong `App.js` (lazy load từng page).
- **Layout:** `MainLayout.js` (sidebar có sub-menu, breadcrumb, theme).
- **Cài đặt:** `/settings` → `components/settings/Settings.js` (7 tab); `/settings/roles|permissions|users` → `pages/Settings/*`; `/settings/general|api|security|system` → redirect `/settings?tab=...`.
- **Báo cáo:** `/reports/*` → `components/reports/ReportsCenter.js`; `/reports/analytics|financial|performance` → `pages/Reports/*`.
- **Data:** Backend API (proxy hoặc `REACT_APP_API_BASE_URL`), Google Sheets, contexts.

### 3.2 Unified (npm run start:unified)

- **Route:** `unified/app/router.tsx` – Login, MainLayout, các route con (dashboard, orders, warehouse, reports = placeholder; **settings** = `components/settings/Settings`).
- **Layout:** `unified/shared/layout/` – MainLayout, AppSidebar (menu phẳng, chưa sub Cài đặt), AppHeader (Layout Config).
- **Cài đặt:** Cùng 1 component với app chính → không gọi API list settings → không lỗi Network Error.
- **Hướng đi:** Thay placeholder bằng trang thật từ `pages/` hoặc `features/`; có thể thêm sub-menu Cài đặt (link `?tab=...`) cho đồng bộ với app chính.

---

## 4. Kiến trúc dự kiến (trùng đề xuất PROJECT_CONSOLIDATION_ANALYSIS)

- **Một codebase:** Root làm nền; Warehouse-System và 2025-main tham khảo / gộp dần.
- **Chuẩn TSX/TS:** Code mới và unified dùng TypeScript; file JS cũ giữ, chuyển dần khi sửa.
- **Một UI:** MUI 5 + Tailwind (đã dùng ở root); tránh hai hệ UI trực chọi.
- **Một Auth & Permission:** Giữ AuthContext + RBAC; API login/roles/permissions dùng chung.
- **Một router:** React Router 6.x; route theo feature (dashboard, warehouse, orders, reports, settings…).
- **Unified từng bước:** Unified luôn tại **`src/unified/`** (xem [UNIFIED.md](./UNIFIED.md)). Khi ổn định → gộp vào `src/` thành `src/app/`, `src/shared/`, `src/features/` (xem mục 4.3 PROJECT_CONSOLIDATION_ANALYSIS).

---

## 5. Nguồn trang theo từng màn (tham chiếu nhanh)

| Màn | make start (app chính) | start:unified |
|-----|------------------------|---------------|
| Cài đặt (7 tab) | `components/settings/Settings.js` | Cùng (`components/settings/Settings`) |
| Cài đặt Roles/Users/Permissions | `pages/Settings/Roles|Users|Permissions` | Chưa (placeholder) |
| Báo cáo | `components/reports/ReportsCenter` + `pages/Reports/*` | Placeholder |
| Dashboard, Đơn hàng, Kho | Nhiều component/pages | Placeholder |

---

## 6. Tài liệu liên quan

- **Unified (canonical):** [docs/UNIFIED.md](./UNIFIED.md) – vị trí `src/unified/`, cách chạy, link các guide.
- **Gộp 3 dự án:** [PROJECT_CONSOLIDATION_ANALYSIS.md](./PROJECT_CONSOLIDATION_ANALYSIS.md) (mục 4.2–4.4).
- **Unified trong repo:** [src/unified/README.md](../src/unified/README.md)
- **Sidebar unified:** [docs/UNIFIED_SIDEBAR_GUIDE.md](./UNIFIED_SIDEBAR_GUIDE.md)
- **Layout Config:** [docs/UNIFIED_LAYOUT_CONFIG_GUIDE.md](./UNIFIED_LAYOUT_CONFIG_GUIDE.md)
- **Config chuẩn:** [CONFIG_STANDARDIZATION.md](../CONFIG_STANDARDIZATION.md) (env, CSP, API base URL)

---

*Cập nhật theo hiện trạng repo và unified đã triển khai.*
