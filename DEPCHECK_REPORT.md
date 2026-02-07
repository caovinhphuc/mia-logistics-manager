# Báo cáo Depcheck - MIA Logistics Manager

**Ngày kiểm tra:** 2026-02-07

---

## Tóm tắt

| Loại | Depcheck báo | Thực tế |
|------|--------------|---------|
| Unused | 9 packages | 7-8 thật sự unused |
| Missing | 11 packages | 5 cần cài, 6 đã có / có thể bỏ qua |

---

## 1. UNUSED DEPENDENCIES

### Đúng – có thể xóa an toàn

| Package | Lý do |
|---------|-------|
| `@craco/craco` | Script dùng `react-scripts`, không dùng craco. Có thể xóa. |
| `ajv` | Không có import nào trong codebase. |
| `exceljs` | Không có import nào trong src/backend. |
| `html2canvas` | Không có import trong src. |
| `js-cookie` | Không có import trong src. |
| `lodash` | Không có import (chỉ có string `_.g.MB` trong suppressWarnings). |
| `numeral` | Không có import trong src. |
| `jspdf` (dev) | Không có import trong src. |

### Sai – nên giữ

| Package | Lý do |
|---------|-------|
| `pug` | **ĐANG DÙNG** – `backend/src/app.js` dùng `app.set("view engine", "pug")`. |
| `moment-timezone` | Có thể được dùng gián tiếp qua moment hoặc dependency khác. Kiểm tra kỹ trước khi xóa. |
| `@types/node` (dev) | Cần cho TypeScript khi build/type-check. **Giữ.** |

---

## 2. MISSING DEPENDENCIES

### Đã có trong package.json (depcheck có thể chạy lệch thời điểm)

| Package | File depcheck báo | Trạng thái |
|---------|-------------------|------------|
| `bcrypt` | src/server.js | Có trong package.json |
| `jsonwebtoken` | src/server.js | Có trong package.json |
| `@mui/system` | src/styles/theme.js | Có trong package.json |
| `google-spreadsheet` | initializeSheets.ts | Có trong package.json |
| `react-chartjs-2` | YourMetricsWidget.jsx | Có trong package.json |

### Cần cài thêm (backend/index.js & services)

Backend entry `backend/index.js` dùng các service sau, cần các package tương ứng:

| Package | File dùng | Lệnh cài |
|---------|-----------|----------|
| `handlebars` | backend/services/emailService.js | `npm install handlebars` |
| `mjml` | backend/services/emailService.js | `npm install mjml` |
| `socket.io` | backend/services/realtimeService.js | `npm install socket.io` |
| `node-telegram-bot-api` | backend/services/telegramService.js | `npm install node-telegram-bot-api` |
| `node-fetch` | backend/index.js | `npm install node-fetch` |
| `@sendgrid/mail` | backend/services/emailService.js | `npm install @sendgrid/mail` |

### Có thể bỏ qua

| Package | File | Lý do |
|---------|------|-------|
| `form-data` | scripts/testTelegramConnection.js | Script test/dev, ít dùng. |
| `react-toastify` | BACKUP-FILE-OLD/App.tsx | File backup, project dùng react-hot-toast. |

---

## 3. HÀNH ĐỘNG ĐỀ XUẤT

### Cài packages còn thiếu (nếu chạy backend đầy đủ)

```bash
npm install handlebars mjml socket.io node-telegram-bot-api node-fetch @sendgrid/mail
```

### Xóa packages không dùng (chọn một trong hai)

**Cách 1 – Xóa từng cái (an toàn hơn):**

```bash
npm uninstall @craco/craco ajv exceljs html2canvas js-cookie lodash numeral jspdf
```

**Cách 2 – Giữ lại một thời gian:**

- `moment-timezone`: có thể còn dùng gián tiếp.
- `exceljs`, `html2canvas`: có thể dùng sau cho export/chụp màn hình.

### Lệnh đúng khi cài package

```bash
# Cài dependency thường
npm install <package-name>

# Cài devDependency
npm install <package-name> --save-dev
# hoặc
npm install <package-name> -D
```

---

## 4. LƯU Ý

- Backend hiện dùng **server.cjs** (không load email/telegram/realtime). Các package trên chỉ cần khi chạy `backend/index.js`.
- `src/server.js` là entry riêng (khác với `backend/`), dùng bcrypt + jsonwebtoken.
- Sau khi sửa, chạy `npx depcheck` lại để đối chiếu.
