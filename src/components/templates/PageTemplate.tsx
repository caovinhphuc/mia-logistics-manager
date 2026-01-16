import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { Construction as ConstructionIcon, Info as InfoIcon } from '@mui/icons-material';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
}

/**
 * Template component cho các trang chưa được triển khai
 * Hiển thị thông tin trực quan để người dùng biết trang này đang được phát triển
 */
const PageTemplate: React.FC<PageTemplateProps> = ({ title, subtitle, description, icon }) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 4,
            maxWidth: 800,
            width: '100%',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
                : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            {icon || (
              <ConstructionIcon
                sx={{
                  fontSize: 80,
                  color: 'warning.main',
                  opacity: 0.8,
                }}
              />
            )}
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color: 'text.secondary',
                mb: 3,
                fontWeight: 500,
              }}
            >
              {subtitle}
            </Typography>
          )}

          <Box
            sx={{
              backgroundColor: 'info.50',
              borderRadius: 2,
              p: 3,
              mb: 4,
              border: '1px solid',
              borderColor: 'info.200',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <InfoIcon sx={{ color: 'info.main', mt: 0.5 }} />
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  Trang này đang được phát triển
                </Typography>
                {description ? (
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Tính năng này sẽ sớm có mặt. Vui lòng quay lại sau.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    🚀 Đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tính năng này đang được xây dựng và sẽ sớm ra mắt
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    ⚡ Hiệu năng cao
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tối ưu hóa để đảm bảo trải nghiệm tốt nhất
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" color="info.main" gutterBottom>
                    🎨 Giao diện đẹp
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thiết kế hiện đại, trực quan và dễ sử dụng
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default PageTemplate;
