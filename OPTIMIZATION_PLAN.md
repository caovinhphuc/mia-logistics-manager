# 🎯 KẾ HOẠCH TỐI ƯU HÓA DỰ ÁN MIA LOGISTICS MANAGER

## 📅 Timeline: 4 Tuần

---

## 🔴 TUẦN 1: BẢO MẬT & DEPENDENCIES (CRITICAL)

### Ngày 1-2: Dọn dẹp Dependencies

**Mục tiêu**: Giảm 150 packages, tiết kiệm 300MB

```bash
# 1. Xóa unused dependencies
npm uninstall @craco/craco ajv exceljs html2canvas js-cookie lodash numeral jspdf

# 2. Cài đặt missing dependencies cho backend
npm install handlebars mjml socket.io node-telegram-bot-api node-fetch @sendgrid/mail

# 3. Audit và fix security
npm audit
npm audit fix --force  # Cẩn thận với breaking changes

# 4. Update dependencies lỗi thời
npm outdated
npm update

# 5. Verify sau khi thay đổi
npm test
npm run build
```

**Checklist:**

- [ ] Backup package.json hiện tại
- [ ] Xóa unused packages
- [ ] Cài missing packages
- [ ] Test ứng dụng hoạt động bình thường
- [ ] Commit changes

### Ngày 3-4: Xử lý Security Vulnerabilities

**Mục tiêu**: Giảm vulnerabilities xuống <10

```bash
# 1. Phân tích chi tiết
npm audit --json > audit-report.json

# 2. Fix từng vulnerability
npm audit fix

# 3. Xem xét nâng cấp react-scripts
npm info react-scripts version
npm install react-scripts@latest

# 4. Nếu không fix được, cân nhắc migrate sang Vite
npm create vite@latest mia-logistics-vite -- --template react-ts
```

**Option: Migrate sang Vite** (nếu react-scripts không update được)

```bash
# Install Vite
npm install -D vite @vitejs/plugin-react

# Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', 'date-fns', 'zustand']
        }
      }
    }
  }
})
EOF

# Update package.json scripts
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"
```

**Checklist:**

- [ ] Phân tích audit report
- [ ] Fix hoặc mitigate tất cả critical/high vulnerabilities
- [ ] Document các vulnerabilities không fix được
- [ ] Test security với OWASP ZAP hoặc tương tự

### Ngày 5: Dọn dẹp Code & Files

```bash
# 1. Xóa file backup/duplicate
rm -rf BACKUP-FILE-OLD/
rm -rf archive/
rm -rf backup/
rm *.bak
rm README\ copy.md README-OLD.md README-NEW.md

# 2. Consolidate markdown docs
mkdir -p docs/reports
mv *_REPORT.md docs/reports/
mv *_AUDIT.md docs/reports/
mv *_STATUS.md docs/reports/

# 3. Xóa duplicate configs
rm webpack.config.js.bak
rm next.config.js.bak
rm vite.config.js.bak

# 4. Xóa test/debug files cũ
rm -rf logs/
find . -name "*.log" -type f -delete
```

**Checklist:**

- [ ] Backup trước khi xóa
- [ ] Xóa files/folders không cần thiết
- [ ] Tổ chức lại docs
- [ ] Update MASTER_INDEX.md
- [ ] Commit changes

---

## 🟡 TUẦN 2: PERFORMANCE OPTIMIZATION

### Ngày 1-2: Bundle Size Optimization

**Mục tiêu**: Giảm bundle size từ 13MB xuống <5MB

#### 1. Setup Bundle Analyzer

```bash
npm install -D webpack-bundle-analyzer

# Thêm vào package.json
npm pkg set scripts.analyze="npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
```

#### 2. Implement Code Splitting

**File: src/App.js - Thêm lazy loading**

```javascript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@components/shared/LoadingSpinner';

// Lazy load pages
const Dashboard = lazy(() => import('@pages/Dashboard'));
const Employees = lazy(() => import('@pages/Employees'));
const Transport = lazy(() => import('@pages/Transport'));
const Warehouse = lazy(() => import('@pages/Warehouse'));
const InboundDomestic = lazy(() => import('@pages/InboundDomestic'));
const InboundInternational = lazy(() => import('@pages/InboundInternational'));
const Carriers = lazy(() => import('@pages/Carriers'));
const Transfers = lazy(() => import('@pages/Transfers'));

// Wrapper với Suspense
const LazyPage = ({ children }) => <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LazyPage>
              <Dashboard />
            </LazyPage>
          }
        />
        <Route
          path="/employees"
          element={
            <LazyPage>
              <Employees />
            </LazyPage>
          }
        />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

#### 3. Optimize Dependencies

**File: src/utils/dateUtils.js - Thay moment bằng date-fns**

```javascript
// ❌ BAD: Import toàn bộ moment (70KB)
import moment from 'moment';

