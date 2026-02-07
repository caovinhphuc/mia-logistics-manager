import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

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
  const [jumpPage, setJumpPage] = React.useState('');

  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleJumpPage = () => {
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      onChange(page);
      setJumpPage('');
    }
  };

  const buttonSize = size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm';

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      {/* Total info */}
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {showTotal ? (
          showTotal(total, [startItem, endItem])
        ) : (
          `Showing ${startItem} to ${endItem} of ${total} entries`
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <Button
          variant="ghost"
          size={buttonSize}
          disabled={disabled || current === 1}
          onClick={() => onChange(current - 1)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        >
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <span key={index} className={`px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={current === page ? 'primary' : 'ghost'}
                size={buttonSize}
                disabled={disabled}
                onClick={() => onChange(page as number)}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="ghost"
          size={buttonSize}
          disabled={disabled || current === totalPages}
          onClick={() => onChange(current + 1)}
          rightIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
        >
          Next
        </Button>
      </div>

      {/* Additional controls */}
      <div className="flex items-center space-x-4">
        {/* Page size changer */}
        {showSizeChanger && onShowSizeChange && (
          <div className="flex items-center space-x-2">
            <label
              htmlFor="pageSizeSelect"
              className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Show:
            </label>
            <select
              id="pageSizeSelect"
              value={pageSize}
              onChange={(e) => onShowSizeChange(current, parseInt(e.target.value))}
              disabled={disabled}
              className={`px-2 py-1 text-sm rounded border ${
                darkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick jumper */}
        {showQuickJumper && (
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Go to:
            </span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJumpPage()}
              disabled={disabled}
              title="Go to page"
              placeholder="Page"
              aria-label="Go to page number"
              className={`w-16 px-2 py-1 text-sm rounded border ${
                darkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Button
              variant="ghost"
              size={buttonSize}
              disabled={disabled}
              onClick={handleJumpPage}
            >
              Go
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
