import { useState } from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  InboundItem,
  TimelineItem,
  DocumentStatusItem,
  PackagingItem,
} from '../../inbound/types/inbound';
import {
  getLatestTimelineDescription,
  getLatestDocumentStatusDescription,
} from '../../inbound/utils/descriptionUtils';

type Props = {
  item: InboundItem;
  onEdit?: (item: InboundItem) => void;
  onDelete?: (item: InboundItem) => void;
  onMore?: (item: InboundItem) => void;
};

const getStatusLabel = (
  status?: TimelineItem['status'] | DocumentStatusItem['status']
): string => {
  if (!status) return 'Chờ xử lý';
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'in-progress':
      return 'Đang xử lý';
    case 'confirmed':
      return 'Đã xác nhận';
    default:
      return 'Chờ xử lý';
  }
};

const getStatusColor = (
  status?: TimelineItem['status'] | DocumentStatusItem['status']
):
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning' => {
  if (!status) return 'warning';
  switch (status) {
    case 'completed':
      return 'success'; // 🟢 Xanh
    case 'in-progress':
      return 'info'; // 🔵 Xanh dương
    case 'confirmed':
      return 'primary'; // 🟣 Tím
    case 'pending':
      return 'warning'; // 🟡 Cam
    default:
      return 'default'; // ⚪ Xám
  }
};

// Helper: Tính delay status cho timeline/document items
const getDelayStatus = (
  estimatedDate?: string,
  actualDate?: string
): {
  status: 'Đúng hạn' | 'Trước hạn' | 'Trễ hạn' | 'Chưa xác định';
  color: 'success' | 'info' | 'error' | 'warning';
  icon: string;
} => {
  if (!estimatedDate || !actualDate) {
    return {
      status: 'Chưa xác định',
      color: 'warning',
      icon: '❓',
    };
  }

  // Parse dates
  const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date(dateStr);
  };

  const estimated = parseDate(estimatedDate);
  const actual = parseDate(actualDate);

  if (estimated.getTime() === actual.getTime()) {
    return {
      status: 'Đúng hạn',
      color: 'success',
      icon: '✅',
    };
  } else if (actual.getTime() < estimated.getTime()) {
    return {
      status: 'Trước hạn',
      color: 'info',
      icon: '⚡',
    };
  } else {
    return {
      status: 'Trễ hạn',
      color: 'error',
      icon: '🚨',
    };
  }
};