// ✅ GOOD: Import chỉ functions cần thiết từ date-fns (2KB)
import { format, parseISO, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date) => format(parseISO(date), 'dd/MM/yyyy', { locale: vi });
```

#### 4. Implement Tree Shaking

**File: src/components/index.js**

```javascript
// ❌ BAD: Export all
export * from './Button';
export * from './Input';
// ... 50+ components

// ✅ GOOD: Named exports only
export { Button } from './Button';
export { Input } from './Input';
// Import chính xác: import { Button } from '@components';
```

**Checklist:**

- [ ] Run bundle analyzer
- [ ] Identify large chunks (>244KB)
- [ ] Implement lazy loading cho routes
- [ ] Replace moment với date-fns
- [ ] Configure tree shaking
- [ ] Verify bundle size giảm >50%

### Ngày 3: Component Optimization

#### 1. Memoization

**File: src/components/DataTable.jsx**

```javascript
import React, { memo, useMemo, useCallback } from 'react';

// Memoize component
const DataTable = memo(
  ({ data, columns, onRowClick }) => {
    // Memoize expensive calculations
    const sortedData = useMemo(() => {
      return [...data].sort((a, b) => a.id - b.id);
    }, [data]);

    // Memoize callbacks
    const handleRowClick = useCallback(
      (row) => {
        onRowClick?.(row);
      },
      [onRowClick]
    );

    return <table>{/* table content */}</table>;
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.data === nextProps.data && prevProps.columns === nextProps.columns;
  }
);

export default DataTable;
```

#### 2. Virtual Scrolling

**File: src/components/VirtualList.jsx**

```javascript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => <div style={style}>{items[index].name}</div>;

  return (
    <FixedSizeList height={600} itemCount={items.length} itemSize={50} width="100%">
      {Row}
    </FixedSizeList>
  );
}
```

**Checklist:**

- [ ] Identify components re-rendering unnecessarily
- [ ] Add React.memo to expensive components
- [ ] Use useMemo for expensive calculations
- [ ] Use useCallback for event handlers
- [ ] Implement virtual scrolling cho lists >100 items

### Ngày 4-5: Image & Asset Optimization

```bash
# 1. Install optimization tools
npm install -D imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant

# 2. Create optimization script
cat > scripts/optimize-images.js << 'EOF'
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
  await imagemin(['src/assets/images/*.{jpg,png}'], {
    destination: 'src/assets/images/optimized',
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.6, 0.8] }),
      imageminWebp({ quality: 80 })
    ]
  });

  console.log('✅ Images optimized!');
})();
EOF

# 3. Run optimization
node scripts/optimize-images.js
```

**Implement lazy loading images:**

```javascript
// src/components/LazyImage.jsx
import { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt, placeholder }) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={isLoaded ? 'loaded' : 'loading'}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
```

**Checklist:**

- [ ] Optimize all images trong src/assets
- [ ] Convert to WebP where possible
- [ ] Implement lazy loading
- [ ] Add blur placeholder
- [ ] Test loading performance

---

## 🟢 TUẦN 3: CODE QUALITY & TYPESCRIPT

### Ngày 1-2: TypeScript Migration

**Mục tiêu**: Migrate 50% critical files sang TypeScript

#### Priority files to migrate:

1. **Services** (High priority)

```bash
# Convert API services
mv src/services/googleSheetsService.js src/services/googleSheetsService.ts
mv src/services/authService.js src/services/authService.ts
mv src/services/apiService.js src/services/apiService.ts
```

2. **Types** (Create if not exists)

```typescript
// src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// src/types/models.ts
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Transport {
  id: string;
  orderId: string;
  from: string;
  to: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  carrier: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  manager: string;
  status: 'active' | 'inactive';
}
```

3. **Hooks** (Medium priority)

```typescript
// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { ApiResponse } from '@/types/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

function useApi<T = any>(options?: UseApiOptions<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (response.success) {
          setData(response.data);
          options?.onSuccess?.(response.data);
        } else {
          const errorMsg = response.error || 'Unknown error';
          setError(errorMsg);
          options?.onError?.(errorMsg);
        }

        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Request failed';
        setError(errorMsg);
        options?.onError?.(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { loading, error, data, execute };
}

export default useApi;
```

**Checklist:**

- [ ] Update tsconfig.json với strict mode
- [ ] Create core types
- [ ] Migrate services to TS
- [ ] Migrate hooks to TS
- [ ] Run type check: `npm run type-check`
- [ ] Fix all type errors

### Ngày 3: Code Quality & Linting

#### 1. ESLint Configuration

```javascript
// .eslintrc.json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    // Performance
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-no-bind": ["warn", { "allowArrowFunctions": true }],

    // Code quality
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",

    // TypeScript
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_"
    }]
  }
}
```

#### 2. Cleanup Console Statements

```bash
# Find all console statements
grep -r "console\." src/ --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" > console-usage.txt

