import './utils/sentry';
//index.js
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { vi } from 'date-fns/locale';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

// Import contexts and providers
import { AuthProvider } from './contexts/AuthContext';
import { GoogleProvider } from './contexts/GoogleContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeContextProvider, useTheme } from './contexts/ThemeContext';

// Import main App component
import App from './App';

// Import theme
// Remove static theme import - we'll use dynamic theme from ThemeContext

// Import global styles
import './locales/i18n';
import './styles/global.css';

// Initialize performance monitoring
// Create QueryClient with Vietnamese configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      staleTime: 5 * 60 * 1000, // 5 phút
      cacheTime: 10 * 60 * 1000, // 10 phút
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>Đã xảy ra lỗi không mong muốn</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Xin lỗi, ứng dụng đã gặp sự cố. Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.
        </p>
        <details style={{ marginBottom: '24px', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', color: '#1976d2' }}>
            Chi tiết lỗi (dành cho nhà phát triển)
          </summary>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
              marginTop: '8px',
            }}
          >
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetErrorBoundary}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Thử lại
        </button>
      </div>
    </div>
  );
};

// Component to use theme from ThemeContext
const ThemedAppContent = () => {
  const { muiTheme, isDarkMode } = useTheme();

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <LanguageProvider>
          <AuthProvider>
            <GoogleProvider>
              <NotificationProvider>
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: isDarkMode ? muiTheme.palette.background.paper : '#fff',
                      color: isDarkMode ? muiTheme.palette.text.primary : '#333',
                      border: `1px solid ${isDarkMode ? muiTheme.palette.divider : '#e0e0e0'}`,
                    },
                    success: {
                      style: {
                        background: muiTheme.palette.success.main,
                        color: '#fff',
                      },
                    },
                    error: {
                      style: {
                        background: muiTheme.palette.error.main,
                        color: '#fff',
                      },
                    },
                  }}
                />
              </NotificationProvider>
            </GoogleProvider>
          </AuthProvider>
        </LanguageProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

// Main App Wrapper with all providers
const AppWrapper = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo);
        // Send error to logging service
        if (process.env.REACT_APP_ERROR_REPORTING === 'true') {
          // sendErrorToLoggingService(error, errorInfo);
        }
      }}
    >
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ThemeContextProvider>
              <ThemedAppContent />
            </ThemeContextProvider>
          </BrowserRouter>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);

// Performance monitoring
if (process.env.REACT_APP_PERFORMANCE_MONITORING === 'true') {
  // Report web vitals
  import('./utils/reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals();
  });
}

// Hot module replacement disabled to prevent React Refresh errors

// End of index.js
