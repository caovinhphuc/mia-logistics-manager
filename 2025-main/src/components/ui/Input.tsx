import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  variant = 'outlined',
  className = '',
  ...props
}, ref) => {
  const { themeClasses, darkMode } = useTheme();

  const baseInputClasses = [
    'block w-full px-3 py-2',
    'text-sm rounded-lg',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ];

  const variantClasses = {
    outlined: error
      ? darkMode
        ? 'border-2 border-red-500 bg-gray-800 text-white focus:ring-red-500'
        : 'border-2 border-red-500 bg-white text-gray-900 focus:ring-red-500'
      : darkMode
        ? 'border border-gray-600 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500'
        : 'border border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500',
    filled: error
      ? darkMode
        ? 'border-0 bg-gray-700 text-white focus:ring-red-500'
        : 'border-0 bg-gray-100 text-gray-900 focus:ring-red-500'
      : darkMode
        ? 'border-0 bg-gray-700 text-white focus:ring-blue-500'
        : 'border-0 bg-gray-100 text-gray-900 focus:ring-blue-500',
  };

  const inputClasses = [
    ...baseInputClasses,
    variantClasses[variant],
    leftIcon ? 'pl-10' : '',
    rightIcon ? 'pr-10' : '',
    className,
  ].filter(Boolean).join(' ');

  const labelClasses = error
    ? darkMode ? 'text-red-400' : 'text-red-600'
    : darkMode ? 'text-gray-300' : 'text-gray-700';

  const helperTextClasses = error
    ? darkMode ? 'text-red-400' : 'text-red-600'
    : darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${labelClasses}`}>
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {leftIcon}
            </div>
          </div>
        )}

        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {rightIcon}
            </div>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-1 text-xs ${helperTextClasses}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
