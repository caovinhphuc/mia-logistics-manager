import {
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  TableChart as TableChartIcon,
  Telegram as TelegramIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

// Import services
import { emailService } from '../../services/emailService';
import { googleDriveService } from '../../services/googleDriveService';
import { googleSheetsService } from '../../services/googleSheetsService';
import { telegramBotService } from '../../services/telegramBotService';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tabpanel-${index}`}
      aria-labelledby={`api-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ApiIntegrationManager() {
  const [activeTab, setActiveTab] = useState(0);
  const [services, setServices] = useState({
    telegram: { connected: false, status: 'disconnected', error: null, config: {} },
    email: { connected: false, status: 'disconnected', error: null, config: {} },
    drive: { connected: false, status: 'disconnected', error: null, config: {} },
    sheets: { connected: false, status: 'disconnected', error: null, config: {} },
  });
  const [loading, setLoading] = useState({});
  const [testResults, setTestResults] = useState({});
  const [configDialog, setConfigDialog] = useState({ open: false, service: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    checkAllServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAllServices = async () => {
    setLoading({ all: true });

    await Promise.allSettled([
      checkTelegramService(),
      checkEmailService(),
      checkDriveService(),
      checkSheetsService(),
    ]);

    setLoading({});
  };

  const checkTelegramService = async () => {
    try {
      setLoading((prev) => ({ ...prev, telegram: true }));
      const result = await telegramBotService.testConnection();
      setServices((prev) => ({
        ...prev,
        telegram: {
          connected: result.success,
          status: result.success ? 'connected' : 'error',
          error: result.error || null,
          config: { botInfo: result.botInfo },
        },
      }));
    } catch (error) {
      setServices((prev) => ({
        ...prev,
        telegram: {
          connected: false,
          status: 'error',
          error: error.message,
          config: {},
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, telegram: false }));
    }
  };

  const checkEmailService = async () => {
    try {
      setLoading((prev) => ({ ...prev, email: true }));
      const result = await emailService.testConnection();
      setServices((prev) => ({
        ...prev,
        email: {
          connected: result.success,
          status: result.success ? 'connected' : 'error',
          error: result.error || null,
          config: { method: result.method },
        },
      }));
    } catch (error) {
      setServices((prev) => ({
        ...prev,
        email: {
          connected: false,
          status: 'error',
          error: error.message,
          config: {},
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const checkDriveService = async () => {
    try {
      setLoading((prev) => ({ ...prev, drive: true }));
      const result = await googleDriveService.testConnection();
      setServices((prev) => ({
        ...prev,
        drive: {
          connected: result.connected,
          status: result.connected ? 'connected' : 'error',
          error: result.error || null,
          config: {
            folderAccess: result.folderAccess,
            uploadTest: result.uploadTest,
            downloadTest: result.downloadTest,
            quotaCheck: result.quotaCheck,
          },
        },
      }));
    } catch (error) {
      setServices((prev) => ({
        ...prev,
        drive: {
          connected: false,
          status: 'error',
          error: error.message,
          config: {},
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, drive: false }));
    }
  };

  const checkSheetsService = async () => {
    try {
      setLoading((prev) => ({ ...prev, sheets: true }));
      const result = await googleSheetsService.testConnection();
      setServices((prev) => ({
        ...prev,
        sheets: {
          connected: result.authenticated && result.spreadsheetAccess,
          status: result.authenticated && result.spreadsheetAccess ? 'connected' : 'error',
          error: result.error || null,
          config: {
            apiLoaded: result.apiLoaded,
            authenticated: result.authenticated,
            spreadsheetAccess: result.spreadsheetAccess,
            readTest: result.readTest,
          },
        },
      }));
    } catch (error) {
      setServices((prev) => ({
        ...prev,
        sheets: {
          connected: false,
          status: 'error',
          error: error.message,
          config: {},
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sheets: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon />;
      case 'connecting':
        return <CircularProgress size={20} />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const handleTestService = async (serviceName) => {
    setLoading((prev) => ({ ...prev, [serviceName]: true }));

    try {
      let result;
      switch (serviceName) {
        case 'telegram':
          result = await testTelegramFeatures();
          break;
        case 'email':
          result = await testEmailFeatures();
          break;
        case 'drive':
          result = await testDriveFeatures();
          break;
        case 'sheets':
          result = await testSheetsFeatures();
          break;
        default:
          throw new Error('Unknown service');
      }

      setTestResults((prev) => ({ ...prev, [serviceName]: result }));
      showSnackbar(`${serviceName} test completed successfully`, 'success');
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [serviceName]: { error: error.message } }));
      showSnackbar(`${serviceName} test failed: ${error.message}`, 'error');
    } finally {
      setLoading((prev) => ({ ...prev, [serviceName]: false }));
    }
  };

  const testTelegramFeatures = async () => {
    const results = {
      botInfo: null,
      messageSent: false,
      alertSent: false,
      timestamp: new Date().toISOString(),
    };

    // Get bot info
    results.botInfo = await telegramBotService.getBotInfo();

    // Test message sending
    if (process.env.REACT_APP_TELEGRAM_CHAT_ID) {
      await telegramBotService.sendMessage('🧪 Test message from MIA Logistics Manager');
      results.messageSent = true;

      // Test alert sending
      await telegramBotService.sendAlert(
        'Test Alert',
        'This is a test alert from the API integration manager.',
        'info',
        { testParam: 'test value', timestamp: new Date().toLocaleString() }
      );
      results.alertSent = true;
    }

    return results;
  };

  const testEmailFeatures = async () => {
    const results = {
      serviceType: null,
      notificationSent: false,
      alertSent: false,
      timestamp: new Date().toISOString(),
    };

    // Test notification
    const notificationResult = await emailService.sendNotification(
      'test@mialogistics.com',
      '🧪 Test Email Service',
      'This is a test notification from MIA Logistics Manager API integration.',
      { testParam: 'test value', timestamp: new Date().toLocaleString() }
    );
    results.serviceType = notificationResult.method;
    results.notificationSent = notificationResult.success;

    // Test alert
    const alertResult = await emailService.sendAlert(
      'test@mialogistics.com',
      'info',
      'Test Alert',
      'This is a test alert from the API integration manager.',
      { testParam: 'test value', timestamp: new Date().toLocaleString() }
    );
    results.alertSent = alertResult.success;

    return results;
  };

  const testDriveFeatures = async () => {
    const results = {
      fileStats: null,
      quotaInfo: null,
      activityLog: null,
      timestamp: new Date().toISOString(),
    };

    // Get file statistics
    results.fileStats = await googleDriveService.getFileStats();

    // Get quota information
    try {
      results.quotaInfo = await googleDriveService.getQuota();
    } catch (error) {
      results.quotaInfo = { error: error.message };
    }

    // Get activity log
    results.activityLog = await googleDriveService.getActivityLog(7);

    return results;
  };

  const testSheetsFeatures = async () => {
    const results = {
      sheetsInfo: null,
      dataValidation: null,
      reportGenerated: null,
      timestamp: new Date().toISOString(),
    };

    if (googleSheetsService.isConnected) {
      // Get sheets information
      results.sheetsInfo = {
        connected: googleSheetsService.isConnected,
        spreadsheetId: googleSheetsService.spreadsheetId,
        availableSheets: Object.keys(googleSheetsService.sheets),
      };

      // Test data validation (if we have sheets)
      const availableSheets = Object.keys(googleSheetsService.sheets);
      if (availableSheets.length > 0) {
        const testSheet = availableSheets[0];
        try {
          results.dataValidation = await googleSheetsService.validateData(testSheet, {
            Column1: { required: false, type: 'string' },
          });
        } catch (error) {
          results.dataValidation = { error: error.message };
        }
      }
    }

    return results;
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const ServiceCard = ({ serviceName, icon, title, service }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {icon}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Chip
              icon={getStatusIcon(service.status)}
              label={service.status.toUpperCase()}
              color={getStatusColor(service.status)}
              size="small"
            />
          </Box>
        </Box>

        {service.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {service.error}
          </Alert>
        )}

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              switch (serviceName) {
                case 'telegram':
                  checkTelegramService();
                  break;
                case 'email':
                  checkEmailService();
                  break;
                case 'drive':
                  checkDriveService();
                  break;
                case 'sheets':
                  checkSheetsService();
                  break;
                default:
                  // Unknown service
                  break;
              }
            }}
            disabled={loading[serviceName]}
          >
            Check
          </Button>

          <Button
            size="small"
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => handleTestService(serviceName)}
            disabled={loading[serviceName] || !service.connected}
          >
            Test
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setConfigDialog({ open: true, service: serviceName })}
          >
            Config
          </Button>
        </Box>

        {/* Service-specific info */}
        {service.connected && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Service Details:
            </Typography>
            <Box
              component="pre"
              sx={{
                fontSize: '0.75rem',
                mt: 1,
                p: 1,
                bgcolor: 'grey.100',
                borderRadius: 1,
                overflow: 'auto',
              }}
            >
              {JSON.stringify(service.config, null, 2)}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const TestResults = ({ serviceName }) => {
    const results = testResults[serviceName];
    if (!results) return null;

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Test Results</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {results.error ? (
            <Alert severity="error">{results.error}</Alert>
          ) : (
            <Box component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
              {JSON.stringify(results, null, 2)}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        API Integration Manager
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Quản lý và kiểm tra tất cả các API integration: Telegram Bot, Email Service, Google Drive,
        Google Sheets
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Telegram Bot" />
          <Tab label="Email Service" />
          <Tab label="Google Drive" />
          <Tab label="Google Sheets" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Box mb={3}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={checkAllServices}
            disabled={loading.all}
          >
            Check All Services
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <ServiceCard
              serviceName="telegram"
              icon={<TelegramIcon color="primary" />}
              title="Telegram Bot"
              service={services.telegram}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ServiceCard
              serviceName="email"
              icon={<EmailIcon color="primary" />}
              title="Email Service"
              service={services.email}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ServiceCard
              serviceName="drive"
              icon={<StorageIcon color="primary" />}
              title="Google Drive"
              service={services.drive}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ServiceCard
              serviceName="sheets"
              icon={<TableChartIcon color="primary" />}
              title="Google Sheets"
              service={services.sheets}
            />
          </Grid>
        </Grid>

        {/* Overall Status Summary */}
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Connected Services
              </Typography>
              <Typography variant="h4" color="success.main">
                {Object.values(services).filter((s) => s.connected).length}/4
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Last Check
              </Typography>
              <Typography variant="body2">{new Date().toLocaleTimeString()}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                System Health
              </Typography>
              <Typography
                variant="h6"
                color={
                  Object.values(services).every((s) => s.connected)
                    ? 'success.main'
                    : Object.values(services).some((s) => s.connected)
                      ? 'warning.main'
                      : 'error.main'
                }
              >
                {Object.values(services).every((s) => s.connected)
                  ? 'Excellent'
                  : Object.values(services).some((s) => s.connected)
                    ? 'Partial'
                    : 'Down'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ServiceCard
          serviceName="telegram"
          icon={<TelegramIcon color="primary" />}
          title="Telegram Bot Service"
          service={services.telegram}
        />
        <Box mt={2}>
          <TestResults serviceName="telegram" />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <ServiceCard
          serviceName="email"
          icon={<EmailIcon color="primary" />}
          title="Email Service"
          service={services.email}
        />
        <Box mt={2}>
          <TestResults serviceName="email" />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <ServiceCard
          serviceName="drive"
          icon={<StorageIcon color="primary" />}
          title="Google Drive Service"
          service={services.drive}
        />
        <Box mt={2}>
          <TestResults serviceName="drive" />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <ServiceCard
          serviceName="sheets"
          icon={<TableChartIcon color="primary" />}
          title="Google Sheets Service"
          service={services.sheets}
        />
        <Box mt={2}>
          <TestResults serviceName="sheets" />
        </Box>
      </TabPanel>

      {/* Configuration Dialog */}
      <Dialog
        open={configDialog.open}
        onClose={() => setConfigDialog({ open: false, service: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configure {configDialog.service?.toUpperCase()} Service</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Service configuration will be implemented based on specific requirements.
          </Typography>
          <Alert severity="info">
            Configuration options will be added here for each service including:
            <ul>
              <li>API credentials management</li>
              <li>Service-specific settings</li>
              <li>Connection parameters</li>
              <li>Notification preferences</li>
            </ul>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog({ open: false, service: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
