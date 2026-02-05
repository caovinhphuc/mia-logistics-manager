import { Api as ApiIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Container, Divider, Grid, Typography } from '@mui/material';
import GoogleApiStatusContent from './GoogleApiStatusContent';

const ApiIntegration = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ApiIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Tích hợp API
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Google API Status */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <GoogleApiStatusContent />
              </CardContent>
            </Card>
          </Grid>

          {/* API Configuration */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cấu hình API hiện tại
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Quản lý các thiết lập tích hợp với dịch vụ bên ngoài
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Google Spreadsheet ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {process.env.REACT_APP_GOOGLE_SPREADSHEET_ID ||
                          '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Google Drive Folder ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID ||
                          '1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Apps Script ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                      >
                        {process.env.REACT_APP_GOOGLE_APPS_SCRIPT_ID ||
                          '1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Apps Script Web App URL
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          wordBreak: 'break-all',
                        }}
                      >
                        {process.env.REACT_APP_APPS_SCRIPT_WEB_APP_URL ||
                          'https://script.google.com/macros/s/AKfycbysU9ncMhDg_1CATGPIdewwLqUq2AM6I1RUlsl6nMR9nHDYL_BFFbKMtlIxdg_LU5VJRQ/exec'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Telegram Bot Token
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                      >
                        {process.env.REACT_APP_TELEGRAM_BOT_TOKEN
                          ? `${process.env.REACT_APP_TELEGRAM_BOT_TOKEN.substring(0, 20)}...`
                          : '8434038911:AAEsXilwvPkpCNxt0pAZybgXag7xJnNpmN0'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Telegram Chat ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {process.env.REACT_APP_TELEGRAM_CHAT_ID || '-4818209867'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ApiIntegration;
