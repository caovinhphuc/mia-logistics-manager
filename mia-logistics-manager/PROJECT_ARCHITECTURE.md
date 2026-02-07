# 🏗️ Project Architecture - MIA Logistics Manager

**Complete technical architecture and structure guide for developers.**

---

## 📊 Technology Stack

### Frontend Framework

- **React**: 19.2.4 (latest version)
- **React DOM**: 19.2.4
- **TypeScript**: 4.9.5 (pinned for react-scripts 5.0.1 compatibility)
- **Build Tool**: react-scripts 5.0.1 (Webpack-based)

### UI & Styling

- **@mui/material**: 7.3.7 - Material Design components
- **@emotion/react**: Latest - CSS-in-JS engine for MUI
- **@emotion/styled**: Latest - Styled components for MUI
- **Inline Styles**: TypeScript-based inline styling (no CSS modules)

### Form & Data Management

- **react-hook-form**: 7.71.1 - Form state management with validation
- **@tanstack/react-query**: 5.90.20 - Server state and data fetching
- **axios**: Latest - HTTP client with interceptors

### Development & Tooling

- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **EditorConfig**: Cross-editor consistency
- **TypeScript Compiler**: Strict mode enabled

---

## 📁 Project Structure

### Root Level Files

```
mia-logistics-manager/
├── README.md                          # Main documentation
├── CHANGELOG.md                       # Version history
├── MASTER_INDEX.md                    # Documentation index
├── PROJECT_ARCHITECTURE.md            # This file
├── package.json                       # Dependencies & npm scripts
├── tsconfig.json                      # TypeScript configuration
├── Makefile                           # Make commands (50+)
├── .env.example                       # Environment variables template
│
├── .gitignore                         # Git ignore rules
├── .prettierrc                        # Prettier config
├── .editorconfig                      # Editor config
├── .eslintrc.json                     # ESLint rules
│
└── [other config files]
```

### Source Code Structure

```
src/
├── 📱 components/                     # React components
│   ├── common/                        # Shared components
│   │   ├── Button.tsx                 # Button with variants
│   │   ├── Card.tsx                   # Card container
│   │   └── index.ts                   # Component exports
│   ├── [future feature components]
│   └── index.ts                       # All component exports
│
├── 🔧 services/                       # API & external services
│   ├── api.service.ts                 # Axios instance with interceptors
│   └── index.ts                       # Service exports
│
├── 🪝 hooks/                          # Custom React hooks
│   ├── useLocalStorage.ts             # Persistent state
│   ├── useWindowSize.ts               # Responsive design
│   ├── useDebounce.ts                 # Debounced values
│   └── index.ts                       # Hook exports
│
├── 📝 types/                          # TypeScript definitions
│   ├── common.ts                      # Common types (BaseEntity, User, etc.)
│   ├── api.ts                         # API types (ApiResponse, etc.)
│   └── index.ts                       # Type exports
│
├── 🛠️ utils/                          # Utility functions
│   ├── helpers.ts                     # Formatting, debounce, isEmpty
│   └── index.ts                       # Utility exports
│
├── ⚙️ config/                         # Configuration
│   └── index.ts                       # getEnv helper, API base URL
│
├── 📦 constants/                      # App constants
│   └── index.ts                       # Routes, API endpoints
│
├── ✨ features/                       # Feature modules (future use)
│   └── [feature-name]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── utils/
│       └── index.ts
│
├── 🎨 App.tsx                         # Main app component
├── 📌 index.tsx                       # Entry point
├── 📋 react-app-env.d.ts              # Type declarations
├── 📦 index.css                       # Global styles
└── ⚙️ setupTests.ts                   # Test configuration (future)
```

### Scripts Structure

```
scripts/
├── 🔧 shell/                          # Shell scripts
│   ├── start-project.sh               # Start development
│   ├── build.sh                       # Build production
│   ├── test-connections.sh            # Test system
│   └── [other utilities]
│
├── 📦 core/                           # Core utilities
│   ├── health-check.js                # Health monitoring
│   ├── email-notifier.js              # Email notifications
│   └── [other utilities]
│
├── 🚀 deploy/                         # Deployment scripts
├── 🧪 tests/                          # Test scripts
├── ✅ checks/                         # System checks
└── ⚙️ setup/                          # Setup utilities
```

### VS Code Configuration

```
.vscode/
├── settings.json                      # Workspace settings
├── extensions.json                    # Recommended extensions
├── launch.json                        # Debug configurations
└── tasks.json                         # Build tasks
```

---

## 🎯 Path Aliases

TypeScript path aliases for clean imports:

