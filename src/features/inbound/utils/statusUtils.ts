// Status utility functions
import React from 'react';
import {
  Luggage as LuggageIcon,
  Backpack as BackpackIcon,
  CardGiftcard as GiftIcon,
  TravelExplore as TravelExploreIcon,
  Handyman as HandymanIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'in-transit':
      return 'Đang vận chuyển';
    case 'arrived':
      return 'Đã đến';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'in-transit':
      return 'primary';
    case 'arrived':
      return 'success';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusColorForChip = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'in-transit':
      return 'primary';
    case 'arrived':
      return 'success';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export const getTimelineStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'pending':
      return 'Chờ xử lý';
    case 'in-progress':
      return 'Đang thực hiện';
    case 'confirmed':
      return 'Đã xác nhận';
    default:
      return status;
  }
};

export const getTimelineStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'in-progress':
      return 'info';
    case 'confirmed':
      return 'primary';
    default:
      return 'default';
  }
};

export const getPurposeLabel = (purpose: string): string => {
  switch (purpose) {
    case 'online':
      return 'Online';
    case 'offline':
      return 'Offline';
    default:
      return purpose;
  }
};

export const getPurposeColor = (purpose: string): string => {
  switch (purpose) {
    case 'online':
      return 'success';
    case 'offline':
      return 'default';
    default:
      return 'default';
  }
};

export const getCategoryIcon = (category: string): React.ReactNode => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('vali'))
    return React.createElement(LuggageIcon, {
      fontSize: 'small',
      color: 'info',
    });
  if (cat.includes('balo'))
    return React.createElement(BackpackIcon, {
      fontSize: 'small',
      color: 'info',
    });
  if (cat.includes('quà'))
    return React.createElement(GiftIcon, { fontSize: 'small', color: 'info' });
  if (cat.includes('phụ kiện sửa'))
    return React.createElement(HandymanIcon, {
      fontSize: 'small',
      color: 'info',
    });
  if (cat.includes('phụ kiện'))
    return React.createElement(TravelExploreIcon, {
      fontSize: 'small',
      color: 'info',
    });
  if (cat.includes('nguyên vật liệu'))
    return React.createElement(InventoryIcon, {
      fontSize: 'small',
      color: 'info',
    });
  return React.createElement(LuggageIcon, { fontSize: 'small', color: 'info' });
};

export const getStatusIcon = (status: string) => {
  // This will be imported from MUI icons in the component
  return status;
};
