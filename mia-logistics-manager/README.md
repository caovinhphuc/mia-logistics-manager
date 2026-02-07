# 🚀 MIA Logistics Manager

Hệ thống quản lý logistics được xây dựng với **React 19** + **TypeScript**

## 📋 Mục Lục

- [Tính năng](#-tính-năng)
- [Công nghệ](#️-công-nghệ)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Development](#️-development)
- [Scripts](#-scripts)

## ✨ Tính năng

- ⚡ **React 19** + **TypeScript 4.9** - Type-safe development
- 🎨 **Component Library** - Button, Card và các component tái sử dụng
- 🔄 **API Service Layer** - Axios với interceptors
- 🎯 **Custom Hooks** - useLocalStorage, useWindowSize, useDebounce
- 📦 **Modular Structure** - Clean architecture với path aliases
- 🛠️ **VS Code Integration** - Prettier, ESLint, Debug configs
- 🎭 **Inline Styles** - Component styling không cần CSS files

## 🛠️ Công nghệ

### Core

- **React:** 19.2.4
- **TypeScript:** 4.9.5
- **React Scripts:** 5.0.1

### UI & Styling

- **@mui/material:** 7.3.7
- **@emotion/react & styled:** Latest
- Inline styles cho components

### State & Data

- **@tanstack/react-query:** 5.90.20
- **react-hook-form:** 7.71.1
- **axios:** Latest

### Development

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **VS Code** - Configured workspace

## 📦 Cài đặt

### Yêu cầu

- **Node.js:** >= 16.x
- **npm:** >= 8.x

### Các bước cài đặt

```bash
# Clone repository
git clone <repository-url>
cd mia-logistics-manager

# Cài dependencies (luôn dùng --legacy-peer-deps)
npm install --legacy-peer-deps

# Hoặc dùng Make
make install
```

### Cấu hình môi trường

```bash
# Copy file .env.example
cp .env.example .env

# Chỉnh sửa .env
nano .env
```

**File .env:**

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## 🚀 Sử dụng

### Khởi động Development Server

```bash
# Cách 1: Dùng shell script (khuyến nghị)
./start-project.sh

# Cách 2: Dùng Make
make start

# Cách 3: Dùng npm
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

### Build Production

```bash
# Build
npm run build

# Hoặc
make build
```

Output: `build/` directory

### Run Tests

```bash
npm test
```

## 📁 Cấu trúc dự án

```
mia-logistics-manager/
├── public/                 # Static assets
├── src/
│   ├── App.tsx             # ✅ Main component
│   ├── index.tsx           # ✅ Entry point
│   ├── react-app-env.d.ts  # ✅ Type declarations
│   ├── index.css           # Global styles
│   │
│   ├── components/         # ✅ React components
│   │   └── common/
│   │       ├── Button.tsx  # Reusable button
│   │       ├── Card.tsx    # Reusable card
│   │       └── index.ts
│   │
│   ├── features/           # ✅ Feature modules (empty, ready)
│   │   └── .gitkeep
│   │
│   ├── hooks/              # ✅ Custom React hooks
│   │   └── index.ts        # useLocalStorage, useWindowSize, useDebounce
│   │
│   ├── services/           # ✅ API services
│   │   ├── api.service.ts  # Axios instance with interceptors
│   │   └── index.ts
│   │
│   ├── types/              # ✅ TypeScript definitions
│   │   ├── common.ts       # Common types
│   │   ├── api.ts          # API types
│   │   └── index.ts
│   │
│   ├── utils/              # ✅ Utility functions
│   │   ├── helpers.ts      # formatDate, formatCurrency, debounce
│   │   └── index.ts
│   │
│   ├── config/             # ✅ Configuration
│   │   └── index.ts        # App config
│   │
│   └── constants/          # ✅ Constants
│       └── index.ts        # API_ENDPOINTS, ROUTES, etc.
│
├── scripts/                # Utility scripts
│   ├── shell/              # Shell scripts
│   │   ├── start-project.sh
│   │   ├── stop-project.sh
│   │   ├── restart-project.sh
│   │   └── ...
│   ├── core/               # Core utilities
│   ├── deploy/             # Deployment scripts
│   ├── setup/              # Setup scripts
│   └── tests/              # Test scripts
│
├── .vscode/                # VS Code configuration
│   ├── settings.json       # Editor settings
│   ├── extensions.json     # Recommended extensions
│   ├── launch.json         # Debug configs
│   └── tasks.json          # Build tasks
│
├── .editorconfig           # Editor config
├── .eslintrc.json          # ESLint rules
├── .prettierrc             # Prettier config
├── .gitignore              # Git ignore
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies
├── Makefile                # Make commands
└── README.md               # This file
```

## 🏗️ Development

### Tạo Component Mới

```typescript
// src/components/MyComponent.tsx
import React from 'react'

interface MyComponentProps {
  title: string
  onClick?: () => void
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
    </div>
  )
}

export default MyComponent
```

### Sử dụng Custom Hooks

```typescript
import { useLocalStorage, useWindowSize, useDebounce } from './hooks'

function MyComponent() {
  // Persistent state
  const [user, setUser] = useLocalStorage('user', null)

  // Responsive design
  const { width, height } = useWindowSize()

  // Debounced search
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
}
```

### Tạo API Service

```typescript
import { apiService } from './services'

// GET request
const response = await apiService.get('/api/users')

// POST request
const response = await apiService.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
})
```

### Path Aliases

TypeScript config hỗ trợ path aliases:

```typescript
import { Button, Card } from '@components/common'
import { useLocalStorage } from '@hooks'
import { apiService } from '@services'
import { formatDate } from '@utils'
import { config } from '@config'
import { API_ENDPOINTS } from '@constants'
import type { User, ApiResponse } from '@types'
```

## 📜 Scripts

### Makefile Commands

```bash
make help                 # Show all commands
make install              # Install dependencies
make start                # Start dev server
make build                # Build production
make test                 # Run tests
make clean                # Clean build artifacts
```

### Shell Scripts

```bash
# Start/Stop
./start-project.sh                   # Khởi động dự án
./scripts/shell/stop-project.sh      # Dừng dự án
./scripts/shell/restart-project.sh   # Khởi động lại

