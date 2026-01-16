import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';

export interface EnhancedGridViewItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: string;
  avatarText?: string;
  status?: {
    label: string;
    color: 'success' | 'error' | 'warning' | 'info' | 'default';
  };
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  info?: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
  }>;
  stats?: Array<{
    label: string;
    value: string;
    color: string;
  }>;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

interface EnhancedGridViewProps {
  items: EnhancedGridViewItem[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  onItemClick?: (item: EnhancedGridViewItem) => void;
  selectable?: boolean;
  selectedItems?: EnhancedGridViewItem[];
  onSelectionChange?: (selected: EnhancedGridViewItem[]) => void;
  showStats?: boolean;
  showActions?: boolean;
  showFavorites?: boolean;
  columns?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  actions?: React.ReactNode;
}

export function EnhancedGridView({
  items,
  title,
  subtitle,
  emptyMessage = 'Không có dữ liệu',
  onItemClick,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  showStats = false,
  showActions = false,
  showFavorites = false,
  columns = { xs: 12, sm: 6, md: 4, lg: 3 },
  actions,
}: EnhancedGridViewProps) {
  if (!items || items.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
        {actions && <Box sx={{ mt: 2 }}>{actions}</Box>}
      </Box>
    );
  }

  const handleItemClick = (item: EnhancedGridViewItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleSelectionChange = (item: EnhancedGridViewItem, checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selectedItems, item]);
    } else {
      onSelectionChange(selectedItems.filter((selected) => selected.id !== item.id));
    }
  };

  const isSelected = (item: EnhancedGridViewItem) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

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
      {actions && <Box sx={{ mb: 2 }}>{actions}</Box>}

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={columns.xs} sm={columns.sm} md={columns.md} lg={columns.lg} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: onItemClick ? 'pointer' : 'default',
                '&:hover': onItemClick ? { boxShadow: 4 } : {},
                position: 'relative',
              }}
              onClick={() => handleItemClick(item)}
            >
              {/* Selection Checkbox */}
              {selectable && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected(item)}
                    onChange={(e) => handleSelectionChange(item, e.target.checked)}
                    size="small"
                  />
                </Box>
              )}

              {/* Favorite Button */}
              {showFavorites && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onToggleFavorite?.();
                  }}
                >
                  <IconButton size="small">
                    {item.isFavorite ? (
                      <StarIcon sx={{ color: 'warning.main' }} />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, pt: selectable || showFavorites ? 4 : 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, width: 48, height: 48 }}>
                    {item.avatarText || item.title.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {item.title}
                    </Typography>
                    {item.subtitle && (
                      <Typography variant="body2" color="text.secondary">
                        {item.subtitle}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {item.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                )}

                {item.status && (
                  <Chip
                    label={item.status.label}
                    color={item.status.color}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}

                {item.tags && item.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {item.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}

                {item.info && (
                  <Box sx={{ mb: 2 }}>
                    {item.info.map((info, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ mr: 1, color: 'text.secondary' }}>{info.icon}</Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          {info.label}:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {info.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {showStats && item.stats && (
                  <Box>
                    {item.stats.map((stat, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>

              {showActions && (item.onEdit || item.onDelete) && (
                <CardActions>
                  {item.onEdit && (
                    <Tooltip title="Sửa">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onEdit?.();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {item.onDelete && (
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onDelete?.();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
