//useTheme.jsx
import { useState, useEffect } from 'react';
import SYSTEM_CONFIG from '../config/systemConfig';

// ==================== HOOKS ====================
export const useTheme = () => {
  const [themeClasses, setThemeClasses] = useState({
    surface: 'bg-white',
    surfaceHover: 'hover:bg-gray-50',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      accent: 'text-blue-600',
      muted: 'text-gray-500'
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      accent: 'text-blue-600',
      muted: 'text-gray-500'
    },
    background: 'bg-gray-100',
    surfaceHover: 'hover:bg-gray-50',
    borderHover: 'hover:border-gray-400',
    borderActive: 'border-gray-400',
    border: 'border-gray-300',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    border: 'border-gray-300'
  });

  useEffect(() => {
    // Giả sử bạn có một hàm để lấy theme từ localStorage hoặc API
    const savedTheme = localStorage.getItem('theme') || SYSTEM_CONFIG.DEFAULT_THEME;
    setThemeClasses(getThemeClasses(savedTheme));
  }, []);

  const getThemeClasses = (theme) => {
    switch (theme) {
      case 'dark':
        return {
          surface: 'bg-gray-800',
          text: {
            primary: 'text-white',
            secondary: 'text-gray-400',
            muted: 'text-gray-500'
          },
          background: 'bg-gray-900',
          border: 'border-gray-700'
        };
      case 'light':
      default:
        return {
          surface: 'bg-white',
          text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-700',
            muted: 'text-gray-500'
          },
          background: 'bg-gray-100',
          border: 'border-gray-300'
        };
    }
  };

  return { themeClasses };
};
// ==================== EXPORTS ===================
