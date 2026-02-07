import React, { ReactNode, InputHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  indeterminate = false,
  size = 'md',
  disabled = false,
  checked,
  onChange,
  className = '',
  ...props
}) => {
  const { darkMode } = useTheme();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const checkboxClasses = [
    sizeClasses[size],
    'rounded border-2 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500',
    error
      ? 'border-red-500'
      : checked || indeterminate
        ? 'border-blue-500 bg-blue-500'
        : darkMode
          ? 'border-gray-600 bg-gray-800'
          : 'border-gray-300 bg-white',
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer hover:border-blue-400',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="flex items-start space-x-3">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={checkboxClasses}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate;
          }}
          {...props}
        />

        {/* Custom checkmark */}
        {(checked || indeterminate) && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {indeterminate ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
      </div>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label className={`block text-sm font-medium cursor-pointer ${
              error
                ? darkMode ? 'text-red-400' : 'text-red-600'
                : darkMode ? 'text-gray-200' : 'text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {label}
            </label>
          )}
          {description && (
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            } ${disabled ? 'opacity-50' : ''}`}>
              {description}
            </p>
          )}
          {error && (
            <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
