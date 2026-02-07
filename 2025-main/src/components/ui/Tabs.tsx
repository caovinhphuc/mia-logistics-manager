import React, { ReactNode, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface TabItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  type?: 'line' | 'card' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom' | 'left' | 'right';
  centered?: boolean;
  destroyInactiveTabPane?: boolean;
}



const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  type = 'line',
  size = 'md',
  position = 'top',
  centered = false,
  destroyInactiveTabPane = false,
}) => {
  const { darkMode } = useTheme();
  const [internalActiveKey, setInternalActiveKey] = useState(
    controlledActiveKey || defaultActiveKey || items[0]?.key
  );

  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;

  const handleTabClick = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  const getTabClasses = (item: TabItem) => {
    const isActive = activeKey === item.key;
    const baseClasses = [
      'inline-flex items-center space-x-2',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      sizeClasses[size],
    ];

    if (item.disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
    } else {
      baseClasses.push('cursor-pointer');
    }

    switch (type) {
      case 'card':
        baseClasses.push(
          'border rounded-t-lg',
          isActive
            ? darkMode
              ? 'bg-gray-800 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
            : darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
        );
        break;
      case 'pill':
        baseClasses.push(
          'rounded-full',
          isActive
            ? 'bg-blue-500 text-white'
            : darkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
        );
        break;
      default: // line
        baseClasses.push(
          'border-b-2',
          isActive
            ? 'border-blue-500 text-blue-600'
            : darkMode
              ? 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        );
    }

    return baseClasses.join(' ');
  };

  const getTabListClasses = () => {
    const baseClasses = ['flex'];

    if (position === 'left' || position === 'right') {
      baseClasses.push('flex-col space-y-1');
    } else {
      baseClasses.push('space-x-1');
      if (centered) {
        baseClasses.push('justify-center');
      }
    }

    if (type === 'line') {
      if (position === 'top') {
        baseClasses.push(`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`);
      } else if (position === 'bottom') {
        baseClasses.push(`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`);
      }
    }

    return baseClasses.join(' ');
  };

  const activeTabContent = items.find(item => item.key === activeKey)?.children;

  const isVertical = position === 'left' || position === 'right';

  return (
    <div className={`${isVertical ? 'flex' : ''} ${position === 'right' ? 'flex-row-reverse' : ''}`}>
      {/* Tab List */}
      <div className={`${isVertical ? (position === 'left' ? 'mr-4' : 'ml-4') : ''}`}>
        <div
          className={getTabListClasses()}
          role="tablist"
          aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        >
          {items.map((item) => (
            <button
              key={item.key}
              className={getTabClasses(item)}
              onClick={() => !item.disabled && handleTabClick(item.key)}
              disabled={item.disabled}
              role="tab"
              aria-selected={activeKey === item.key}
              aria-controls={`tabpanel-${item.key}`}
              id={`tab-${item.key}`}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={`flex-1 ${position === 'bottom' ? 'order-first' : ''}`}>
        {items.map((item) => {
          const isActive = activeKey === item.key;

          if (destroyInactiveTabPane && !isActive) {
            return null;
          }

          return (
            <div
              key={item.key}
              className={isActive ? 'block' : 'hidden'}
              role="tabpanel"
              aria-labelledby={`tab-${item.key}`}
              id={`tabpanel-${item.key}`}
            >
              {item.children}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
