import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  searchable?: boolean;
  multiple?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  fullWidth = false,
  searchable = false,
  multiple = false,
}) => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = searchable
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const triggerClasses = [
    'flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-all',
    'border focus:outline-none focus:ring-2 focus:ring-blue-500',
    error
      ? darkMode
        ? 'border-red-500 bg-gray-800 text-white'
        : 'border-red-500 bg-white text-gray-900'
      : darkMode
        ? 'border-gray-600 bg-gray-800 text-white hover:border-gray-500'
        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    fullWidth ? 'w-full' : 'min-w-[200px]',
  ].filter(Boolean).join(' ');

  const dropdownClasses = [
    'absolute z-50 mt-1 max-h-60 overflow-auto rounded-lg shadow-lg border',
    darkMode
      ? 'bg-gray-800 border-gray-600'
      : 'bg-white border-gray-300',
    fullWidth ? 'w-full' : 'min-w-[200px]',
  ].join(' ');

  return (
    <div className={fullWidth ? 'w-full' : 'relative'}>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${
          error
            ? darkMode ? 'text-red-400' : 'text-red-600'
            : darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        <div className={triggerClasses} onClick={handleToggle}>
          <span className={selectedOption ? '' : darkMode ? 'text-gray-400' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className={dropdownClasses}>
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-2 py-1 text-sm rounded border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}

            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                      option.value === value
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : darkMode
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-100 text-gray-900'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className={`px-3 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className={`mt-1 text-xs ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
