import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

// Define type for Card component with sub-components
type CardComponent = React.FC<CardProps> & {
  Header: React.FC<{ children: ReactNode; className?: string }>;
  Body: React.FC<{ children: ReactNode; className?: string }>;
  Footer: React.FC<{ children: ReactNode; className?: string }>;
};

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hoverable = false,
  onClick,
}) => {
  const { darkMode } = useTheme();

  const baseClasses = [
    'rounded-lg',
    'transition-all duration-200',
  ];

  const variantClasses = {
    default: darkMode
      ? 'bg-gray-800 border border-gray-700'
      : 'bg-white border border-gray-200',
    elevated: darkMode
      ? 'bg-gray-800 shadow-lg shadow-gray-900/50'
      : 'bg-white shadow-lg',
    outlined: darkMode
      ? 'bg-transparent border-2 border-gray-600'
      : 'bg-transparent border-2 border-gray-300',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverClasses = hoverable
    ? darkMode
      ? 'hover:bg-gray-750 hover:shadow-lg cursor-pointer'
      : 'hover:bg-gray-50 hover:shadow-lg cursor-pointer'
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const allClasses = [
    ...baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    clickableClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={allClasses} onClick={onClick}>
      {children}
    </div>
  );
};

// Sub-components
export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={`pb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`py-3 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={`pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${className}`}>
      {children}
    </div>
  );
};

// Add component properties to Card
const CardWithComponents = Card as CardComponent;
CardWithComponents.Header = CardHeader;
CardWithComponents.Body = CardBody;
CardWithComponents.Footer = CardFooter;

// Export the Card component with its sub-components
export default CardWithComponents;

// Pagination component (separated from Card)
export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onShowSizeChange?: (current: number, size: number) => void;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onShowSizeChange,
  showQuickJumper = false,
  showTotal,
  size = 'md',
  disabled = false,
}) => {
  const { darkMode } = useTheme();

  // Pagination logic here...

  return (
    <div className={`pagination ${darkMode ? 'dark-mode' : ''}`}>
      {/* Render pagination controls */}
    </div>
  );
};


// Export Pagination component
export { Pagination };


