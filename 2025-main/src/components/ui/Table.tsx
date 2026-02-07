import React, { ReactNode, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onRowClick?: (record: T, index: number) => void;
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedKeys: (string | number)[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination = false,
  pageSize = 10,
  striped = false,
  hoverable = true,
  bordered = false,
  size = 'md',
  onRowClick,
  rowSelection,
}: TableProps<T>) => {
  const { darkMode } = useTheme();
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;

      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Pagination logic
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;

    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;

    if (checked) {
      const allKeys = paginatedData.map((_, index) => index);
      rowSelection.onChange(allKeys, paginatedData);
    } else {
      rowSelection.onChange([], []);
    }
  };

  const handleRowSelect = (record: T, index: number, checked: boolean) => {
    if (!rowSelection) return;

    const newSelectedKeys = checked
      ? [...rowSelection.selectedRowKeys, index]
      : rowSelection.selectedRowKeys.filter(key => key !== index);

    const newSelectedRows = newSelectedKeys.map(key => paginatedData[key as number]).filter(Boolean);
    rowSelection.onChange(newSelectedKeys, newSelectedRows);
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const paddingClasses = {
    sm: 'px-2 py-1',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${
          darkMode ? 'divide-gray-700' : 'divide-gray-200'
        } ${bordered ? `border ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}>
          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              {rowSelection && (
                <th className={`${paddingClasses[size]} text-left`}>
                  <input
                    type="checkbox"
                    checked={rowSelection.selectedRowKeys.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all rows"
                    title="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${paddingClasses[size]} text-${column.align || 'left'} ${sizeClasses[size]} font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  } tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''} ${
                    column.width ? `w-[${typeof column.width === 'number' ? `${column.width}px` : column.width}]` : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.dataIndex)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            sortColumn === column.dataIndex && sortDirection === 'asc'
                              ? 'text-blue-500'
                              : darkMode ? 'text-gray-400' : 'text-gray-400'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-900' : 'bg-white'} divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {paginatedData.map((record, index) => (
              <tr
                key={index}
                className={`${
                  striped && index % 2 === 0
                    ? darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    : ''
                } ${
                  hoverable
                    ? darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    : ''
                } ${onRowClick ? 'cursor-pointer' : ''} transition-colors duration-200`}
                onClick={() => onRowClick?.(record, index)}
              >
                {rowSelection && (
                  <td className={paddingClasses[size]}>
                    <input
                        type="checkbox"
                        checked={rowSelection.selectedRowKeys.includes(index)}
                        onChange={(e) => handleRowSelect(record, index, e.target.checked)}
                        disabled={rowSelection.getCheckboxProps?.(record)?.disabled}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Select row ${index + 1}`}
                        title={`Select row ${index + 1}`}
                      />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`${paddingClasses[size]} ${sizeClasses[size]} ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    } text-${column.align || 'left'}`}
                  >
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            No data available
          </p>
        </div>
      )}
    </div>
  );
};

export default Table;
