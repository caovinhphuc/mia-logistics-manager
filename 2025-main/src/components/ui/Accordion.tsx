import React, { ReactNode, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

export interface AccordionItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultActiveKey?: string | string[];
  activeKey?: string | string[];
  onChange?: (key: string | string[]) => void;
  accordion?: boolean;
  ghost?: boolean;
  size?: 'sm' | 'md' | 'lg';
  expandIcon?: (isActive: boolean) => ReactNode;
  expandIconPosition?: 'start' | 'end';
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultActiveKey = [],
  activeKey: controlledActiveKey,
  onChange,
  accordion = false,
  ghost = false,
  size = 'md',
  expandIcon,
  expandIconPosition = 'end',
}) => {
  const { darkMode } = useTheme();
  const [internalActiveKey, setInternalActiveKey] = useState<string | string[]>(
    controlledActiveKey !== undefined
      ? controlledActiveKey
      : defaultActiveKey
  );

  const activeKeys = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;
  const activeKeysArray = Array.isArray(activeKeys) ? activeKeys : [activeKeys].filter(Boolean);

  const handleItemClick = (key: string) => {
    let newActiveKeys: string | string[];

    if (accordion) {
      // Single panel mode
      newActiveKeys = activeKeysArray.includes(key) ? '' : key;
    } else {
      // Multiple panels mode
      if (activeKeysArray.includes(key)) {
        newActiveKeys = activeKeysArray.filter(k => k !== key);
      } else {
        newActiveKeys = [...activeKeysArray, key];
      }
    }

    if (controlledActiveKey === undefined) {
      setInternalActiveKey(newActiveKeys);
    }
    onChange?.(newActiveKeys);
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-3',
    lg: 'text-base px-6 py-4',
  };

  const defaultExpandIcon = (isActive: boolean) => (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const getItemClasses = (item: AccordionItem, index: number) => {
    const baseClasses = ['border-b'];

    if (!ghost) {
      baseClasses.push('border rounded-lg mb-2');
      baseClasses.push(darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white');
    } else {
      baseClasses.push(darkMode ? 'border-gray-700' : 'border-gray-200');
    }

    if (index === 0 && !ghost) {
      baseClasses.push('rounded-t-lg');
    }
    if (index === items.length - 1) {
      baseClasses.push('border-b-0');
      if (!ghost) {
        baseClasses.push('rounded-b-lg');
      }
    }

    return baseClasses.join(' ');
  };

  const getHeaderClasses = (item: AccordionItem) => {
    const baseClasses = [
      'w-full flex items-center justify-between',
      'font-medium transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      sizeClasses[size],
    ];

    if (item.disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
    } else {
      baseClasses.push(
        'cursor-pointer',
        darkMode
          ? 'text-gray-200 hover:text-white'
          : 'text-gray-900 hover:text-gray-700'
      );
    }

    if (!ghost) {
      if (expandIconPosition === 'start') {
        baseClasses.push('flex-row-reverse');
      }
    }

    return baseClasses.join(' ');
  };

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const isActive = activeKeysArray.includes(item.key);
        const icon = expandIcon ? expandIcon(isActive) : defaultExpandIcon(isActive);


        return (
          <div key={item.key} className={getItemClasses(item, index)}>
            <div
              className={getHeaderClasses(item)}
              onClick={() => !item.disabled && handleItemClick(item.key)}
            >
              <span className="flex-1">{item.label}</span>
              {expandIconPosition === 'end' && icon}
              {item.extra && <span className="ml-2">{item.extra}</span>}
              {expandIconPosition === 'start' && icon}
            </div>
            {isActive && (
              <div className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.children}
              </div>
            )}
          </div>
        );
      }
      )}
    </div>
  );
};
export default Accordion;
