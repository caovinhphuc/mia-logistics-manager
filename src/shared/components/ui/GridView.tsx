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
} from '@mui/material';

export interface GridViewItem {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  avatarText?: string;
  status?: {
    active: boolean;
    label: string;
    color: 'success' | 'error' | 'warning' | 'info' | 'default';
  };
  details?: Array<{
    label: string;
    value: string;
  }>;
  sections?: Array<{
    title: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  }>;
  actions?: Array<{
    label: string;
    icon: string;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info';
  }>;
}

interface GridViewProps {
  items: GridViewItem[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  onItemClick?: (item: GridViewItem) => void;
}

export function GridView({
  items,
  title,
  subtitle,
  emptyMessage = 'Không có dữ liệu',
  onItemClick,
}: GridViewProps) {
  if (!items || items.length === 0) {
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
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: onItemClick ? 'pointer' : 'default',
                '&:hover': onItemClick ? { boxShadow: 4 } : {},
              }}
              onClick={() => onItemClick?.(item)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={item.avatar} sx={{ mr: 2, width: 48, height: 48 }}>
                    {item.avatarText}
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

                {item.status && (
                  <Chip
                    label={item.status.label}
                    color={item.status.color}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}

                {item.details && (
                  <Box sx={{ mb: 2 }}>
                    {item.details.map((detail, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {detail.label}:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {detail.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {item.sections && (
                  <Box>
                    {item.sections.map((section, sectionIndex) => (
                      <Box key={sectionIndex} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          {section.title}
                        </Typography>
                        {section.items.map((item, itemIndex) => (
                          <Box
                            key={itemIndex}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {item.label}:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {item.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>

              {item.actions && item.actions.length > 0 && (
                <CardActions>
                  {item.actions.map((action, index) => (
                    <IconButton
                      key={index}
                      size="small"
                      color={action.color || 'primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                    >
                      {/* You can add icons here based on action.icon */}
                    </IconButton>
                  ))}
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