```typescript
// ❌ Avoid
import Button from '../../../components/common/Button'
import { useLocalStorage } from '../../../hooks'

// ✅ Use
import Button from '@components/common/Button'
import { useLocalStorage } from '@hooks'
```

### Configured Aliases

| Alias         | Path              | Purpose                |
| ------------- | ----------------- | ---------------------- |
| `@components` | `src/components/` | React components       |
| `@hooks`      | `src/hooks/`      | Custom hooks           |
| `@services`   | `src/services/`   | API services           |
| `@utils`      | `src/utils/`      | Utility functions      |
| `@types`      | `src/types/`      | TypeScript definitions |
| `@config`     | `src/config/`     | Configuration          |
| `@constants`  | `src/constants/`  | App constants          |

---

## 🔄 Data Flow Architecture

### API Integration Flow

```
┌─────────────────────────────────────────────────────┐
│ React Component (UI)                                │
└──────────────────┬──────────────────────────────────┘
                   │ useQuery / useMutation
                   ▼
┌─────────────────────────────────────────────────────┐
│ TanStack React Query (Data Management)              │
├─────────────────────────────────────────────────────┤
│ - Caching                                           │
│ - Automatic refetching                              │
│ - Background updates                                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ API Service Layer (api.service.ts)                  │
├─────────────────────────────────────────────────────┤
│ - Axios instance                                    │
│ - Request/Response interceptors                     │
│ - Token management                                  │
│ - Error handling                                    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Backend API (REST endpoints)                        │
└─────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────┐
│ App.tsx (Root Component)                            │
├─────────────────────────────────────────────────────┤
│ - React Router setup (future)                       │
│ - Global state (Redux/Zustand - future)            │
│ - Theme provider                                    │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ Feature Modules  │  │ Common Component │
├──────────────────┤  ├──────────────────┤
│ - Dashboard      │  │ - Button         │
│ - Orders         │  │ - Card           │
│ - Customers      │  │ - [future]       │
│ - [future]       │  └──────────────────┘
└──────────────────┘
```

---

## 🏗️ Build Process

### Development Build

```bash
npm start
# or
make start
```

**What happens:**

1. Webpack compiles TypeScript to JavaScript
2. React Fast Refresh enables HMR (Hot Module Replacement)
3. Dev server runs on `http://localhost:3000`
4. Browser opens automatically
5. Changes auto-reload without full page refresh

### Production Build

```bash
npm run build
# or
make build
```

**Output:**

- Optimized bundle in `build/` folder
- Tree-shaking removes unused code
- Code splitting for better performance
- Bundle size: ~60 kB gzipped

### Build Configuration

- **Tool**: react-scripts 5.0.1 (Webpack-based)
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx (React 17+)
- **Strict Mode**: ✅ Enabled for TypeScript

---

## 🔐 Security & Type Safety

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true, // All strict checks
    "noImplicitAny": true, // Require type annotations
    "strictNullChecks": true, // null/undefined checking
    "strictFunctionTypes": true, // Function parameter checking
    "esModuleInterop": true, // Module interop
    "skipLibCheck": true, // Skip .d.ts checking
    "forceConsistentCasingInFileNames": true
  }
}
```

### Code Quality Rules

#### ESLint (.eslintrc.json)

- React hooks rules
- TypeScript recommended rules
- Best practices enforcement
- Import order validation

#### Prettier (.prettierrc)

- 2-space indentation
- Single quotes for strings
- Semicolons enforced
- Auto-formatting on save

#### Editor Config (.editorconfig)

- Cross-editor consistency
- Character encoding: UTF-8
- Insert final newline

---

## 📦 Dependency Management

### Installation

```bash
# ⚠️ IMPORTANT: Always use --legacy-peer-deps
npm install --legacy-peer-deps
npm install --save package-name --legacy-peer-deps
npm install --save-dev package-name --legacy-peer-deps
```

**Why?** React 19 and other newer packages have peer dependency conflicts with react-scripts 5.0.1.

### Current Dependencies (1,398 total)

#### Core Dependencies

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "typescript": "4.9.5",
  "@mui/material": "^7.3.7",
  "react-hook-form": "^7.71.1",
  "@tanstack/react-query": "^5.90.20",
  "axios": "^latest"
}
```

#### Development Dependencies

```json
{
  "react-scripts": "5.0.1",
  "@types/react": "^19.x.x",
  "@types/react-dom": "^19.x.x",
  "@types/jest": "^29.x.x",
  "eslint": "^8.x.x",
  "prettier": "^3.x.x"
}
```

### Known Issues

- ⚠️ **9 vulnerabilities** (non-blocking, reviewed)
- ⚠️ `@types/node` removed (browser-only environment)
- ⚠️ All installations require `--legacy-peer-deps`

