import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./contexts/ThemeContext', () => {
  const React = require('react');
  const { createTheme } = require('@mui/material/styles');
  return {
    ThemeContextProvider: ({ children }) => <>{children}</>,
    useTheme: () => ({
      muiTheme: createTheme(),
      isDarkMode: false,
      toggleDarkMode: jest.fn(),
      setDarkMode: jest.fn(),
      setPrimaryColor: jest.fn(),
      updateCustomizations: jest.fn(),
      resetTheme: jest.fn(),
    }),
  };
});

jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

jest.mock('./contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'vi',
    setLanguage: jest.fn(),
  }),
  LanguageProvider: ({ children }) => <>{children}</>,
}));

jest.mock('./hooks/useActivityMonitor', () => jest.fn());
jest.mock('./components/auth/SessionTimeoutWarning', () => () => null);
jest.mock('./components/layout/MainLayout', () => ({ children }) => (
  <div data-testid="main-layout">{children}</div>
));
jest.mock('./components/layout/AuthLayout', () => ({ children }) => (
  <div data-testid="auth-layout">{children}</div>
));
jest.mock('./components/auth/Login', () => () => <div>Trang đăng nhập</div>);
jest.mock('react-helmet-async', () => ({
  HelmetProvider: ({ children }) => <>{children}</>,
  Helmet: () => null,
}));

test('hiển thị trang đăng nhập khi chưa xác thực', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );

  expect(await screen.findByText('Trang đăng nhập')).toBeInTheDocument();
});