# Setup
./scripts/shell/setup-env.sh         # Setup môi trường
./scripts/shell/setup-google-apis.sh # Setup Google APIs

# Testing
./scripts/shell/test-connections.sh  # Test connections

# Generate
./scripts/generate-feature.sh <name> # Tạo feature module mới
./scripts/generate-page.sh <name>    # Tạo page mới
```

## 🔧 Troubleshooting

### Port đã được sử dụng

```bash
./scripts/shell/stop-project.sh
# Hoặc
lsof -ti:3000 | xargs kill -9
```

### Dependencies conflict

```bash
# Luôn dùng --legacy-peer-deps
npm install --legacy-peer-deps
```

### Build errors

```bash
# Clean và rebuild
rm -rf node_modules build
npm install --legacy-peer-deps
npm run build
```

### TypeScript errors

```bash
# Check TypeScript version (phải là 4.9.x)
npm list typescript

# Reinstall nếu sai version
npm uninstall typescript
npm install --save-dev typescript@~4.9.5 --legacy-peer-deps
```

## 🎯 Best Practices

1. **Luôn dùng TypeScript** - Không tạo file .js/.jsx
2. **Dùng path aliases** - Import từ `@components` thay vì `../../components`
3. **Inline styles** - Không cần tạo CSS files riêng
4. **Type safety** - Define interfaces cho tất cả props
5. **Custom hooks** - Tái sử dụng logic giữa components
6. **API service** - Dùng centralized service thay vì fetch trực tiếp

## 📝 Notes

- ⚠️ **TypeScript 4.9.5** - React Scripts 5.0.1 chỉ support TS 3.x-4.x
- ⚠️ **--legacy-peer-deps** - Bắt buộc khi install packages
- ✅ **100% TypeScript** - Không còn file .js trong src/
- ✅ **No CSS files** - Components dùng inline styles
- ✅ **Clean structure** - Features folder sẵn sàng cho modules mới

## 📝 License

Private and proprietary.

## 👥 Contributors

- **Developer:** MIA Team
- **Email:** support@mia.vn

---

**Made with ❤️ by MIA Team**

## 🔧 Troubleshooting

**Port đã được sử dụng:**

```bash
./scripts/shell/stop-project.sh
# Hoặc
lsof -ti:3000 | xargs kill -9
```

**Dependencies conflict:**

```bash
# Luôn dùng --legacy-peer-deps
npm install --legacy-peer-deps
```

**TypeScript version mismatch:**

```bash
# Kiểm tra version (phải là 4.9.5)
npm list typescript

# Nếu sai version, cài lại
npm uninstall typescript
npm install --save-dev typescript@~4.9.5 --legacy-peer-deps
```

**Build errors:**

```bash
# Clean và rebuild
rm -rf node_modules build
npm install --legacy-peer-deps
npm run build
```

## 📚 Xem Thêm

- **[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)** - Kiến trúc chi tiết
- **[CHANGELOG.md](CHANGELOG.md)** - Lịch sử phiên bản
- **[MASTER_INDEX.md](MASTER_INDEX.md)** - Index tất cả tài liệu

## ⚠️ Important Notes

- **TypeScript 4.9.5** - React Scripts 5.0.1 chỉ support TS 3.x-4.x (ĐỪNG upgrade!)
- **--legacy-peer-deps** - BẮT BUỘC khi install/update packages
- **100% TypeScript** - Không tạo file .js/.jsx trong src/
- **No CSS files** - Components dùng inline styles (đã loại bỏ CSS modules)
- **Fresh install** - Sau khi git clone, chạy `npm install --legacy-peer-deps`

## 📝 License

Private and proprietary.

---

**Made with ❤️ by MIA Team**
**Last Updated:** February 8, 2026 | **Version:** 2.1.0
