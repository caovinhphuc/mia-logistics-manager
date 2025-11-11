# Schema Documentation

Documentation chi tiết cho các database schemas trong MIA Logistics Manager.

---

## 📋 Available Schemas

### 1. InboundSchedule (54 columns) ✅

**File**: [INBOUND_SCHEDULE.md](INBOUND_SCHEDULE.md)

Complete schema cho quản lý lịch nhập hàng quốc tế.

**Highlights:**

- 54 columns organized into 6 logical groups
- Timeline tracking (6 milestones)
- Document status tracking (5 milestones)
- Full TypeScript support
- Helper functions for parsing/validation

**Implementation Files:**

- Types: `src/types/inboundSchedule.ts` (362 lines)
- Helpers: `src/utils/inboundScheduleHelpers.ts` (415 lines)
- Docs: `docs/schemas/INBOUND_SCHEDULE.md` (390 lines)

---

### 2. Carriers (Coming Soon)

Schema cho nhà vận chuyển.

**Planned Fields:**

- Basic info (id, name, contact)
- Service areas
- Pricing rules
- Performance metrics

---

### 3. Transfers (Coming Soon)

Schema cho phiếu chuyển kho.

**Planned Fields:**

- Transfer details
- Volume calculations
- Status tracking
- Cost calculations

---

### 4. Employees (Coming Soon)

Schema cho nhân viên.

**Planned Fields:**

- Personal information
- Employment details
- Account & permissions
- Activity logs

---

### 5. Users (Coming Soon)

Schema cho users hệ thống.

**Planned Fields:**

- Authentication data
- Profile information
- Role assignments
- Session management

---

## 🎯 Schema Design Principles

### 1. Type Safety First

```typescript
// ✅ Good: Full type definitions
interface MySchema {
  id: string;
  name: string;
  status: MyStatus;
}

// ❌ Bad: Any types
interface MySchema {
  data: any;
}
```

### 2. Validation Built-in

```typescript
// Include validation functions
export function validateMySchema(data: MySchema): ValidationResult {
  // Validation logic
}
```

### 3. Helper Functions

```typescript
// Include parsing/formatting helpers
export function parseMySchema(raw: any): MySchema {
  // Parse logic
}

export function formatMySchema(data: MySchema): DisplayFormat {
  // Format logic
}
```

### 4. Documentation

Each schema must have:

- ✅ Complete column list with descriptions
- ✅ Validation rules
- ✅ Business logic explanation
- ✅ Usage examples
- ✅ Integration guide

---

## 📊 Schema Statistics

| Schema              | Status      | Columns | Code Lines | Doc Lines |
| ------------------- | ----------- | ------- | ---------- | --------- |
| **InboundSchedule** | ✅ Complete | 54      | 777        | 390       |
| Carriers            | 🔄 Planned  | ~15     | -          | -         |
| Transfers           | 🔄 Planned  | ~20     | -          | -         |
| Employees           | 🔄 Planned  | ~18     | -          | -         |
| Users               | 🔄 Planned  | ~12     | -          | -         |

---

## 🚀 Usage

### Import Types

```typescript
import { InboundSchedule, InboundStatus } from '@/types/inboundSchedule';
```

### Use Helpers

```typescript
import {
  validateInboundSchedule,
  toStructuredFormat,
  calculateTimelineCompletion,
} from '@/utils/inboundScheduleHelpers';
```

### Read Documentation

```bash
# View schema docs
cat docs/schemas/INBOUND_SCHEDULE.md

# Or in browser
open docs/schemas/INBOUND_SCHEDULE.md
```

---

## 📝 Contributing

Khi thêm schema mới:

1. **Create Types** (`src/types/{schemaName}.ts`)
   - Define all interfaces
   - Add enums for status/categories
   - Include type guards
   - Add constants

2. **Create Helpers** (`src/utils/{schemaName}Helpers.ts`)
   - Validation functions
   - Parsing/formatting functions
   - Business logic helpers
   - Utility functions

3. **Write Documentation** (`docs/schemas/{SCHEMA_NAME}.md`)
   - Column details table
   - Validation rules
   - Business logic explanation
   - Usage examples
   - Integration guide

4. **Add Tests**
   - Unit tests for helpers
   - Integration tests for API
   - E2E tests for UI

5. **Update This Index**
   - Add to available schemas list
   - Update statistics table

---

## 🔗 Related Documentation

- [API Documentation](../API.md) - REST API reference
- [Features Detail](../FEATURES_DETAIL.md) - Feature descriptions
- [Main README](../../README.md) - Project overview

---

**Last Updated**: November 12, 2025  
**Total Schemas**: 1 complete, 4 planned  
**Documentation Coverage**: 100% for implemented schemas