export default function InboundDetailCard({
  item,
  onEdit,
  onDelete,
  onMore,
}: Props) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const formatVNDate = (value?: string): string => {
    if (!value) return 'Chưa có';
    if (value.includes('/')) return value; // already dd/MM/yyyy
    const d = new Date(value);
    return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
  };

  return (
    <Box>
      {/* Header với supplier, type, status */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: 'primary.main' }}
          >
            {item.supplier || ''}
          </Typography>
          <Chip
            label={item.type === 'international' ? '🌍 QT' : '🏠 QN'}
            size="small"
            color={item.type === 'international' ? 'primary' : 'secondary'}
            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={getStatusLabel(
              item.status as unknown as TimelineItem['status']
            )}
            size="small"
            color={getStatusColor(
              item.status as unknown as TimelineItem['status']
            )}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              '& .MuiChip-label': {
                color: 'white',
              },
            }}
          />
        </Box>
      </Box>

      {/* PI & Quantity nổi bật */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.9rem' }}
        >
          {item.pi}
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: 'secondary.main',
              fontSize: '0.9rem',
            }}
          >
            {item.quantity.toLocaleString()} PCS
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              color: 'text.secondary',
              display: 'block',
            }}
          >
            Tổng hàng hóa
          </Typography>
        </Box>
      </Box>

      {/* Product info compact */}
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontSize: '0.8rem', fontWeight: 600 }}
        >
          🎯 {item.product}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            📍 {item.origin} → {item.category}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.7rem',
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            🚢 {parseInt(item.container?.toString() || '0') || 0} cont
          </Typography>
        </Box>
      </Box>

      {/* Carrier & Packaging compact */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
        <Typography
          variant="body2"
          sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
        >
          🚛 <strong>{item.carrier}</strong>
        </Typography>

        {item.packaging && item.packaging.length > 0 && (
          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.3 }}
            >
              📦 Đóng gói:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {item.packaging.map((pkg: PackagingItem) => (
                <Chip
                  key={pkg.id}
                  label={`${pkg.type}: ${pkg.quantity}SET`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Additional info compact */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        <Chip
          label={item.purpose === 'online' ? '🌐 Online' : '🏢 Offline'}
          size="small"
          color={item.purpose === 'online' ? 'info' : 'default'}
          sx={{ fontSize: '0.65rem', height: 22 }}
        />
        <Chip
          label={`⏰ ${item.receiveTime || 'Chưa có'}`}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.65rem', height: 22 }}
        />
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '0.75rem', mb: 0.5 }}
      >
        📍 <strong>Giao tới:</strong> {item.destination || 'Chưa có'}
      </Typography>

      {item.poNumbers && item.poNumbers.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.75rem', mb: 0.5 }}
        >
          📋 <strong>PO:</strong> {item.poNumbers.join(', ')}
        </Typography>
      )}

      {/* Ngày nhận hàng - Nổi bật */}
      <Box
        sx={{
          mt: 1,
          p: 1,
          bgcolor: item.actualArrival ? '#e8f5e8' : '#fff3e0',
          borderRadius: 1,
          border: '1px solid',
          borderColor: item.actualArrival ? '#4caf50' : '#ff9800',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: '0.8rem', fontWeight: 600 }}
          >
            📅 Ngày nhận hàng:
          </Typography>
          {(() => {
            const delayStatus = getDelayStatus(
              item.estimatedArrival,
              item.actualArrival
            );
            return (
              <Chip
                label={`${delayStatus.icon} ${delayStatus.status}`}
                size="small"
                color={delayStatus.color}
                variant="outlined"
                sx={{
                  fontSize: '0.6rem',
                  height: 18,
                  '& .MuiChip-label': { px: 0.5, fontSize: '0.6rem' },
                }}
              />
            );
          })()}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.75rem', ml: 1 }}
        >
          <strong>Dự kiến:</strong> {formatVNDate(item.estimatedArrival)}
        </Typography>
        <Typography
          variant="body2"
          color={item.actualArrival ? 'success.main' : 'warning.main'}
          sx={{
            fontSize: '0.75rem',
            fontWeight: item.actualArrival ? 600 : 400,
            ml: 1,
          }}
        >
          <strong>Thực tế:</strong> {formatVNDate(item.actualArrival)}
        </Typography>
      </Box>

      {/* Ghi chú */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '0.8rem', mt: 1 }}
      >
        <strong>Ghi chú:</strong> {item.notes || 'Chưa có'}
      </Typography>

      {/* Chi tiết kỹ thuật expandable */}
      <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            mb: showTechnicalDetails ? 1 : 0,
          }}
          onClick={() => setShowTechnicalDetails((x) => !x)}
        >
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ fontSize: '0.8rem', fontWeight: 600 }}
          >
            <strong>📋 Tiến độ & Chứng từ:</strong>
          </Typography>
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ fontSize: '0.7rem' }}
          >
            {showTechnicalDetails ? 'Thu gọn ▲' : 'Xem thêm ▼'}
          </Typography>
        </Box>

        {showTechnicalDetails && (
          <>
            <Typography
              variant="body2"
              color="primary.main"
              sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 1, mb: 1 }}
            >
              <strong>📅 Timeline Vận Chuyển:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {item.timeline && item.timeline.length > 0 ? (
                item.timeline.map((t) => {
                  const est = formatVNDate(t.estimatedDate);
                  const act = formatVNDate(t.date);
                  const desc = getLatestTimelineDescription(t);
                  const hasActual = t.date && t.date !== 'Chưa có';

                  return (
                    <Box
                      key={`tl-${t.id}`}
                      sx={{
                        p: 1,
                        bgcolor: hasActual ? '#f1f8e9' : '#fafafa',
                        borderRadius: 0.5,
                        border: '1px solid',
                        borderColor: hasActual ? '#c8e6c9' : '#e0e0e0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {t.name}
                        </Typography>
                        {(() => {
                          // Không hiển thị delay status cho "Ngày tạo phiếu" vì không có estimated date
                          if (
                            t.name === 'Ngày tạo phiếu' ||
                            t.name === 'Ngày nhập hàng'
                          ) {
                            return null;
                          }

                          const delayStatus = getDelayStatus(
                            t.estimatedDate,
                            t.date
                          );
                          return (
                            <Chip
                              label={`${delayStatus.icon} ${delayStatus.status}`}
                              size="small"
                              color={delayStatus.color}
                              variant="outlined"
                              sx={{
                                fontSize: '0.6rem',
                                height: 18,
                                '& .MuiChip-label': {
                                  px: 0.5,
                                  fontSize: '0.6rem',
                                },
                              }}
                            />
                          );
                        })()}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.3 }}>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: '0.7rem' }}
                        >
                          Dự kiến: <strong>{est}</strong>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.7rem',
                            color: hasActual
                              ? 'success.main'
                              : 'text.secondary',
                            fontWeight: hasActual ? 600 : 400,
                          }}
                        >
                          Thực tế: <strong>{act}</strong>
                        </Typography>
                      </Box>
                      {desc && desc !== 'Chưa có' && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.65rem',
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            display: 'block',
                            mt: 0.3,
                          }}
                        >
                          💬 {desc}
                        </Typography>
                      )}
                    </Box>
                  );
                })
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', textAlign: 'center', py: 1 }}
                >
                  Chưa có timeline vận chuyển
                </Typography>
              )}
            </Box>

            <Typography
              variant="body2"
              color="primary.main"
              sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 2, mb: 1 }}
            >
              <strong>📋 Trạng thái chứng từ:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {item.documentStatus && item.documentStatus.length > 0 ? (
                item.documentStatus.map((d) => {
                  const est = formatVNDate(d.estimatedDate);
                  const act = formatVNDate(d.date);
                  const desc = getLatestDocumentStatusDescription(d);
                  const hasActual = d.date && d.date !== 'Chưa có';

                  return (
                    <Box
                      key={`doc-${d.id}`}
                      sx={{
                        p: 1,
                        bgcolor: hasActual ? '#e8f5e8' : '#fafafa',
                        borderRadius: 0.5,
                        border: '1px solid',
                        borderColor: hasActual ? '#c8e6c9' : '#e0e0e0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {d.name}
                        </Typography>
                        {(() => {
                          const delayStatus = getDelayStatus(
                            d.estimatedDate,
                            d.date
                          );
                          return (
                            <Chip
                              label={`${delayStatus.icon} ${delayStatus.status}`}
                              size="small"
                              color={delayStatus.color}
                              variant="outlined"
                              sx={{
                                fontSize: '0.6rem',
                                height: 18,
                                '& .MuiChip-label': {
                                  px: 0.5,
                                  fontSize: '0.6rem',
                                },
                              }}
                            />
                          );
                        })()}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.3 }}>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: '0.7rem' }}
                        >
                          Dự kiến: <strong>{est}</strong>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.7rem',
                            color: hasActual
                              ? 'success.main'
                              : 'text.secondary',
                            fontWeight: hasActual ? 600 : 400,
                          }}
                        >
                          Thực tế: <strong>{act}</strong>
                        </Typography>
                      </Box>
                      {desc && desc !== 'Chưa có' && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.65rem',
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            display: 'block',
                            mt: 0.3,
                          }}
                        >
                          💬 {desc}
                        </Typography>
                      )}
                    </Box>
                  );
                })
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', textAlign: 'center', py: 1 }}
                >
                  Chưa có trạng thái chứng từ
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Footer với actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: '0.7rem' }}
        >
          ID: {item.id}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => onMore?.(item)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          {onEdit && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(item)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(item)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
