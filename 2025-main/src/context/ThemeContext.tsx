import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { COLORS, FONTS, SIZES, SPACING, ANIMATION } from '../constants';

interface ThemeContextType {
  // Theme state
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Theme values
  colors: typeof COLORS;
  fonts: typeof FONTS;
  sizes: typeof SIZES;
  spacing: typeof SPACING;
  animation: typeof ANIMATION;

  // Dynamic classes
  themeClasses: {
    bg: string;
    text: string;
    border: string;
    card: string;
    button: string;
    input: string;
  };

  // Utility functions
  getColorByMode: (lightColor: string, darkColor: string) => string;
  getThemeClass: (baseClass: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    // Update CSS variables
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const themeClasses = {
    bg: darkMode ? 'bg-gray-900' : 'bg-white',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    button: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
  };

  const getColorByMode = (lightColor: string, darkColor: string) => {
    return darkMode ? darkColor : lightColor;
  };

  const getThemeClass = (baseClass: string) => {
    return darkMode ? `${baseClass} dark:${baseClass}-dark` : baseClass;
  };

  const value: ThemeContextType = {
    darkMode,
    toggleDarkMode,
    colors: COLORS,
    fonts: FONTS,
    sizes: SIZES,
    spacing: SPACING,
    animation: ANIMATION,
    themeClasses,
    getColorByMode,
    getThemeClass,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
