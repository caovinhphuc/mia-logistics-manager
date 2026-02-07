import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red';
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  color = 'blue',
}) => {
  const { darkMode } = useTheme();

  const sizeClasses = {
    sm: {
      switch: 'h-4 w-7',
      thumb: 'h-3 w-3',
      translate: 'translate-x-3',
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'h-8 w-14',
      thumb: 'h-7 w-7',
      translate: 'translate-x-6',
    },
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
  };

  const switchClasses = [
    sizeClasses[size].switch,
    'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    checked
      ? colorClasses[color]
      : darkMode
        ? 'bg-gray-600'
        : 'bg-gray-200',
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer',
  ].filter(Boolean).join(' ');

  const thumbClasses = [
    sizeClasses[size].thumb,
    'inline-block rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
    checked ? sizeClasses[size].translate : 'translate-x-0.5',
  ].join(' ');

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        className={switchClasses}
        onClick={handleToggle}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-label={`${label ? (typeof label === 'string' ? label : 'Toggle') : 'Toggle'} ${checked ? 'on' : 'off'}`}
      >
        <span className={thumbClasses} />
      </button>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div
              className={`text-sm font-medium cursor-pointer ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleToggle}
            >
              {label}
            </div>
          )}
          {description && (
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            } ${disabled ? 'opacity-50' : ''}`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Switch;
