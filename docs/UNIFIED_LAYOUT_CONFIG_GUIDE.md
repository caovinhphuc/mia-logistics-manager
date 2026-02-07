# Hướng dẫn Layout Configuration (Unified)

Tài liệu này mô tả cách **tích hợp nút Cấu hình Layout** và **Layout Configuration Manager** vào bản unified. **Unified = `src/unified/`**. Chạy: `npm run start:unified`. Nguồn chính: [UNIFIED.md](./UNIFIED.md).

---

## Tổng quan

Layout Configuration Manager dùng để:
- Ẩn/hiện widget theo từng trang
- Tùy chỉnh bố cục Desktop / Tablet / Mobile
- Quản lý vị trí và kích thước thành phần
- Reset cấu hình về mặc định

Trong unified, các phần sẽ nằm ở:
- **Nút mở cấu hình:** `src/unified/shared/layout/AppHeader.tsx`
- **Modal/Manager:** component riêng (tạo sau), có thể đặt trong `src/unified/shared/layout/` hoặc `src/unified/features/settings/`

---

## 1. Vị trí nút Layout Configuration trong Header

### Hiện tại (AppHeader.tsx)

Header unified đang có thứ tự: **Menu (mobile) → Logo → Dark/Light mode → User avatar**.

Khi triển khai Layout Config, nên thêm nút **giữa Dark/Light và User**:

```
[☰ Menu]  MIA Logistics  [🌙 Dark] [📐 Layout] [👤 User]
                              ↑
                        Nút thêm vào đây
```

### Đặc điểm nút (khi triển khai)

| Thuộc tính | Gợi ý |
|------------|--------|
| **Icon** | Layout (4 ô vuông) – ví dụ `Dashboard` hoặc `ViewModule` từ MUI |
| **Vị trí** | Trong `<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>`, trước Avatar |
| **Tooltip** | "Cấu hình Layout" |
| **Badge** | (Tùy chọn) chấm tím khi có thay đổi chưa lưu |
| **onClick** | Mở state `layoutConfigOpen` → render modal LayoutConfigManager |

### Ví dụ code (khi thêm)

```tsx
// Trong AppHeader.tsx
const [layoutConfigOpen, setLayoutConfigOpen] = useState(false)

// Trong Toolbar, trước Avatar:
<IconButton color="inherit" onClick={() => setLayoutConfigOpen(true)} title="Cấu hình Layout">
  <ViewModule />
</IconButton>
<LayoutConfigManager open={layoutConfigOpen} onClose={() => setLayoutConfigOpen(false)} />
```

---

## 2. Cấu trúc Layout Configuration Manager

Khi tạo component Layout Config cho unified, nên có cấu trúc tương tự 2025-main:

```
LayoutConfigManager (Modal/Dialog)
├── Page Selection (Sidebar trái) – danh sách trang
├── View Mode (Mobile / Tablet / Desktop)
├── Widget Management (Ẩn/Hiện widget theo trang)
└── Layout Preview (Xem trước bố cục)
```

### Tích hợp với unified

- **Context:** Có thể dùng `LayoutContext` (tạo trong `src/unified/app/` hoặc `src/contexts/`) để lưu cấu hình layout, hoặc localStorage.
- **Theme:** Dùng MUI theme và `useTheme` từ `src/contexts/ThemeContext` để đồng bộ Dark/Light.
- **Responsive:** Dùng MUI `useMediaQuery` hoặc breakpoints; không bắt buộc dùng Tailwind.

---

## 3. Cách truy cập (sau khi triển khai)

1. **Từ Header:** Click nút Layout (4 ô) bên phải, cạnh nút Dark/Light.
2. **Shortcut (tùy chọn):** `Ctrl + L` trong `AppHeader` hoặc MainLayout: `useEffect` + `keydown`.

---

## 4. Cách sử dụng chi tiết (cho người dùng cuối)

- **Bước 1:** Chọn trang cần cấu hình (sidebar trái).
- **Bước 2:** Chọn chế độ hiển thị: Mobile / Tablet / Desktop.
- **Bước 3:** Bật/tắt widget trong phần "Quản lý widget hiện tại".
- **Bước 4:** Xem trước trong "Xem trước bố cục"; Reset nếu cần.

(Chi tiết UX giữ nguyên như LAYOUT_CONFIG_GUIDE của 2025-main.)

---

## 5. File cần chỉnh khi triển khai

| Công việc | File |
|-----------|------|
| Thêm nút mở modal | `src/unified/shared/layout/AppHeader.tsx` |
| Tạo modal Layout Config | `src/unified/shared/layout/LayoutConfigManager.tsx` (hoặc `features/settings/`) |
| (Tùy chọn) Context lưu cấu hình | `src/unified/app/` hoặc `src/contexts/LayoutContext.ts` |

---

## 6. Lưu ý với .husky

Repo có `.husky` (ví dụ `commit-msg`). Khi sửa `AppHeader.tsx` hoặc thêm file mới trong `src/unified/`, vẫn chạy pre-commit như bình thường (lint, format). Không cần đổi cấu hình husky để dùng Layout Config.

---

**Tóm tắt:** Thêm mục Sidebar theo **UNIFIED_SIDEBAR_GUIDE.md**; khi muốn có Layout Configuration thì thêm nút trong **AppHeader** và tạo **LayoutConfigManager** như trên, đồng bộ với MUI và context của unified.
