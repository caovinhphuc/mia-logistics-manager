import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';

export interface DataTableColumn<T = any> {
  id: string;
  label: string;
  width?: number;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  showRowNumbers?: boolean;
  alternateRowColors?: boolean;
  hoverEffects?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  title,
  subtitle,
  showRowNumbers = false,
  alternateRowColors = false,
  hoverEffects = true,
  emptyMessage = 'Không có dữ liệu',
}: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {showRowNumbers && <TableCell width={60}>#</TableCell>}
              {columns.map((column) => (
                <TableCell key={column.id} width={column.width} sx={{ fontWeight: 'bold' }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: alternateRowColors && index % 2 === 1 ? 'grey.50' : 'inherit',
                  '&:hover': hoverEffects ? { backgroundColor: 'action.hover' } : {},
                }}
              >
                {showRowNumbers && <TableCell>{index + 1}</TableCell>}
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.render ? column.render(item) : (item as any)[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