---

## 🧪 Testing Strategy (Future Implementation)

### Framework

- **Jest**: Testing framework (included with react-scripts)
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation

### Test Structure

```
src/
├── components/
│   └── common/
│       ├── Button.tsx
│       └── Button.test.tsx          # Unit tests
├── hooks/
│   └── useLocalStorage.test.ts      # Hook tests
└── services/
    └── api.service.test.ts          # Service tests
```

### Test Commands

```bash
npm test              # Run tests in watch mode
npm test -- --coverage    # Coverage report
make test             # Via Makefile
```

---

## 🚀 Deployment Strategy

### Deployment Targets

1. **Vercel** (Recommended for Next.js, but works with CRA)
   - Zero-config deployment
   - Built-in CI/CD
   - Auto preview URLs

2. **Netlify**
   - Easy static deployment
   - Built-in redirects for SPA

3. **GitHub Pages**
   - Free hosting
   - CI/CD via GitHub Actions

4. **Custom Server**
   - Use `build/` folder
   - Serve with nginx/Apache
   - Configure server rewrites for SPA

### Pre-Deployment Checklist

- ✅ Remove console.logs
- ✅ Set environment variables
- ✅ Run full test suite
- ✅ Build locally and test
- ✅ Check bundle size
- ✅ Verify all routes work
- ✅ Test responsive design

---

## 🔑 Environment Variables

### Configuration

Located in `src/config/index.ts`:

```typescript
// ✅ Use this helper to avoid process.env issues
const getEnv = (key: string, defaultValue?: string): string => {
  return (window as any).__ENV__?.[key] || defaultValue || ''
}

// Usage
const API_BASE_URL = getEnv('REACT_APP_API_URL', 'http://localhost:3000/api')
```

### Required Variables

```env
# .env file
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_APP_NAME=MIA Logistics Manager
REACT_APP_VERSION=2.1.0
```

---

## 🎯 Development Workflow

### 1. Setup Development Environment

```bash
# Clone and install
git clone <repository>
cd mia-logistics-manager
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env
```

### 2. Start Development Server

```bash
npm start
# App opens at http://localhost:3000
```

### 3. Create Feature

```bash
# Use the generate script
./scripts/generate-feature.sh myfeature

# Creates:
# src/features/myfeature/
# ├── components/
# ├── hooks/
# ├── services/
# ├── types/
# ├── utils/
# └── index.ts
```

### 4. Development Cycle

```
Code → Save → Hot Reload → Test → Commit
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: description of changes"
git push
```

---

## 📋 Code Style Guidelines

### Naming Conventions

| Type           | Style                        | Example                  |
| -------------- | ---------------------------- | ------------------------ |
| **Components** | PascalCase                   | `UserProfile.tsx`        |
| **Hooks**      | camelCase with `use` prefix  | `useLocalStorage.ts`     |
| **Services**   | camelCase with `.service.ts` | `api.service.ts`         |
| **Types**      | PascalCase with `.types.ts`  | `user.types.ts`          |
| **Utils**      | camelCase with `.utils.ts`   | `formatters.utils.ts`    |
| **Constants**  | UPPER_SNAKE_CASE             | `API_BASE_URL`           |
| **Folders**    | kebab-case                   | `src/components/common/` |

### File Organization

```typescript
// ✅ Good
import React from 'react'
import { useMemo } from 'react'
import { Button } from '@components/common/Button'
import { useLocalStorage } from '@hooks'
import { formatDate } from '@utils'
import type { User } from '@types'

export const MyComponent: React.FC<Props> = (props) => {
  // implementation
}

// ❌ Avoid
import React, { useMemo } from 'react' // mixed imports
import Button from '@components/common/Button' // wrong path
```

### Component Structure

```typescript
interface MyComponentProps {
  title: string;
  count?: number;
  onSubmit?: (data: unknown) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  count = 0,
  onSubmit,
}) => {
  // State
  const [isLoading, setIsLoading] = React.useState(false);

  // Effects
  React.useEffect(() => {
    // side effects
  }, []);

  // Handlers
  const handleClick = () => {
    setIsLoading(true);
  };

  // Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
```

---

## 🔗 Related Documentation

- **[README.md](README.md)** - Main setup guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[MASTER_INDEX.md](MASTER_INDEX.md)** - Documentation index
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributing guidelines
- **[tsconfig.json](tsconfig.json)** - TypeScript configuration

---

## 📞 Support & Questions

- **Documentation**: See [README.md](README.md)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: kho.1@mia.vn

---

**Last Updated**: February 8, 2026
**Version**: 2.1.0
**Status**: Production Ready ✅

Made with ❤️ for Vietnamese logistics industry
