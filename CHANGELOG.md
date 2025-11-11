# Changelog

All notable changes to MIA Logistics Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Mobile app (React Native)
- Advanced analytics dashboard
- AI-powered route optimization
- TypeScript migration
- GraphQL API

## [2.1.1] - 2025-11-12

### Fixed

- PostCSS/Tailwind CSS configuration conflict between v3 and v4
- Runtime error: "Cannot access before initialization" in TransferList component
- Function hoisting issues with useEffect and useCallback
- Duplicate useEffect calls

### Changed

- Explicitly set Tailwind CSS v3.4.18 in package.json
- Updated PostCSS to v8.5.6
- Updated Autoprefixer to v10.4.22

### Documentation

- Added troubleshooting section for common build errors
- Updated README with PostCSS/Tailwind configuration guide

## [2.1.0] - 2025-10-31

### Added

- **Backend API Routes** - 100% Complete
  - 16 route modules with 50+ endpoints
  - Authentication & User Management (9 endpoints)
  - Core Business: Carriers, Transfers, Locations, Transport Requests
  - Settings & Volume Rules management
  - Inbound: Domestic & International (54+ columns for International)
  - RBAC System: Roles, Employees, Role Permissions
  - Admin Operations: Stats, Sheets info
  - Utilities: Google Sheets, Telegram notifications

- **Frontend Features**
  - Employees Management page with Grid/Table view
  - Authorization System (Roles, Permissions, Users)
  - Locations (Saved Locations) page
  - All routes protected with RBAC

- **Session Management**
  - Timeout warning (5 minutes before expiration)
  - Smart session extension
  - Activity monitoring
  - Auto logout on timeout

- **Google Sheets Integration**
  - 25 tabs connected and working
  - Full CRUD operations
  - Batch operations support

- **Telegram Notifications**
  - Startup/shutdown notifications
  - Error alerts
  - Daily reports
  - Custom message support

- **Logging System**
  - Auto-logging to `logs/` directory
  - Multiple log levels (ERROR, WARN, INFO, DEBUG)
  - Log rotation support

- **Startup Scripts**
  - `start-project.sh` - Full startup with notifications
  - `start.sh` - Simple startup
  - `test-startup.sh` - Service testing

### Changed

- Backend server now runs on port 5050 (was 5000)
- Improved sidebar collapse/expand functionality
- Enhanced error handling across all components
- Optimized Google Sheets API calls

### Fixed

- Session timeout issues
- Sidebar menu item visibility
- Google Sheets connection stability
- Telegram notification delivery

### Deprecated

- Old authentication methods (replaced with new session management)

### Security

- Implemented SHA-256 password hashing
- Added session timeout warnings
- Enhanced RBAC enforcement
- Improved API endpoint protection

## [2.0.0] - 2024-06-15

### Added

- Complete RBAC system (Roles, Permissions, Users)
- Employee management module
- Inbound International with 70+ columns
- Calendar view for inbound operations
- Volume calculation engine
- Google Apps Script integration for distance calculation
- Telegram bot integration
- Email notifications (SendGrid)

### Changed

- Migrated to React 18
- Updated Material-UI to v5
- Redesigned dashboard
- Improved responsive layout

### Removed

- Legacy authentication system
- Old dashboard components

## [1.5.0] - 2024-03-10

### Added

- Carriers management
- Transfers module
- Volume rules configuration
- Transport requests tracking

### Changed

- Improved performance with lazy loading
- Better state management with Zustand

## [1.0.0] - 2024-01-15

### Added

- Initial release
- Core logistics management features
- Google Workspace integration
- Vietnamese localization
- Responsive design
- Basic authentication

### Core Modules

- Dashboard
- Orders management
- Locations management
- Warehouse management
- Basic reporting

---

## Version Naming Convention

### Major.Minor.Patch (X.Y.Z)

- **Major (X)**: Breaking changes, major features, architecture changes
- **Minor (Y)**: New features, non-breaking changes
- **Patch (Z)**: Bug fixes, minor improvements

### Examples

- `1.0.0` → `2.0.0`: Major release with breaking changes
- `2.0.0` → `2.1.0`: New features added, backward compatible
- `2.1.0` → `2.1.1`: Bug fixes, no new features

## Release Process

1. **Development** → `develop` branch
2. **Testing** → Create release candidate (e.g., `v2.2.0-rc.1`)
3. **Staging** → Deploy to staging environment
4. **Production** → Merge to `main` and tag release

## Links

- [GitHub Repository](https://github.com/your-username/mia-logistics-manager)
- [Documentation](https://docs.mialogistics.com)
- [Issue Tracker](https://github.com/your-username/mia-logistics-manager/issues)
- [Release Notes](https://github.com/your-username/mia-logistics-manager/releases)
