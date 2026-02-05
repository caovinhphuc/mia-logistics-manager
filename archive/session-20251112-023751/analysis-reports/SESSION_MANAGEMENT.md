<div align="center">

# 🔐 Session Management Documentation

**Hệ thống quản lý phiên đăng nhập thông minh với timeout warning, smart extension, và activity monitoring**

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/caovinhphuc/mia-logistics-manager)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/caovinhphuc/mia-logistics-manager)

**[Features](#-features) • [Configuration](#-cấu-hình) • [Usage](#-cách-sử-dụng) • [Best Practices](#-best-practices)**

---

</div>

## 📋 Tổng quan

Hệ thống quản lý phiên đăng nhập thông minh với các tính năng bảo mật và UX được tối ưu.

### 🎯 Mục tiêu

- ✅ Bảo mật phiên đăng nhập
- ✅ Cảnh báo trước khi hết hạn
- ✅ Tự động gia hạn có điều kiện
- ✅ Theo dõi hoạt động người dùng
- ✅ Trải nghiệm người dùng mượt mà

---

## ✨ Features

<div align="center">

| Feature | Mô tả | Status |
|---------|-------|--------|
| **📱 Session Management** | Quản lý phiên đăng nhập qua localStorage | ✅ Active |
| **⚠️ Timeout Warning** | Cảnh báo trước 5 phút khi session hết hạn | ✅ Active |
| **🔄 Smart Extension** | Gia hạn session có điều kiện (10 phút cuối) | ✅ Active |
| **🔄 Auto Redirect** | Tự động quay về vị trí cũ sau khi login | ✅ Active |
| **👁️ Activity Monitoring** | Theo dõi hoạt động để reset session timer | ✅ Active |
| **🛡️ Security Guards** | Component bảo vệ route với authentication | ✅ Active |

</div>

---

## ⚙️ Cấu hình

### 📊 Default Configuration

<div align="center">

| Setting | Value | Mô tả |
|---------|-------|-------|
| **Session Timeout** | 30 phút | Thời gian phiên đăng nhập |
| **Warning Timeout** | 5 phút | Cảnh báo trước khi hết hạn |
| **Extension Threshold** | 10 phút | Thời gian cuối có thể gia hạn |
| **Check Interval** | 1 phút | Tần suất kiểm tra session |

</div>

### 🔧 Configuration Code

```javascript
// Default configuration
const defaultConfig = {
  sessionTimeout: 30 * 60 * 1000,      // 30 phút
  warningTimeout: 5 * 60 * 1000,      // 5 phút trước khi hết hạn
  extensionThreshold: 10 * 60 * 1000,  // 10 phút cuối có thể gia hạn
  checkInterval: 60 * 1000,           // Kiểm tra mỗi 1 phút
};
```

### ✏️ Customize Configuration

```javascript
import sessionManager from './services/sessionManager';

// Customize configuration
sessionManager.configure({
  sessionTimeout: 45 * 60 * 1000,      // 45 minutes
  warningTimeout: 10 * 60 * 1000,      // 10 minutes warning
  extensionThreshold: 15 * 60 * 1000,   // 15 minutes
  checkInterval: 30 * 1000,            // 30 seconds
});
```

---

## 📝 Cách sử dụng

### 1. 📍 Initialize Session

```javascript
import sessionManager from './services/sessionManager';

// Khi user login thành công
sessionManager.initializeSession(userData, authToken);
```

**Khi nào sử dụng:**

- ✅ Sau khi user đăng nhập thành công
- ✅ Sau khi refresh token
- ✅ Khi restore session từ localStorage

---

### 2. 🔍 Check Session

```javascript
// Check if session is valid
const isValid = sessionManager.isSessionValid();

// Get current session
const session = sessionManager.getCurrentSession();

// Get remaining time
const remaining = sessionManager.getRemainingTime();
```

**Return Values:**

<div align="center">

| Method | Return Type | Description |
|--------|-------------|-------------|
| `isSessionValid()` | `boolean` | Session có còn hợp lệ không |
| `getCurrentSession()` | `object` | Thông tin session hiện tại |
| `getRemainingTime()` | `number` | Thời gian còn lại (ms) |

</div>

---

### 3. 👁️ Activity Monitoring

```javascript
import useActivityMonitor from './hooks/useActivityMonitor';

// In your component
const MyComponent = () => {
  useActivityMonitor(true); // Enable monitoring

  return <div>Your content</div>;
};
```

**Events được theo dõi:**

- ✅ Mouse movement
- ✅ Keyboard input
- ✅ Click events
- ✅ Scroll events
- ✅ Touch events (mobile)

**Recommended:** Enable trong main layout component (`App.js` hoặc `MainLayout`)

---

### 4. ⚠️ Session Timeout Warning

```javascript
import SessionTimeoutWarning from './components/auth/SessionTimeoutWarning';

// In your App.js
function App() {
  return (
    <>
      <SessionTimeoutWarning />
      {/* Your app content */}
    </>
  );
}
```

**Warning Behavior:**

- ⏰ Hiển thị **5 phút** trước khi session hết hạn
- 🔄 Cho phép gia hạn nếu còn **> 10 phút**
- 🚪 Tự động đăng xuất nếu không gia hạn
- 🔄 Tự động quay về trang trước khi đăng nhập lại

---

### 5. 🔄 Auto Redirect

```javascript
import sessionManager from './services/sessionManager';

// Store redirect path before login
sessionManager.storeRedirectPath(window.location.pathname);

// After successful login
const redirectPath = sessionManager.getRedirectPath();
// Navigate to redirectPath or default to '/dashboard'
```

**Flow:**

```text
User trên /protected/page
    ↓
Session hết hạn
    ↓
Store path: /protected/page
    ↓
Redirect to /login
    ↓
User login thành công
    ↓
Redirect back to /protected/page ✅
```

---

### 6. 🔄 Extend Session

```javascript
// Smart extension (only in last 10 minutes)
const extended = sessionManager.extendSession();

if (extended) {
  console.log("Session extended successfully");
} else {
  console.log("Cannot extend: session too old or expired");
}
```

**Extension Rules:**

<div align="center">

| Condition | Can Extend? | Reason |
|-----------|-------------|--------|
| Session < 10 phút | ✅ Yes | Smart extension enabled |
| Session > 10 phút | ❌ No | Too early, no need |
| Session expired | ❌ No | Already expired |

</div>

---

### 7. 🧹 Clear Session

```javascript
// Logout
sessionManager.clearSession();
```

**Khi nào sử dụng:**

- ✅ User đăng xuất manually
- ✅ Session expired
- ✅ Security breach detected
- ✅ Account locked

---

## 📊 Session Events

Lắng nghe session events để handle các trường hợp khác nhau:

```javascript
const unsubscribe = sessionManager.subscribe((event, data) => {
  switch (event) {
    case 'session_initialized':
      console.log('Session initialized', data);
      // Handle: Session đã được khởi tạo
      break;

    case 'show_warning':
      console.log('Show warning', data);
      // Handle: Hiển thị warning dialog
      break;

    case 'session_extended':
      console.log('Session extended', data);
      // Handle: Session đã được gia hạn
      break;

    case 'session_expired':
      console.log('Session expired');
      // Handle: Redirect to login
      break;

    case 'session_cleared':
      console.log('Session cleared');
      // Handle: Session đã bị xóa
      break;
  }
});

// Cleanup khi component unmount
unsubscribe();
```

### 📋 Available Events

<div align="center">

| Event | Trigger | Data |
|-------|---------|------|
| `session_initialized` | Khi session được khởi tạo | `{ user, token }` |
| `show_warning` | 5 phút trước khi hết hạn | `{ remainingTime }` |
| `session_extended` | Khi session được gia hạn | `{ newExpiry }` |
| `session_expired` | Khi session hết hạn | `null` |
| `session_cleared` | Khi session bị xóa | `null` |

</div>

---

## 📈 Session Statistics

Lấy thống kê về session hiện tại:

```javascript
const stats = sessionManager.getStats();

console.log({
  elapsed: stats.elapsed,           // Time since session started
  remaining: stats.remaining,        // Time remaining
  lastActivity: stats.lastActivity,  // Last activity timestamp
  inactiveTime: stats.inactiveTime,  // Time since last activity
  canExtend: stats.canExtend,       // Can extend session?
  shouldWarn: stats.shouldWarn,     // Should show warning?
});
```

### 📊 Stats Object Structure

```typescript
interface SessionStats {
  elapsed: number;        // Milliseconds since session started
  remaining: number;      // Milliseconds remaining
  lastActivity: number;   // Timestamp of last activity
  inactiveTime: number;   // Milliseconds since last activity
  canExtend: boolean;     // Whether session can be extended
  shouldWarn: boolean;    // Whether warning should be shown
}
```

---

## ✅ Best Practices

### 1. ✅ Always Initialize Session

```javascript
// ✅ GOOD: Initialize after login
const handleLogin = async (credentials) => {
  const response = await login(credentials);
  if (response.success) {
    sessionManager.initializeSession(response.user, response.token);
  }
};

// ❌ BAD: Don't forget to initialize
const handleLogin = async (credentials) => {
  const response = await login(credentials);
  // Missing: sessionManager.initializeSession()
};
```

### 2. ✅ Enable Activity Monitoring

```javascript
// ✅ GOOD: Enable in main layout
function App() {
  useActivityMonitor(true);
  return <YourApp />;
}

// ❌ BAD: Don't enable in every component
function EveryComponent() {
  useActivityMonitor(true); // Too many monitors!
  return <div />;
}
```

### 3. ✅ Show Warning Dialog

```javascript
// ✅ GOOD: Show warning in app root
function App() {
  return (
    <>
      <SessionTimeoutWarning />
      <YourApp />
    </>
  );
}
```

### 4. ✅ Store Redirect Path

```javascript
// ✅ GOOD: Store before requiring login
const ProtectedRoute = ({ children }) => {
  useEffect(() => {
    if (!sessionManager.isSessionValid()) {
      sessionManager.storeRedirectPath(window.location.pathname);
      navigate('/login');
    }
  }, []);
};
```

### 5. ✅ Clear Session on Logout

```javascript
// ✅ GOOD: Clear session on logout
const handleLogout = () => {
  sessionManager.clearSession();
  navigate('/login');
};
```

### 6. ✅ Handle Session Expiry Gracefully

```javascript
// ✅ GOOD: Handle expiry with user-friendly message
sessionManager.subscribe((event) => {
  if (event === 'session_expired') {
    toast.info('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    navigate('/login');
  }
});
```

---

## 🎯 Integration Example

### Complete App Integration

```javascript
// App.js
import { useEffect } from 'react';
import useActivityMonitor from './hooks/useActivityMonitor';
import SessionTimeoutWarning from './components/auth/SessionTimeoutWarning';
import sessionManager from './services/sessionManager';

function App() {
  // Enable activity monitoring
  useActivityMonitor(true);

  // Subscribe to session events
  useEffect(() => {
    const unsubscribe = sessionManager.subscribe((event, data) => {
      switch (event) {
        case 'session_expired':
          // Handle session expiry
          window.location.href = '/login';
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <SessionTimeoutWarning />
      {/* Your app */}
    </>
  );
}
```

### ProtectedRoute Component

```javascript
// ProtectedRoute.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sessionManager from './services/sessionManager';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Store current path for redirect
    sessionManager.storeRedirectPath(window.location.pathname);

    // Check session on mount
    if (!sessionManager.isSessionValid()) {
      navigate('/login');
    }
  }, [navigate]);

  if (!sessionManager.isSessionValid()) {
    return null; // or <Loading />
  }

  return children;
};
```

### Login Component Integration

```javascript
// Login.js
import sessionManager from './services/sessionManager';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const response = await login(credentials);

    if (response.success) {
      // Initialize session
      sessionManager.initializeSession(response.user, response.token);

      // Get redirect path or default to dashboard
      const redirectPath = sessionManager.getRedirectPath() || '/dashboard';
      navigate(redirectPath);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};
```

---

## 🚨 Troubleshooting

### ❌ Issue 1: Session Not Persisting

**Problem:** Session bị mất sau khi refresh page

**Solution:**

```javascript
// Check localStorage
console.log(localStorage.getItem('session'));

// Verify session initialization
if (!sessionManager.getCurrentSession()) {
  sessionManager.initializeSession(userData, token);
}
```

### ❌ Issue 2: Warning Not Showing

**Problem:** Warning dialog không hiển thị

**Solution:**

```javascript
// Check if component is mounted
<SessionTimeoutWarning />

// Verify configuration
sessionManager.configure({
  warningTimeout: 5 * 60 * 1000, // 5 minutes
});
```

### ❌ Issue 3: Cannot Extend Session

**Problem:** Không thể gia hạn session

**Solution:**

```javascript
// Check if session is within extension threshold
const stats = sessionManager.getStats();
console.log('Can extend:', stats.canExtend);

// Session must be < 10 minutes to extend
if (stats.remaining < 10 * 60 * 1000) {
  sessionManager.extendSession();
}
```

### ❌ Issue 4: Activity Not Detected

**Problem:** Activity monitor không phát hiện hoạt động

**Solution:**

```javascript
// Verify hook is enabled
useActivityMonitor(true); // Must be true

// Check in main layout
// Not in nested components
```

---

## 📚 Additional Resources

<div align="center">

| Resource | Link |
|----------|------|
| **📖 Authentication Guide** | [AUTHENTICATION_STATUS.md](./AUTHENTICATION_STATUS.md) |
| **🔐 RBAC Documentation** | [RBAC_USAGE.md](./RBAC_USAGE.md) |
| **📝 API Documentation** | [docs/md/README.md](./docs/md/README.md) |

</div>

---

<div align="center">

### ⭐ **Happy Coding!** 🚀

**Made with ❤️ by MIA Logistics Team**

---

**Version 2.1.0** • Last Updated: 2025-01-30

</div>