# Replace console.log with logger
find src/ -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's/console\.log/logger.debug/g' {} +
```

**Checklist:**

- [ ] Configure ESLint rules
- [ ] Run lint: `npm run lint`
- [ ] Fix all errors
- [ ] Replace console statements
- [ ] Add pre-commit hooks

### Ngày 4-5: Testing & Coverage

```bash
# 1. Install testing tools
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# 2. Create test utilities
mkdir -p src/__tests__/utils
```

**File: src/**tests**/utils/test-utils.tsx**

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

**Example tests:**

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import Button from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

**Checklist:**

- [ ] Setup test utilities
- [ ] Write tests cho critical components
- [ ] Write tests cho services
- [ ] Run tests: `npm test`
- [ ] Achieve >70% coverage
- [ ] Add to CI/CD

---

## 🔵 TUẦN 4: MONITORING & DOCUMENTATION

### Ngày 1-2: Monitoring Setup

#### 1. Sentry Integration

```bash
npm install @sentry/react @sentry/tracing
```

**File: src/utils/sentry.ts**

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        // Filter out sensitive data
        if (event.request) {
          delete event.request.cookies;
        }
        return event;
      },
    });
  }
}
```

#### 2. Performance Monitoring

**File: src/utils/performanceMonitor.ts**

```typescript
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function initPerformanceMonitoring() {
  const sendToAnalytics = (metric: PerformanceMetric) => {
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.rating,
      });
    }

    // Send to backend
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(() => {
      // Fail silently
    });
  };

  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

**Checklist:**

- [ ] Setup Sentry account
- [ ] Configure Sentry
- [ ] Setup performance monitoring
- [ ] Configure error boundaries
- [ ] Test error reporting

### Ngày 3: Analytics Setup

```bash
npm install react-ga4
```

**File: src/utils/analytics.ts**

```typescript
import ReactGA from 'react-ga4';

export function initAnalytics() {
  if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
    ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);
  }
}

export function trackPageView(path: string) {
  ReactGA.send({ hitType: 'pageview', page: path });
}

export function trackEvent(category: string, action: string, label?: string, value?: number) {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
}
```

**Checklist:**

- [ ] Setup Google Analytics 4
- [ ] Configure tracking
- [ ] Track key user actions
- [ ] Setup conversion goals
- [ ] Test tracking

### Ngày 4-5: Documentation Overhaul

#### 1. Consolidate Documentation

```bash
# Create new structure
mkdir -p docs/{api,guides,architecture,deployment}

# Move files
mv docs/API.md docs/api/
mv docs/SWAGGER.yaml docs/api/
mv DEPLOYMENT*.md docs/deployment/
mv *_SETUP.md docs/guides/
```

#### 2. Create Developer Guide

**File: docs/DEVELOPER_GUIDE.md**

```markdown
# Developer Guide

## Quick Start

\`\`\`bash

# Clone

git clone https://github.com/your-org/mia-logistics-manager
cd mia-logistics-manager

# Install

npm install

# Configure

cp .env.example .env

# Edit .env with your credentials

# Start

npm start
\`\`\`

## Architecture

### Frontend

- React 18 với TypeScript
- Material-UI v5
- React Router v6
- Zustand state management
- React Query data fetching

### Backend

- Node.js + Express
- Google Sheets API
- Google Drive API
- JWT Authentication

### Project Structure

\`\`\`
src/
├── components/ # Reusable components
├── pages/ # Page components
├── features/ # Feature modules
├── services/ # API services
├── hooks/ # Custom hooks
├── utils/ # Utilities
├── types/ # TypeScript types
└── stores/ # Zustand stores
\`\`\`

## Development Workflow

### 1. Create Feature Branch

\`\`\`bash
git checkout -b feature/your-feature
\`\`\`

### 2. Make Changes

- Follow code style guide
- Write tests
- Update documentation

### 3. Test

\`\`\`bash
npm test
npm run lint
npm run type-check
\`\`\`

### 4. Commit

\`\`\`bash
git add .
git commit -m "feat: your feature description"
\`\`\`

### 5. Push & PR

\`\`\`bash
git push origin feature/your-feature

# Create PR on GitHub

\`\`\`

## Code Style

### TypeScript

- Use interfaces over types
- Explicit return types for functions
- No `any` (use `unknown` if needed)

### React

- Functional components only
- Hooks for state management
- Memo for performance

### Naming

- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case

## Testing

### Unit Tests

\`\`\`typescript
// MyComponent.test.tsx
describe('MyComponent', () => {
it('should render correctly', () => {
render(<MyComponent />);
expect(screen.getByText('Hello')).toBeInTheDocument();
});
});
\`\`\`

### Integration Tests

\`\`\`typescript
// api.test.ts
describe('API Service', () => {
it('should fetch employees', async () => {
const employees = await api.getEmployees();
expect(employees).toHaveLength(10);
});
});
\`\`\`

## Performance

### Bundle Size

- Target: <500KB gzipped
- Use lazy loading
- Code splitting
- Tree shaking

### Runtime

- Memoize expensive calculations
- Virtual scrolling for large lists
- Debounce user input
- Optimize images

## Deployment

See [Deployment Guide](./deployment/DEPLOYMENT.md)
```

