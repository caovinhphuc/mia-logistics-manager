import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FormFieldProps {
  label?: string;
  children: ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  horizontal?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  helperText,
  required = false,
  className = '',
  horizontal = false,
}) => {
  const { darkMode } = useTheme();

  const labelClasses = [
    'block text-sm font-medium mb-1',
    error
      ? darkMode ? 'text-red-400' : 'text-red-600'
      : darkMode ? 'text-gray-300' : 'text-gray-700',
  ].join(' ');

  const helperTextClasses = [
    'mt-1 text-xs',
    error
      ? darkMode ? 'text-red-400' : 'text-red-600'
      : darkMode ? 'text-gray-400' : 'text-gray-500',
  ].join(' ');

  if (horizontal) {
    return (
      <div className={`flex items-start space-x-4 ${className}`}>
        {label && (
          <div className="w-1/4 pt-2">
            <label className={labelClasses}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        )}
        <div className="flex-1">
          {children}
          {(error || helperText) && (
            <p className={helperTextClasses}>
              {error || helperText}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || helperText) && (
        <p className={helperTextClasses}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;
