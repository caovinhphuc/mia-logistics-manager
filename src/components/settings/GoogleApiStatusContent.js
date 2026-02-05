import { CheckCircle, Cloud, Error, Google, Refresh, Storage } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

const GoogleAPIStatusContent = () => {
  const [status, setStatus] = useState({
    loading: true,
    googleAPI: false,
    googleSheets: false,
    googleDrive: false,
    error: null,
    details: {},
  });

  const testGoogleAPI = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Test Google API script loading
      const scriptLoaded = !!document.querySelector('script[src*="apis.google.com"]');

      // Test Google API client
      const clientAvailable = !!(window.gapi && window.gapi.client);

      // Test Google Sheets
      let sheetsAvailable = false;
      if (clientAvailable) {
        try {
          // Check if Sheets API is already loaded
          if (window.gapi.client.sheets) {
            sheetsAvailable = true;
          } else {
            // Try to load it with proper error handling
            await window.gapi.client.load(
              'https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest'
            );
            sheetsAvailable = true;
          }
        } catch (e) {
          console.warn('Google Sheets API not available:', e);
          // Try alternative loading method
          try {
            await window.gapi.client.load('sheets', 'v4');
            sheetsAvailable = true;
          } catch (e2) {
            console.warn('Google Sheets API load failed (both methods):', e2.message);
          }
        }
      }

      // Test Google Drive
      let driveAvailable = false;
      if (clientAvailable) {
        try {
          // Check if Drive API is already loaded
          if (window.gapi.client.drive) {
            driveAvailable = true;
          } else {
            // Try to load it with proper error handling
            await window.gapi.client.load(
              'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
            );
            driveAvailable = true;
          }
        } catch (e) {
          console.warn('Google Drive API not available:', e);
          // Try alternative loading method
          try {
            await window.gapi.client.load('drive', 'v3');
            driveAvailable = true;
          } catch (e2) {
            console.warn('Google Drive API load failed (both methods):', e2.message);
          }
        }
      }

      // Check environment variables (simulated)
      const hasClientId = !!(process.env.REACT_APP_GOOGLE_CLIENT_ID || 'placeholder');
      const hasApiKey = !!(
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
        process.env.REACT_APP_GOOGLE_API_KEY ||
        'placeholder'
      );
      const hasSpreadsheetId = !!(process.env.REACT_APP_GOOGLE_SHEET_ID || 'placeholder');
      const hasDriveFolder = !!(process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID || 'placeholder');
      const hasPrivateKey = !!(process.env.REACT_APP_GOOGLE_PRIVATE_KEY || 'placeholder');

      // Check specific APIs
      const apiDetails = {
        scriptLoaded,
        clientAvailable,
        sheetsAvailable,
        driveAvailable,
        environmentVariables: {
          clientId: hasClientId,
          apiKey: hasApiKey,
          spreadsheetId: hasSpreadsheetId,
          driveFolder: hasDriveFolder,
          privateKey: hasPrivateKey,
        },
        keyTechniques: {
          scriptGoogleApi: scriptLoaded,
          googleApiClient: clientAvailable,
          googleSheets: sheetsAvailable,
        },
      };

      setStatus({
        loading: false,
        googleAPI: scriptLoaded && clientAvailable,
        googleSheets: sheetsAvailable,
        googleDrive: driveAvailable,
        error: null,
        details: apiDetails,
      });
    } catch (error) {
      console.error('Error testing Google API:', error);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    testGoogleAPI();
  }, []);

  const getStatusIcon = (isAvailable) => {
    if (status.loading) return <CircularProgress size={20} />;
    return isAvailable ? (
      <CheckCircle sx={{ color: 'success.main' }} />
    ) : (
      <Error sx={{ color: 'error.main' }} />
    );
  };

  const getStatusChip = (isAvailable, loadingText = 'Đang kiểm tra') => {
    if (status.loading) {
      return <Chip label={loadingText} size="small" />;
    }
    return (
      <Chip
        label={isAvailable ? 'Có sẵn' : 'Lỗi'}
        color={isAvailable ? 'success' : 'error'}
        size="small"
      />
    );
  };

  const ContentComponent = () => (
    <Box>
      {/* Header with refresh button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Google color="primary" />
          Trạng thái Google API
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={testGoogleAPI}
          disabled={status.loading}
          startIcon={status.loading ? <CircularProgress size={16} /> : <Refresh />}
        >
          Kiểm tra lại
        </Button>
      </Box>
      {/* CONSTANTS Error Alert */}
      {!status.loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            CONSTANTS is not defined
          </Typography>
        </Alert>
      )}
      {/* Main Status Grid */}
      <Grid container spacing={3}>
        {/* API Status Cards */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: 'background.paper',
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            <Box sx={{ mb: 2 }}>{getStatusIcon(status.googleAPI)}</Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Google API
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Kết nối Google API
            </Typography>
            {getStatusChip(status.googleAPI)}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: 'background.paper',
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            <Box sx={{ mb: 2 }}>{getStatusIcon(status.googleSheets)}</Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Google Sheets
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Kết nối Google Sheets
            </Typography>
            {getStatusChip(status.googleSheets)}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: 'background.paper',
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            <Box sx={{ mb: 2 }}>{getStatusIcon(status.googleDrive)}</Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Google Drive
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Kết nối Google Drive
            </Typography>
            {getStatusChip(status.googleDrive)}
          </Box>
        </Grid>
      </Grid>{' '}
      <Divider sx={{ my: 3 }} />
      {/* Technical Details */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mt: 4, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Storage color="primary" />
        Chi tiết kỹ thuật
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Error color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Script Google API
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Chưa tải
            </Typography>
            <Chip label="Lỗi" color="error" size="small" />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Error color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Google API Client
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Chưa sẵn sàng
            </Typography>
            <Chip label="Lỗi" color="error" size="small" />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Error color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Google Sheets
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Kết nối thất bại
            </Typography>
            <Chip label="Lỗi" color="error" size="small" />
          </Box>
        </Grid>
      </Grid>{' '}
      <Divider sx={{ my: 3 }} />
      {/* Environment Variables */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mt: 4, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Cloud color="primary" />
        Environment Variables
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Error color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Google Client ID
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Chưa cấu hình
            </Typography>
            <Chip label="Lỗi" color="error" size="small" />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Error color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Google API Key
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Chưa cấu hình
            </Typography>
            <Chip label="Lỗi" color="error" size="small" />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Error color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Spreadsheet ID
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Chưa cấu hình
            </Typography>
            <Chip label="Lỗi" color="error" size="small" />
          </Box>
        </Grid>
      </Grid>{' '}
      {/* Status Messages */}
      <Box sx={{ mt: 3 }}>
        {!status.googleAPI && (
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Chế độ Fallback:</strong> Google API không khả dụng. Ứng dụng đang sử dụng dữ
              liệu mẫu để đảm bảo hoạt động ổn định.
            </Typography>
          </Alert>
        )}

        {status.googleAPI && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Kết nối thành công:</strong> Google API đang hoạt động bình thường. Dữ liệu sẽ
              được đồng bộ với Google Sheets.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );

  return <ContentComponent />;
};

export default GoogleAPIStatusContent;
