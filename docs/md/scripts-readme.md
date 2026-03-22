# 📜 Scripts Documentation

Thư mục này chứa các utility scripts để setup và phát triển project dễ dàng hơn.

---

## 📋 Available Scripts

### 1. **setup.sh** - Initial Project Setup

Tự động setup project lần đầu với tất cả dependencies và verification.

```bash
# Make executable (chỉ cần 1 lần)
chmod +x scripts/setup.sh

# Run setup
./scripts/setup.sh
```

**Chức năng:**

- ✅ Check prerequisites (Node.js, npm, Git)
- ✅ Create `.env` from template
- ✅ Install dependencies
- ✅ Setup Git hooks (Husky)
- ✅ Run type check
- ✅ Run linter
- ✅ Test build

**Thời gian:** ~5-10 phút

---

### 2. **generate-structure.sh** - Generate Full Project Structure

Tạo toàn bộ cấu trúc thư mục và template files cho project.

```bash
# Make executable
chmod +x scripts/generate-structure.sh

# Run generator
./scripts/generate-structure.sh
```

**Tạo được gì:**

- 📁 Complete directory structure (features, shared, services, etc.)
- 📄 ~100+ template files
- ⚙️ Configuration files (tsconfig, eslint, prettier)
- 🧪 Test setup
- 🎨 Theme configuration
- 🔌 API client setup

**Output:**

```
✓ Directories created: 80+
✓ Files created: 100+
```

**Thời gian:** ~30 giây

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

**Tạo được gì:**

```
src/features/<feature-name>/
├── components/
│   ├── FeatureList.tsx
│   ├── FeatureCard.tsx
│   ├── FeatureForm.tsx
│   └── index.ts
├── hooks/
│   ├── useFeature.ts
│   └── index.ts
├── services/
│   ├── featureService.ts
│   └── index.ts
├── types/
│   ├── feature.types.ts
│   └── index.ts
├── utils/
│   ├── featureHelpers.ts
│   └── index.ts
├── constants/
│   ├── featureConstants.ts
│   └── index.ts
└── index.ts
```

**Plus:**

- ✅ Complete CRUD hooks
- ✅ React Query integration
- ✅ TypeScript types
- ✅ Test files
- ✅ Ready-to-use components

**Thời gian:** ~5 giây

---

## 🚀 Quick Start Workflow

### Starting a New Project

```bash
# 1. Clone repository
git clone <repo-url>
cd mia-logistics

# 2. Setup project
chmod +x scripts/*.sh
./scripts/setup.sh

# 3. Generate full structure (if needed)
./scripts/generate-structure.sh

# 4. Start development
npm run dev
```

### Adding a New Feature

```bash
# 1. Generate feature
./scripts/generate-feature.sh my-new-feature

# 2. Customize the generated files
# Edit: src/features/my-new-feature/

# 3. Add route (if needed)
# Edit: src/App.tsx

# 4. Test
npm run test

# 5. Commit
git add .
git commit -m "feat: add my-new-feature module"
```

---

## 📝 Script Templates

### Feature Names Convention

**Good:**

```bash
./scripts/generate-feature.sh customers
./scripts/generate-feature.sh order-items
./scripts/generate-feature.sh delivery-notes
```

**Bad:**

```bash
./scripts/generate-feature.sh Customer  # Should be lowercase
./scripts/generate-feature.sh order_items  # Use hyphens, not underscores
```

### What Gets Generated

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

### Modifying Templates

Để customize templates được generate, edit scripts:

```bash
# Edit feature generator
code scripts/generate-feature.sh

# Find section "Create Components"
# Modify template code
```

### Adding New Scripts

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

### Script Not Executable

```bash
# Error: Permission denied
chmod +x scripts/*.sh
```

### Script Fails Mid-way

```bash
# Check error message
# Usually missing dependencies or wrong directory

# Verify you're in project root
pwd  # Should end with /mia-logistics

# Verify prerequisites
node -v  # Should be >= 18.x
npm -v   # Should be >= 9.x
```

### Generated Files Have Errors

```bash
# Run type check
npm run type-check

# Run linter
npm run lint:fix

# Install missing dependencies
npm install
```

### Feature Already Exists

```bash
# Script will ask for confirmation
# Choose 'y' to overwrite
# Or 'n' to cancel
```

---

## 📊 Performance

| Script | Time | Output |
|--------|------|--------|
| setup.sh | 5-10 min | Full setup + verification |
| generate-structure.sh | ~30 sec | 80+ dirs, 100+ files |
| generate-feature.sh | ~5 sec | Complete feature module |

---

## 🎯 Best Practices

### 1. Always Review Generated Code

```bash
# After generating feature
code src/features/my-feature/

# Customize:
# - Types to match your data model
# - Service methods for your API
# - Components for your UI needs
```

### 2. Run Tests After Generation

```bash
npm run test
npm run type-check
npm run lint
```

### 3. Commit Often

```bash
git add .
git commit -m "chore: generate feature scaffold"

# Then customize and commit again
git commit -m "feat: implement feature logic"
```

### 4. Use Consistent Naming

- **Features**: lowercase-with-hyphens
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE

---

## 🔍 Advanced Usage

### Generate Multiple Features

```bash
# Create script for batch generation
for feature in customers invoices reports settings
do
  ./scripts/generate-feature.sh $feature
done
```

### Custom Feature Templates

```bash
# Copy and modify generator
cp scripts/generate-feature.sh scripts/generate-page.sh

# Edit for page-specific templates
code scripts/generate-page.sh
```

### Integrate with CI/CD

```bash
# In .github/workflows/ci.yml
- name: Verify structure
  run: |
    npm run type-check
    npm run lint
```

---

## 📚 Additional Resources

- [Project Structure](../docs/ARCHITECTURE.md#project-structure)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Testing Guide](../docs/TESTING.md)

---

## 🤝 Contributing to Scripts

Muốn improve scripts? Submit PR with:

1. Clear description của changes
2. Updated documentation
3. Test trên clean project
4. Follow shell scripting best practices

---

## 📞 Support

Có issues với scripts?

- Check [Troubleshooting](#-troubleshooting) section
- Open GitHub issue
- Ask trong Telegram group: @mia_logistics_dev

---

**Happy Scripting! 🚀**
