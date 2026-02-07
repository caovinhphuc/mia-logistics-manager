## Đề Xuất Cấu Trúc Dự Án

### 1. Phân lớp tổng quát

```
mia-logistics-manager/
├─ package.json
├─ tsconfig.json
├─ craco.config.js           # Giữ nếu còn dùng CRACO
├─ .env / .env.*             # Biến môi trường
├─ public/                   # Tài nguyên tĩnh cho CRA
├─ docs/                     # Tài liệu kiến trúc, quy trình
├─ scripts/                  # Toàn bộ script automation (sh, js)
├─ config/                   # Cấu hình chung (ports, env templates, lint…)
├─ src/                      # Frontend (React)
├─ backend/                  # Backend Node/Express
├─ automation/               # Dịch vụ phụ (Python, cron…)
├─ tests/                    # Test end-to-end hoặc integration toàn hệ thống
└─ tools/                    # CLI, util build (tuỳ chọn)
```

### 2. Chi tiết thư mục `src/` (frontend React)

```
src/
├─ app/
│  ├─ providers/             # Context/App providers
│  ├─ routes/                # Khai báo route, lazy modules
│  └─ store/                 # Zustand/Redux/React Query setup
│
├─ features/
│  ├─ transport/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ api/
│  │  ├─ utils/
│  │  └─ types/
│  ├─ shipments/
│  ├─ locations/
│  └─ ...                    # Mỗi nghiệp vụ (domain) riêng biệt
│
├─ shared/
│  ├─ components/            # UI tái sử dụng (Buttons, Dialogs…)
│  ├─ hooks/                 # Hooks dùng chung giữa features
│  ├─ utils/                 # Helpers thuần
│  ├─ constants/
│  ├─ types/                 # Kiểu dữ liệu dùng chung
│  └─ services/              # Client service (auth, storage…)
│
├─ layouts/                  # Layout tổng thể (MainLayout, AuthLayout…)
├─ assets/                   # Ảnh, icon, font
├─ styles/                   # SCSS/Tailwind config
├─ env.d.ts                  # Khai báo ambient types
└─ index.tsx                 # Entry ReactDOM
```

### 3. Chi tiết `backend/` (Node/Express)

```
backend/
├─ package.json
├─ src/
│  ├─ app.ts                 # Khởi tạo Express app
│  ├─ server.ts              # Entry server
│  ├─ config/
│  ├─ routes/
│  ├─ controllers/
│  ├─ services/
│  ├─ repositories/          # Truy cập Google Sheets/DB
│  ├─ middlewares/
│  └─ utils/
├─ tests/
├─ prisma/ or supabase/      # Tuỳ backend sử dụng
└─ scripts/                  # Script riêng (seed, migrate…)
```

### 4. Thư mục `scripts/`

```
scripts/
├─ README.md                 # Giải thích các command
├─ manage.sh                 # Entrypoint duy nhất (start, build, deploy…)
├─ start/
│  ├─ frontend.sh
│  ├─ backend.sh
│  └─ automation.sh
├─ deploy/
│  ├─ production.sh
│  ├─ staging.sh
│  └─ vercel.sh
├─ maintenance/
│  ├─ fix-env.sh
│  ├─ fix-ports.sh
│  └─ audit.sh
└─ generators/
   ├─ generate-feature.sh
   └─ generate-structure.sh
```

### 5. Định hướng tách file `TransportRequests.tsx`

```
features/transport/
├─ components/
│  ├─ TransportRequests/
│  │  ├─ TransportRequests.tsx        # Component chính (mỏng)
│  │  ├─ CarrierSelect.tsx
│  │  ├─ LocationSelect.tsx
│  │  ├─ PricingSection.tsx
│  │  ├─ StopPointsTable.tsx
│  │  └─ SummaryPanel.tsx
│  └─ TransportTable.tsx
│
├─ hooks/
│  ├─ useTransportForm.ts
│  ├─ useCarrierPricing.ts
│  └─ useTransportValidation.ts
│
├─ api/
│  ├─ transportRequests.api.ts
│  └─ carriers.api.ts
│
├─ utils/
│  ├─ mapping.ts
│  ├─ formatter.ts
│  └─ validators.ts
│
└─ types/
   ├─ transport.types.ts
   └─ carrier.types.ts
```

### 6. Checklist triển khai cấu trúc mới

- [ ] Di chuyển script vào `scripts/`, tạo `manage.sh`
- [ ] Thiết lập alias đường dẫn trong `tsconfig.json`/`craco.config.js`
- [ ] Tách nhỏ `TransportRequests` theo cấu trúc trên
- [ ] Di chuyển hooks/utils chung sang `src/shared/`
- [ ] Cập nhật tài liệu (`docs/`) mô tả kiến trúc mới
- [ ] Thêm CI lint kiểm tra import chuẩn (`eslint-plugin-boundaries`/`import/no-cycle`)
