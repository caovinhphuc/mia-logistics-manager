// Sentry Configuration - chỉ init khi có DSN hợp lệ
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const dsn = process.env.REACT_APP_SENTRY_DSN;
const isValidDsn = dsn && dsn !== 'YOUR_SENTRY_DSN_HERE' && dsn.startsWith('https://');

if (isValidDsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      if (process.env.NODE_ENV === 'development') return null;
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'console' && breadcrumb.level === 'error') return null;
      return breadcrumb;
    },
  });
}

export default Sentry;