#### 3. Update README

Simplify README.md, move detailed docs to separate files

**Checklist:**

- [ ] Consolidate all markdown files
- [ ] Create developer guide
- [ ] Create API documentation
- [ ] Update README
- [ ] Create ARCHITECTURE.md
- [ ] Add diagrams

---

## 📊 KẾT QUẢ MONG ĐỢI

### Metrics

| Metric                   | Before | After | Improvement |
| ------------------------ | ------ | ----- | ----------- |
| node_modules size        | 2.1GB  | 1.5GB | -30%        |
| Build size               | 13MB   | 5MB   | -60%        |
| Dependencies             | 2,216  | 2,050 | -166        |
| Security vulnerabilities | 41     | <10   | -75%        |
| Bundle load time         | 4-5s   | 1-2s  | -60%        |
| Test coverage            | 0%     | 70%   | +70%        |
| TypeScript coverage      | 20%    | 60%   | +40%        |
| Lighthouse score         | 75     | 95+   | +20         |

### Deliverables

✅ **Tuần 1**: Clean codebase, <10 security issues
✅ **Tuần 2**: Optimized bundle, <5MB, load time <2s
✅ **Tuần 3**: 70% test coverage, 60% TypeScript
✅ **Tuần 4**: Full monitoring, consolidated docs

---

## 🎯 HƯỚNG DẪN THỰC HIỆN

### Chuẩn bị

```bash
# 1. Backup toàn bộ dự án
cd /Users/phuccao/Projects
cp -r mia-logistics-manager mia-logistics-manager-backup-$(date +%Y%m%d)

# 2. Create feature branch
cd mia-logistics-manager
git checkout -b feature/optimization-v2

# 3. Install tools
npm install -D webpack-bundle-analyzer imagemin imagemin-webp
```

### Execution

Thực hiện từng tuần theo checklist, commit thường xuyên:

```bash
# Sau mỗi task hoàn thành
git add .
git commit -m "chore: [TASK_NAME]"

# Sau mỗi tuần
git push origin feature/optimization-v2
# Tạo PR để review
```

### Testing

Sau mỗi thay đổi lớn:

```bash
npm test
npm run build
npm run lint
npm run type-check
npm start  # Manual testing
```

### Rollback Plan

Nếu có vấn đề:

```bash
# Rollback last commit
git reset --hard HEAD~1

# Rollback to backup
cp -r ../mia-logistics-manager-backup-YYYYMMDD/* .

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 NOTES

- **Ưu tiên**: Security > Performance > Code Quality > Documentation
- **Testing**: Test sau mỗi thay đổi lớn
- **Backup**: Backup trước mỗi thay đổi breaking
- **Communication**: Update progress hàng ngày
- **Flexibility**: Điều chỉnh timeline nếu cần

---

## ✅ CHECKLIST TỔNG

### Tuần 1: Bảo mật & Dependencies

- [ ] Xóa unused packages
- [ ] Cài missing packages
- [ ] Fix security vulnerabilities
- [ ] Dọn dẹp files/folders
- [ ] Test & commit

### Tuần 2: Performance

- [ ] Bundle analyzer & optimization
- [ ] Code splitting & lazy loading
- [ ] Component memoization
- [ ] Image optimization
- [ ] Test & measure improvements

### Tuần 3: Code Quality

- [ ] TypeScript migration (50%)
- [ ] ESLint configuration
- [ ] Remove console statements
- [ ] Write tests (70% coverage)
- [ ] Test & commit

### Tuần 4: Monitoring & Docs

- [ ] Setup Sentry
- [ ] Setup performance monitoring
- [ ] Setup analytics
- [ ] Consolidate documentation
- [ ] Final testing & deployment

---

**Prepared by**: GitHub Copilot
**Date**: 2026-02-07
**Version**: 1.0
