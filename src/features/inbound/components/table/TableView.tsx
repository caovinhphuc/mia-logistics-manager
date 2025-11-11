import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import {
  Luggage as LuggageIcon,
  Backpack as BackpackIcon,
  CardGiftcard as GiftIcon,
  TravelExplore as TravelExploreIcon,
  Handyman as HandymanIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { StatusChip } from '../shared';
import { InboundItem, ActionMenuAction } from '../../types/inbound';
import { formatDate } from '../../utils/dateUtils';
import { getStatusLabel } from '../../utils/statusUtils';
import ActionMenu from '../shared/ActionMenu';

// Category icons mapping
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Vali':
      return <LuggageIcon />;
    case 'Balo':
      return <BackpackIcon />;
    case 'Quà tặng':
      return <GiftIcon />;
    case 'Phụ kiện':
      return <TravelExploreIcon />;
    case 'Phụ kiện sửa chữa':
      return <HandymanIcon />;
    case 'Nguyên vật liệu':
      return <InventoryIcon />;
    default:
      return <LuggageIcon />; // Default icon
  }
};

interface TableViewProps {
  items: InboundItem[];
  onAction: (action: ActionMenuAction, item: InboundItem) => void;
  showAddCalendar?: boolean;
}

const TableView: React.FC<TableViewProps> = ({
  items,
  onAction,
  showAddCalendar = false,
}) => {
  return (
    <Paper sx={{ p: 2, overflow: 'hidden', maxWidth: '100%' }}>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          maxWidth: '100%',
        }}
      >
        <Table
          size="medium"
          stickyHeader
          sx={{
            tableLayout: 'auto',
            bgcolor: 'background.paper',
            '& .MuiTableHead-root th': {
              fontWeight: 700,
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              color: 'text.primary',
              backgroundColor: 'grey.100',
              px: 1,
              py: 1.25,
              borderBottom: '2px solid',
              borderColor: 'primary.main',
            },
            '& .MuiTableBody-root td': {
              fontSize: '0.75rem',
              whiteSpace: 'normal',
              overflow: 'visible',
              textOverflow: 'clip',
              px: 1,
              py: 1,
              fontWeight: 400,
            },
            '& .MuiTableBody-root .MuiChip-root': {
              fontSize: '0.72rem',
              height: 24,
              fontWeight: 600,
              borderRadius: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              },
            },
            '& .MuiTableCell-root': {
              minWidth: 'fit-content',
            },
            // Styling cho TableRow để có khoảng cách đẹp
            '& .MuiTableRow-root': {
              '&:hover': {
                bgcolor: 'primary.50',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '& .MuiTableCell-root': {
                  borderBottom: '1px solid',
                  borderColor: 'primary.main',
                },
              },
              '& .MuiTableCell-root': {
                borderBottom: '1px solid',
                borderColor: 'grey.200',
              },
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell sx={{ minWidth: '180px' }}>Kho nhận</TableCell>
              <TableCell>Mã Sản phẩm</TableCell>
              <TableCell>Phân loại</TableCell>
              <TableCell sx={{ textAlign: 'right', minWidth: '60px' }}>
                SL
              </TableCell>
              <TableCell sx={{ textAlign: 'center', minWidth: '50px' }}>
                Cont
              </TableCell>
              <TableCell sx={{ textAlign: 'center', minWidth: '120px' }}>
                Trạng thái
              </TableCell>
              <TableCell>NVC</TableCell>
              <TableCell>Quy cách</TableCell>
              <TableCell sx={{ textAlign: 'center', minWidth: '100px' }}>
                Mục đích
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const status = getStatusLabel(item.status);
              const isOnline = item.purpose === 'online';

              return (
                <TableRow key={item.id} hover>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: 'text.primary',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.supplier}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontFamily: 'inherit',
                          color: 'error.main',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          mt: 0.2,
                          display: 'block',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: 'error.dark',
                          },
                        }}
                      >
                        {item.pi}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: '180px' }}>
                    <Box>
                      {item.destination?.includes(' - ') ? (
                        <>
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              lineHeight: 1.3,
                              color: 'text.primary',
                            }}
                          >
                            {item.destination.split(' - ')[0]}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.65rem',
                              color: 'text.secondary',
                              lineHeight: 1.2,
                              mt: 0.2,
                              fontWeight: 400,
                              maxWidth: '160px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={item.destination}
                          >
                            {item.destination.split(' - ').slice(1).join(' - ')}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                          title={item.destination}
                        >
                          {item.destination}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    title={item.product}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '150px',
                    }}
                  >
                    {item.product}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        minWidth: 'fit-content',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          border: '1px solid',
                          borderColor: 'info.main',
                          borderRadius: 1,
                          px: 0.5,
                          py: 0.25,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '& .MuiSvgIcon-root': {
                              fontSize: '0.9rem',
                              color: 'primary.main',
                            },
                          }}
                        >
                          {getCategoryIcon(item.category)}
                        </Box>
                        <span
                          title={item.category}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: '#1976d2', // primary.main color
                          }}
                        >
                          {item.category}
                        </span>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>
                    {item.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                    {item.container.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ width: '120px', textAlign: 'center' }}>
                    {(() => {
                      // Custom colors cho từng trạng thái
                      let bgColor, textColor, borderColor;

                      switch (status) {
                        case 'Chờ xác nhận':
                          bgColor = '#fff3e0';
                          textColor = '#e65100';
                          borderColor = '#ff9800';
                          break;
                        case 'Đã xác nhận':
                          bgColor = '#e3f2fd';
                          textColor = '#0d47a1';
                          borderColor = '#2196f3';
                          break;
                        case 'Đang vận chuyển':
                          bgColor = '#f3e5f5';
                          textColor = '#4a148c';
                          borderColor = '#9c27b0';
                          break;
                        case 'Đã đến':
                          bgColor = '#e8f5e8';
                          textColor = '#1b5e20';
                          borderColor = '#4caf50';
                          break;
                        case 'Hoàn thành':
                          bgColor = '#e0f2f1';
                          textColor = '#00695c';
                          borderColor = '#009688';
                          break;
                        default:
                          bgColor = '#f5f5f5';
                          textColor = '#424242';
                          borderColor = '#9e9e9e';
                      }

                      return (
                        <StatusChip
                          status={status}
                          variant="filled"
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            height: '24px',
                            minWidth: '90px',
                            borderRadius: '12px',
                            textTransform: 'none',
                            boxShadow: 'none',
                            backgroundColor: bgColor,
                            color: textColor,
                            border: `1px solid ${borderColor}`,
                            '& .MuiChip-label': {
                              px: 1,
                              py: 0.25,
                              lineHeight: 1.2,
                            },
                            '&:hover': {
                              boxShadow: `0 2px 8px ${borderColor}40`,
                              transform: 'translateY(-1px)',
                              backgroundColor: bgColor,
                              filter: 'brightness(0.95)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell>{item.carrier}</TableCell>
                  <TableCell
                    sx={{ fontWeight: 600 }}
                    title={
                      item.packaging && item.packaging.length > 0
                        ? item.packaging
                            .map(
                              (pkg) =>
                                `${pkg.type}: ${pkg.quantity.toLocaleString()} SET`
                            )
                            .join('\n')
                        : 'Không có quy cách'
                    }
                  >
                    {item.packaging && item.packaging.length > 0
                      ? `${item.packaging.reduce((sum, pkg) => sum + pkg.quantity, 0).toLocaleString()} SET`
                      : '-'}
                  </TableCell>
                  <TableCell sx={{ width: '100px', textAlign: 'center' }}>
                    <StatusChip
                      status={isOnline ? 'Online' : 'Offline'}
                      variant="filled"
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        height: '24px',
                        minWidth: '70px',
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        backgroundColor: isOnline ? '#e8f5e8' : '#fff3e0',
                        color: isOnline ? '#2e7d32' : '#f57c00',
                        border: `1px solid ${isOnline ? '#4caf50' : '#ff9800'}`,
                        '& .MuiChip-label': {
                          px: 1,
                          py: 0.25,
                          lineHeight: 1.2,
                        },
                        '&:hover': {
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transform: 'translateY(-1px)',
                          backgroundColor: isOnline ? '#dcedc8' : '#ffe0b2',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <ActionMenu
                      item={item}
                      onAction={onAction}
                      showAddCalendar={showAddCalendar}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TableView;
