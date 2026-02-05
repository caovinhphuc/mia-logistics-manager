#!/bin/bash
# Fix unused variables by commenting them out

# Fix unused imports - comment out
sed -i '' 's/^import.*BRAND_CONFIG.*$/\/\/ &/' src/App.tsx
sed -i '' 's/^import.*Line.*recharts.*$/\/\/ &/' src/components/custom/YourMetricsWidget.jsx  
sed -i '' "s/import.*CalendarIcon.*/\/\/ &/" src/components/inbound/components/calendar/CalendarView.tsx
sed -i '' "s/import.*CalendarIcon.*/\/\/ &/" src/features/inbound/components/calendar/CalendarView.tsx

# Fix unused declarations - prefix with underscore
sed -i '' 's/const getStatusLabel =/const _getStatusLabel =/' src/components/inbound/components/calendar/CalendarView.tsx
sed -i '' 's/const statusPillSx =/const _statusPillSx =/' src/components/inbound/components/calendar/CalendarView.tsx
sed -i '' 's/const formatVN =/const _formatVN =/' src/components/inbound/components/calendar/CalendarView.tsx
sed -i '' 's/const parseVietnamDate =/const _parseVietnamDate =/' src/components/inbound/components/dialogs/AddEditDialog.tsx

sed -i '' 's/const getStatusLabel =/const _getStatusLabel =/' src/features/inbound/components/calendar/CalendarView.tsx
sed -i '' 's/const statusPillSx =/const _statusPillSx =/' src/features/inbound/components/calendar/CalendarView.tsx
sed -i '' 's/const formatVN =/const _formatVN =/' src/features/inbound/components/calendar/CalendarView.tsx
sed -i '' 's/const parseVietnamDate =/const _parseVietnamDate =/' src/features/inbound/components/dialogs/AddEditDialog.tsx

sed -i '' 's/import { Customers/\/\/ import { Customers/' src/features/customers/hooks/useCustomers.ts
sed -i '' 's/import { Invoices/\/\/ import { Invoices/' src/features/invoices/hooks/useInvoices.ts
sed -i '' 's/import { Reports/\/\/ import { Reports/' src/features/reports/hooks/useReports.ts

sed -i '' 's/const handleGridStatusToggle =/const _handleGridStatusToggle =/' src/pages/Transport/Carriers/Carriers.js
sed -i '' 's/season: season,/\/\/ season: season,/' src/routes/custom-metrics.js
sed -i '' 's/const hashedPassword =/const _hashedPassword =/' src/server.js
sed -i '' 's/(req, res, next)/(req, res, _next)/' src/server.js

# Fix imports
sed -i '' 's/import.*Divider.*@mui\/material.*$/\/\/ &/' src/ui/UIComponentsDemo.js
sed -i '' 's/import.*Visibility.*@mui\/icons-material.*$/\/\/ &/' src/ui/UIComponentsDemo.js

echo "✅ Fixed unused variables"
