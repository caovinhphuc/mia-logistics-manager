# Unified App (TSX)

Bản gộp layout + router chuẩn TSX, chạy song song với app hiện tại. **Vị trí:** `src/unified/`. **Nguồn chính:** [docs/UNIFIED.md](../../docs/UNIFIED.md).

## Cấu trúc

- `app/` – App.tsx, router.tsx, providers.tsx
- `shared/layout/` – MainLayout, AppSidebar, AppHeader

## Tài liệu thao tác

- **Thêm mục Sidebar:** [docs/UNIFIED_SIDEBAR_GUIDE.md](../../docs/UNIFIED_SIDEBAR_GUIDE.md) – Cách thêm route + menu trong AppSidebar.tsx và router.tsx.
- **Layout Configuration:** [docs/UNIFIED_LAYOUT_CONFIG_GUIDE.md](../../docs/UNIFIED_LAYOUT_CONFIG_GUIDE.md) – Vị trí nút cấu hình layout trong Header, tích hợp LayoutConfigManager sau này.

## Chạy bản unified

```bash
# macOS / Linux
npm run start:unified

# Hoặc
REACT_APP_ENTRY=unified npm start
```

Windows (PowerShell): `$env:REACT_APP_ENTRY="unified"; npm start`

## Entry point

`src/index.js` đọc `REACT_APP_ENTRY`: nếu `unified` thì render `unified/app/App.tsx`, không thì app cũ.
