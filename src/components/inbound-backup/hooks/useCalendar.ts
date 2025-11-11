import { useState, useCallback, useMemo } from 'react';
import { InboundItem } from '../types/inbound';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
} from '../utils/dateUtils';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateItems, setSelectedDateItems] = useState<InboundItem[]>([]);
  const [addFromCalendar, setAddFromCalendar] = useState<Date | null>(null);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, []);

  const handleDateClick = useCallback((date: Date, items: InboundItem[]) => {
    setSelectedDate(date);
    setSelectedDateItems(items);
  }, []);

  const getFilteredItemsForDate = useCallback(
    (date: Date, items: InboundItem[]) => {
      return items.filter((item) => {
        const itemDate = new Date(item.date);
        return isSameDay(itemDate, date);
      });
    },
    []
  );

  const getCalendarGrid = useCallback(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );
    }

    return days;
  }, [currentDate]);

  const getMonthYear = useMemo(() => {
    return currentDate.toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate]);

  return {
    currentDate,
    selectedDate,
    selectedDateItems,
    addFromCalendar,
    setCurrentDate,
    setSelectedDate,
    setSelectedDateItems,
    setAddFromCalendar,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    getFilteredItemsForDate,
    getCalendarGrid,
    getMonthYear,
  };
};
