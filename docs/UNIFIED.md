# Unified App – Nguồn chính (canonical)

**Unified** = bản app gộp (layout + router TSX) chạy song song với app chính. Mọi tài liệu và code liên quan UNIFIED đều thống nhất theo trang này.

---

## Định nghĩa (tránh nhầm lẫn)

| Khái niệm | Giá trị |
|-----------|--------|
| **Vị trí code** | **`src/unified/`** (trong `src/`, không phải thư mục `src-unified` ngoài `src/`) |
| **Entry** | `src/index.js` đọc `REACT_APP_ENTRY`: nếu `unified` thì render `src/unified/app/App.tsx` |
| **Chạy** | `npm run start:unified` hoặc `REACT_APP_ENTRY=unified npm start` |
| **App chính** | `npm start` / `make start` → `App.js` (không dùng `src/unified/`) |

---

## Cấu trúc `src/unified/`

```text
src/unified/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── shared/
│   └── layout/
│       ├── MainLayout.tsx
│       ├── AppSidebar.tsx
│       ├── AppHeader.tsx
│       └── LayoutConfigManager.tsx
└── README.md
```

Unified dùng lại từ root: `contexts/`, `components/auth/Login`, `components/settings/Settings`, v.v.

---

## Tài liệu thao tác Unified

| Việc | Tài liệu |
|------|----------|
| Thêm mục Sidebar, thêm route | [UNIFIED_SIDEBAR_GUIDE.md](./UNIFIED_SIDEBAR_GUIDE.md) |
| Nút Cấu hình Layout, LayoutConfigManager | [UNIFIED_LAYOUT_CONFIG_GUIDE.md](./UNIFIED_LAYOUT_CONFIG_GUIDE.md) |
| Cấu trúc tổng thể, so với app chính | [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) |

---

## Chạy nhanh

```bash
# macOS / Linux
npm run start:unified

# Windows PowerShell
$env:REACT_APP_ENTRY="unified"; npm start
```

---

*Mọi chỗ trong repo ghi "unified" đều ám chỉ `src/unified/` và cách chạy trên.*
