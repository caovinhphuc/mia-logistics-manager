import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

export interface AdvancedTableColumn<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  searchable?: boolean;
  format?: 'date' | 'number' | 'status';
  render?: (value: any, row: T) => React.ReactNode;
}

interface AdvancedDataTableProps<T> {
  columns: AdvancedTableColumn<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  searchable?: boolean;
  pagination?: boolean;
  showRowNumbers?: boolean;
  alternateRowColors?: boolean;
  hoverEffects?: boolean;
  emptyMessage?: string;
  actions?: React.ReactNode;
}

export function AdvancedDataTable<T>({
  columns,
  data,
  title,
  subtitle,
  showRowNumbers = false,
  alternateRowColors = false,
  hoverEffects = true,
  emptyMessage = 'Không có dữ liệu',
  actions,
}: AdvancedDataTableProps<T>) {
  return (
    <Box>
      {(title || subtitle) && (
        <Box sx={{ mb: 2 }}>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {actions && <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>{actions}</Box>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {showRowNumbers && <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>}
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: 'bold',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showRowNumbers ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  hover={hoverEffects}
                  sx={{
                    backgroundColor: alternateRowColors && index % 2 === 1 ? 'grey.50' : 'white',
                  }}
                >
                  {showRowNumbers && <TableCell>{index + 1}</TableCell>}
                  {columns.map((column) => {
                    const value = (row as any)[column.id];
                    return (
                      <TableCell key={String(column.id)} align={column.align || 'left'}>
                        {column.render ? column.render(value, row) : String(value || '')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
