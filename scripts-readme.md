<div align="center">

# 📜 Scripts Documentation

**Utility scripts để setup và phát triển MIA Logistics Manager dễ dàng hơn**

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/caovinhphuc/mia-logistics-manager)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/caovinhphuc/mia-logistics-manager)

**[Quick Start](#-quick-start-workflow) • [Scripts](#-available-scripts) • [Troubleshooting](#-troubleshooting) • [Best Practices](#-best-practices)**

---

</div>

## 📋 Available Scripts

### 1. **setup.sh** - Initial Project Setup

Tự động setup project lần đầu với tất cả dependencies và verification.

```bash
# Make executable (chỉ cần 1 lần)
chmod +x scripts/setup.sh

# Run setup
./scripts/setup.sh
```

#### ✅ Chức năng

<div align="center">

| Bước | Mô tả | Thời gian |
|------|-------|-----------|
| **1** | Check prerequisites (Node.js, npm, Git) | ~5s |
| **2** | Create `.env` from template | ~3s |
| **3** | Install dependencies | 2-5 min |
| **4** | Setup Git hooks (Husky) | ~10s |
| **5** | Run type check | ~30s |
| **6** | Run linter | ~20s |
| **7** | Test build | ~1 min |

</div>

**⏱️ Tổng thời gian:** **~5-10 phút**

---

### 2. **generate-structure.sh** - Generate Full Project Structure

Tạo toàn bộ cấu trúc thư mục và template files cho project.

```bash
# Make executable
chmod +x scripts/generate-structure.sh

# Run generator
./scripts/generate-structure.sh
```

#### 📦 Tạo được gì

<div align="center">

| Component | Mô tả | Quantity |
|-----------|-------|----------|
| **📁 Directories** | Features, shared, services, etc. | 80+ |
| **📄 Template Files** | Component, hook, service templates | 100+ |
| **⚙️ Config Files** | tsconfig, eslint, prettier | Complete |
| **🧪 Test Setup** | Test utilities and structure | Full coverage |
| **🎨 Theme Config** | Material-UI theme | Complete |
| **🔌 API Client** | API service setup | Ready-to-use |

</div>

**Output:**

```text
✓ Directories created: 80+
✓ Files created: 100+
✓ Structure ready for development
```

**⏱️ Thời gian:** **~30 giây**

---

### 3. **generate-feature.sh** - Generate Feature Module

Tạo một feature module hoàn chỉnh với tất cả boilerplate code.

```bash
# Make executable
chmod +x scripts/generate-feature.sh

# Generate feature
./scripts/generate-feature.sh <feature-name>

# Examples:
./scripts/generate-feature.sh customers
./scripts/generate-feature.sh invoices
./scripts/generate-feature.sh reports
```

#### 📁 Structure Được Tạo

```text
src/features/<feature-name>/
├── 📄 components/
│   ├── FeatureList.tsx         # List component
│   ├── FeatureCard.tsx         # Card component
│   ├── FeatureForm.tsx         # Form component
│   └── index.ts
├── 🪝 hooks/
│   ├── useFeature.ts          # CRUD hooks
│   └── index.ts
├── 🌐 services/
│   ├── featureService.ts      # API service
│   └── index.ts
├── 📝 types/
│   ├── feature.types.ts       # TypeScript types
│   └── index.ts
├── 🔧 utils/
│   ├── featureHelpers.ts      # Helper functions
│   └── index.ts
├── 📋 constants/
│   ├── featureConstants.ts    # Constants
│   └── index.ts
└── index.ts                   # Main export
```

#### ✨ Plus Features

- ✅ Complete CRUD hooks
- ✅ React Query integration
- ✅ TypeScript types
- ✅ Test files
- ✅ Ready-to-use components

**⏱️ Thời gian:** **~5 giây**

---

## 🚀 Quick Start Workflow

### 🌱 Starting a New Project

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/mia-logistics-manager.git
cd mia-logistics-manager

# 2. Setup project
chmod +x scripts/*.sh
./scripts/setup.sh

# 3. Generate full structure (if needed)
./scripts/generate-structure.sh

# 4. Start development
npm run dev
```

### ➕ Adding a New Feature

```bash
# 1. Generate feature
./scripts/generate-feature.sh my-new-feature

# 2. Customize the generated files
# Edit: src/features/my-new-feature/

# 3. Add route (if needed)
# Edit: src/config/router.tsx

# 4. Test
npm run test

# 5. Commit
git add .
git commit -m "feat: add my-new-feature module"
```

---

## 📝 Script Templates

### 📋 Feature Names Convention

#### ✅ Good Examples

```bash
./scripts/generate-feature.sh customers
./scripts/generate-feature.sh order-items
./scripts/generate-feature.sh delivery-notes
```

#### ❌ Bad Examples

```bash
./scripts/generate-feature.sh Customer      # Should be lowercase
./scripts/generate-feature.sh order_items   # Use hyphens, not underscores
```

### 🎨 What Gets Generated

#### Component Example

```typescript
// CustomerList.tsx
import React from 'react';
import { useCustomerList } from '../hooks';

export const CustomerList: React.FC = () => {
  const { data, isLoading } = useCustomerList();
  // ... complete implementation
};
```

#### Hook Example

```typescript
// useCustomer.ts
export const useCustomerList = (params?) => {
  return useQuery({
    queryKey: ['customer', params],
    queryFn: () => CustomerService.getAll(params),
  });
};
```

#### Service Example

```typescript
// customerService.ts
export class CustomerService {
  static async getAll(): Promise<Customer[]> {
    return apiClient.get('/customers');
  }
  // ... complete CRUD methods
}
```

---

## 🔧 Customization

### ✏️ Modifying Templates

Để customize templates được generate, edit scripts:

```bash
# Edit feature generator
code scripts/generate-feature.sh

# Find section "Create Components"
# Modify template code
```

### ➕ Adding New Scripts

```bash
# Create new script
touch scripts/my-custom-script.sh

# Make executable
chmod +x scripts/my-custom-script.sh

# Add shebang and error handling
#!/bin/bash
set -e

# Your script content...
```

---

## 🐛 Troubleshooting

### ❌ Issue 1: Script Not Executable

**Error:**

```bash
./scripts/setup.sh: Permission denied
```

**Solution:**

```bash
chmod +x scripts/*.sh
```

### ❌ Issue 2: Script Fails Mid-way

**Error:**

```bash
Command failed: npm install
```

**Solution:**

```bash
# Check error message
# Usually missing dependencies or wrong directory

# Verify you're in project root
pwd  # Should end with /mia-logistics-manager

# Verify prerequisites
node -v  # Should be >= 18.x
npm -v   # Should be >= 9.x
```

### ❌ Issue 3: Generated Files Have Errors

**Error:**

```bash
TS2307: Cannot find module 'react'
```

**Solution:**

```bash
# Run type check
npm run type-check

# Run linter
npm run lint:fix

# Install missing dependencies
npm install
```

### ❌ Issue 4: Feature Already Exists

**Error:**

```bash
Feature 'customers' already exists!
```

**Solution:**

```bash
# Script will ask for confirmation
# Choose 'y' to overwrite
# Or 'n' to cancel

# Or manually remove first
rm -rf src/features/customers
./scripts/generate-feature.sh customers
```

---

## 📊 Performance

<div align="center">

| Script | Time | Output |
|--------|------|--------|
| **setup.sh** | 5-10 min | Full setup + verification |
| **generate-structure.sh** | ~30 sec | 80+ dirs, 100+ files |
| **generate-feature.sh** | ~5 sec | Complete feature module |

</div>

---

## 🎯 Best Practices

### 1. ✅ Always Review Generated Code

```bash
# After generating feature
code src/features/my-feature/

# Customize:
# - Types to match your data model
# - Service methods for your API
# - Components for your UI needs
```

### 2. 🧪 Run Tests After Generation

```bash
npm run test
npm run type-check
npm run lint
```

### 3. 💾 Commit Often

```bash
git add .
git commit -m "chore: generate feature scaffold"

# Then customize and commit again
git commit -m "feat: implement feature logic"
```

### 4. 📝 Use Consistent Naming

<div align="center">

| Type | Convention | Example |
|------|------------|---------|
| **Features** | lowercase-with-hyphens | `order-items` |
| **Components** | PascalCase | `CustomerList` |
| **Functions** | camelCase | `getCustomerById` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

</div>

---

## 🔍 Advanced Usage

### 📦 Generate Multiple Features

```bash
# Create script for batch generation
for feature in customers invoices reports settings
do
  ./scripts/generate-feature.sh $feature
  echo "✓ Generated $feature"
done
```

### 🎨 Custom Feature Templates

```bash
# Copy and modify generator
cp scripts/generate-feature.sh scripts/generate-page.sh

# Edit for page-specific templates
code scripts/generate-page.sh
```

### 🔄 Integrate with CI/CD

```bash
# In .github/workflows/ci.yml
- name: Verify structure
  run: |
    npm run type-check
    npm run lint
```

### ⚡ Quick Alias Setup

Add to `.bashrc` or `.zshrc`:

```bash
# MIA Logistics Script Aliases
alias mia-setup='./scripts/setup.sh'
alias mia-struct='./scripts/generate-structure.sh'
alias mia-feature='./scripts/generate-feature.sh'
```

**Usage:**

```bash
mia-feature customers
mia-setup
```

---

## 📚 Additional Resources

<div align="center">

| Resource | Link |
|----------|------|
| **📖 Project Structure** | [ARCHITECTURE.md](../docs/ARCHITECTURE.md) |
| **🤝 Contributing** | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| **🧪 Testing Guide** | [TESTING.md](../docs/TESTING.md) |
| **📝 Quick Start** | [scripts-quickstart.md](./scripts-quickstart.md) |

</div>

---

## 🤝 Contributing to Scripts

Muốn improve scripts? Submit PR with:

1. ✅ Clear description của changes
2. ✅ Updated documentation
3. ✅ Test trên clean project
4. ✅ Follow shell scripting best practices

---

## 📞 Support

Có issues với scripts?

<div align="center">

| Channel | Link |
|---------|------|
| **📧 Email** | <tech@mia.vn> |
| **💬 Telegram** | @mia_logistics_dev |
| **🐛 GitHub Issues** | [Create Issue](https://github.com/YOUR_USERNAME/mia-logistics-manager/issues) |

</div>

**Troubleshooting:** Check [Troubleshooting](#-troubleshooting) section above

---

<div align="center">

### ⭐ **Happy Scripting!** 🚀

**Made with ❤️ by MIA Logistics Team**

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/mia-logistics-manager?style=social)](https://github.com/YOUR_USERNAME/mia-logistics-manager)

---

**Version 2.1.0** • Last Updated: 2025-01-30

</div>
