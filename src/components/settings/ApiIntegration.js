import { Api as ApiIcon } from '@mui/icons-material';
import {
  Box, Card,
  CardContent, Container, Divider, Grid, Typography
} from '@mui/material';
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
                  Cấu hình API
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Quản lý các thiết lập tích hợp với dịch vụ bên ngoài
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Future API integrations can be added here */}
                <Typography variant="body2" color="text.secondary">
                  Các tích hợp API khác sẽ được thêm vào trong tương lai.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ApiIntegration;
