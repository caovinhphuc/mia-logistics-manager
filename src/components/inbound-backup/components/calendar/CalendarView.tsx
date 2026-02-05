import React from 'react';
import { Box, Typography, Grid, IconButton, Tooltip, Paper } from '@mui/material';
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  Luggage as LuggageIcon,
  Backpack as BackpackIcon,
  CardGiftcard as GiftIcon,
  TravelExplore as TravelExploreIcon,
  Handyman as HandymanIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { InboundItem } from '../../types/inbound';
import { getDaysInMonth, getFirstDayOfMonth, getWeekDays } from '../../utils/dateUtils';
// status label helper not used in calendar view

interface CalendarViewProps {
  items: InboundItem[];
  currentDate: Date;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onCalendarMenuOpen: (event: React.MouseEvent<HTMLElement>, date: Date) => void;
  onItemMenuOpen?: (event: React.MouseEvent<HTMLElement>, item: InboundItem) => void;
}

const getCategoryIcon = (category?: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('vali')) return <LuggageIcon sx={{ fontSize: '0.7rem', color: 'info.main' }} />;
  if (cat.includes('balo')) return <BackpackIcon sx={{ fontSize: '0.7rem', color: 'info.main' }} />;
  if (cat.includes('quà')) return <GiftIcon sx={{ fontSize: '0.7rem', color: 'info.main' }} />;
  if (cat.includes('phụ kiện sửa'))
    return <HandymanIcon sx={{ fontSize: '0.7rem', color: 'info.main' }} />;
  if (cat.includes('phụ kiện'))
    return <TravelExploreIcon sx={{ fontSize: '0.7rem', color: 'info.main' }} />;
  if (cat.includes('nguyên vật liệu'))
    return <InventoryIcon sx={{ fontSize: '0.7rem', color: 'info.main' }} />;
  return <LuggageIcon sx={{ fontSize: '0.7rem', color: 'info.main' }} />;
};

// Removed unused statusPillSx to satisfy eslint

const CalendarView: React.FC<CalendarViewProps> = ({
  items,
  currentDate,
  selectedDate,
  onDateClick,
  onPrevMonth,
  onNextMonth,
  onCalendarMenuOpen,
  onItemMenuOpen,
}) => {
  const weekDays = getWeekDays();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const totalCells = firstDay + daysInMonth;
  const rows = Math.ceil(totalCells / 7);

  // Removed unused local date formatter

  const getItemsForDate = (d: Date) =>
    items.filter((it) => {
      // Ưu tiên ngày nhận hàng thực tế, fallback về ngày nhận hàng dự kiến
      const receiveDate = it.actualArrival || it.estimatedArrival || it.date;

      // Handle different date formats
      let parsedDate: Date;
      if (receiveDate.includes('/')) {
        // Handle dd/MM/yyyy format
        const [day, month, year] = receiveDate.split('/');
        parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Handle yyyy-MM-dd format
        parsedDate = new Date(receiveDate);
      }

      return parsedDate.toDateString() === d.toDateString();
    });

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          Lịch nhập hàng -{' '}
          {currentDate.toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
        <Box>
          <IconButton size="small" onClick={onPrevMonth}>
            <ArrowBackIcon fontSize="inherit" />
          </IconButton>
          <IconButton size="small" onClick={onNextMonth}>
            <ArrowForwardIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>

      {/* Week header */}
      <Grid container sx={{ mb: 1 }}>
        {weekDays.map((w) => (
          <Grid key={w} item xs={12 / 7} sx={{ px: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {w}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Days */}
      <Grid container>
        {Array.from({ length: rows * 7 }).map((_, i) => {
          const dayNumber = i - firstDay + 1;
          const isValid = dayNumber > 0 && dayNumber <= daysInMonth;
          const cellDate = isValid
            ? new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)
            : null;
          const isToday = !!cellDate && cellDate.toDateString() === new Date().toDateString();
          const isSelected =
            !!cellDate && !!selectedDate && cellDate.toDateString() === selectedDate.toDateString();
          const dayItems = cellDate ? getItemsForDate(cellDate) : [];

          return (
            <Grid key={i} item xs={12 / 7} sx={{ p: 0.5 }}>
              <Tooltip
                title={cellDate ? `Click để xem chi tiết (${dayItems.length} lô hàng)` : ''}
                placement="top"
              >
                <Box
                  onClick={() => cellDate && onDateClick(cellDate)}
                  sx={{
                    p: 1,
                    height: 96,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    bgcolor: isSelected ? 'primary.50' : isToday ? 'warning.50' : 'white',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'background-color 0.15s ease-in-out',
                  }}
                >
                  {isValid && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isToday ? 'warning.main' : 'text.primary',
                        }}
                      >
                        {dayNumber}
                      </Typography>

                      {/* Items in day */}
                      {dayItems.length > 0 && (
                        <Box
                          sx={{
                            mt: 0.4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.35,
                          }}
                        >
                          {dayItems.slice(0, 2).map((it) => (
                            <Box
                              key={it.id}
                              onClick={(e) => onItemMenuOpen && onItemMenuOpen(e, it)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.45,
                                px: 0.5,
                                py: 0.25,
                                bgcolor: '#fff',
                                borderRadius: 1,
                                border: '1px solid rgba(0,0,0,0.14)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                cursor: 'pointer',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: '50%',
                                  bgcolor:
                                    it.status === 'pending'
                                      ? 'warning.main'
                                      : it.status === 'confirmed'
                                        ? 'info.main'
                                        : it.status === 'arrived' || it.status === 'completed'
                                          ? 'success.main'
                                          : 'grey.500',
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.6rem',
                                  fontWeight: 700,
                                  color: 'warning.main',
                                }}
                              >
                                {it.quantity.toLocaleString()}
                              </Typography>
                              {getCategoryIcon(it.category)}
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.6rem',
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1,
                                }}
                              >
                                {it.supplier}
                              </Typography>
                              {/* No status text in cell per spec; use only dot color */}
                            </Box>
                          ))}
                          {dayItems.length > 2 && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.5rem',
                                color: 'text.secondary',
                                textAlign: 'center',
                              }}
                            >
                              +{dayItems.length - 2} khác
                            </Typography>
                          )}
                        </Box>
                      )}

                      {/* Day menu (always visible) */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          opacity: 0.35,
                          '&:hover': { opacity: 1, bgcolor: 'grey.200' },
                          borderRadius: 1,
                        }}
                        onClick={(e) => cellDate && onCalendarMenuOpen(e, cellDate)}
                      >
                        <MoreVertIcon sx={{ fontSize: '0.85rem', color: 'grey.600' }} />
                      </Box>
                    </>
                  )}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default CalendarView;
