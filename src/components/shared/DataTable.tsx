import { Delete, Edit } from '@mui/icons-material';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import React from 'react';

interface DataTableColumn {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
    format?: (value: any) => React.ReactNode;
}

interface DataTableProps {
    columns: DataTableColumn[];
    data: any[];
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    onEdit,
    onDelete,
}) => {
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align || 'left'}
                                style={{ minWidth: column.minWidth }}
                                sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        {(onEdit || onDelete) && (
                            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                Thao tác
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow hover key={row.id || index}>
                            {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={column.id} align={column.align || 'left'}>
                                        {column.format ? column.format(value) : value}
                                    </TableCell>
                                );
                            })}
                            {(onEdit || onDelete) && (
                                <TableCell align="center">
                                    {onEdit && (
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(row)}
                                            color="primary"
                                        >
                                            <Edit />
                                        </IconButton>
                                    )}
                                    {onDelete && (
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(row)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
export type { DataTableColumn };
