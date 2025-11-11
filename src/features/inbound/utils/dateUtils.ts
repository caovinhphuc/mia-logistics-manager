// Date utility functions

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('vi-VN');
};

export const formatDateToVN = (date: Date | string): string => {
  if (!date) return 'Chưa có';

  // If it's already in Vietnamese format (dd/MM/yyyy), return as is
  if (typeof date === 'string' && date.includes('/') && date.length === 10) {
    // Validate the format by trying to parse it
    const parts = date.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
        return date;
      }
    }
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Chưa có';
  return dateObj.toLocaleDateString('vi-VN');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('vi-VN');
};

export const formatDateForInput = (date: Date | string): string => {
  if (!date) return '';

  // If it's already in Vietnamese format (dd/MM/yyyy), convert it
  if (typeof date === 'string' && date.includes('/')) {
    const parts = date.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
        // Convert dd/MM/yyyy to yyyy-MM-dd
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    }
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString().split('T')[0];
};

export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return d1.toDateString() === d2.toDateString();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const getMonthYear = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });
};

export const getWeekDays = (): string[] => {
  return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
};

export const convertGoogleSheetsDate = (dateStr: string | number): string => {
  if (typeof dateStr === 'number') {
    // Google Sheets serial number to date
    const date = new Date((dateStr - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  } else if (dateStr && dateStr.includes('/')) {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return dateStr as string;
};
