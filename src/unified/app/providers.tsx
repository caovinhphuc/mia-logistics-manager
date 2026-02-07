import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeContextProvider, useTheme } from '../../contexts/ThemeContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const ThemedContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { muiTheme, isDarkMode } = useTheme();
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: isDarkMode ? muiTheme.palette.background.paper : '#fff',
                    color: isDarkMode ? muiTheme.palette.text.primary : '#333',
                  },
                }}
              />
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const UnifiedProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContextProvider>
      <ThemedContent>{children}</ThemedContent>
    </ThemeContextProvider>
  );
};

export default UnifiedProviders;
