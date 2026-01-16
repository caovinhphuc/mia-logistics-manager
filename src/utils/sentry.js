// Sentry Configuration (Optional)
// This file provides a no-op Sentry object if @sentry/react is not installed
// To enable Sentry, install packages: npm install @sentry/react @sentry/tracing
// Then uncomment the import statements below

// Uncomment these lines if Sentry packages are installed:
// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';

// Create a no-op Sentry object as fallback
const Sentry = {
  captureException: () => {},
  captureMessage: () => {},
  setUser: () => {},
  setContext: () => {},
  init: () => {},
  ErrorBoundary: ({ children }) => children,
};

// Uncomment this block if Sentry packages are installed:
// if (process.env.REACT_APP_SENTRY_DSN && process.env.REACT_APP_SENTRY_DSN !== 'YOUR_SENTRY_DSN_HERE') {
//   try {
//     Sentry.init({
//       dsn: process.env.REACT_APP_SENTRY_DSN,
//       environment: process.env.NODE_ENV,
//       integrations: [new Integrations.BrowserTracing()],
//       tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
//       beforeSend(event) {
//         if (process.env.NODE_ENV === 'development') {
//           return null;
//         }
//         return event;
//       },
//       beforeBreadcrumb(breadcrumb) {
//         if (breadcrumb.category === 'console' && breadcrumb.level === 'error') {
//           return null;
//         }
//         return breadcrumb;
//       },
//     });
//   } catch (error) {
//     console.debug('Sentry initialization failed:', error);
//   }
// }

export default Sentry;
