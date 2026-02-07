import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

// Import constants
import { CONSTANTS } from '../../utils/constants';

// Import services
import { apiConnectionTester } from '../../services/apiConnectionTester';
import { emailService } from '../../services/emailService';
import { googleApiLoader } from '../../services/googleApiLoader';
import { googleDriveService } from '../../services/googleDriveService';
import { googleSheetsService } from '../../services/googleSheetsService';
import { telegramBotService } from '../../services/telegramBotService';

// Import test utilities
import { runDebugTest } from '../../debug/apiDebugTest';
import {
  testCreateDriveFolder,
  testCreateDriveFolderREST,
} from '../../tests/testDriveFolderCreation';

const ApiDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    constants: {},
    envVars: {},
    services: {},
    loading: false,
    lastCheck: null,
  });

  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [fullTestResults, setFullTestResults] = useState(null);
  const [folderTestResult, setFolderTestResult] = useState(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setDiagnostics((prev) => ({ ...prev, loading: true }));

    try {
      // Check constants
      const constantsCheck = {
        defined: typeof CONSTANTS !== 'undefined',
        google: {
          clientId: !!CONSTANTS?.GOOGLE?.CLIENT_ID,
          apiKey: !!CONSTANTS?.GOOGLE?.API_KEY,
          spreadsheetId: !!CONSTANTS?.GOOGLE?.SPREADSHEET_ID,
          driveFolderId: !!CONSTANTS?.GOOGLE?.DRIVE_FOLDER_ID,
          projectId: !!CONSTANTS?.GOOGLE?.PROJECT_ID,
          scopes: Array.isArray(CONSTANTS?.GOOGLE?.SCOPES) && CONSTANTS.GOOGLE.SCOPES.length > 0,
        },
      };

      // Check environment variables
      const envCheck = {
        clientId: {
          key: 'REACT_APP_GOOGLE_CLIENT_ID',
          value: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          status: !!process.env.REACT_APP_GOOGLE_CLIENT_ID,
        },
        apiKey: {
          key: 'REACT_APP_GOOGLE_API_KEY',
          value: process.env.REACT_APP_GOOGLE_API_KEY,
          status: !!process.env.REACT_APP_GOOGLE_API_KEY,
        },
        mapsApiKey: {
          key: 'REACT_APP_GOOGLE_MAPS_API_KEY',
          value: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          status: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
        spreadsheetId: {
          key: 'REACT_APP_GOOGLE_SHEET_ID',
          value: process.env.REACT_APP_GOOGLE_SHEET_ID,
          status: !!process.env.REACT_APP_GOOGLE_SHEET_ID,
        },
        driveFolderId: {
          key: 'REACT_APP_GOOGLE_DRIVE_FOLDER_ID',
          value: process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID,
          status: !!process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID,
        },
        telegramToken: {
          key: 'REACT_APP_TELEGRAM_BOT_TOKEN',
          value: process.env.REACT_APP_TELEGRAM_BOT_TOKEN,
          status: !!process.env.REACT_APP_TELEGRAM_BOT_TOKEN,
        },
        telegramChatId: {
          key: 'REACT_APP_TELEGRAM_CHAT_ID',
          value: process.env.REACT_APP_TELEGRAM_CHAT_ID,
          status: !!process.env.REACT_APP_TELEGRAM_CHAT_ID,
        },
      };

      // Check services status
      const servicesCheck = {
        googleApiLoader: {
          loaded: !!window.gapi,
          initialized: googleApiLoader.isInitialized(),
          status: 'unknown',
        },
        googleSheets: {
          connected: googleSheetsService.isConnected,
          status: 'unknown',
        },
        googleDrive: {
          connected: googleDriveService.isConnected,
          status: 'unknown',
        },
      };

      setDiagnostics({
        constants: constantsCheck,
        envVars: envCheck,
        services: servicesCheck,
        loading: false,
        lastCheck: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Diagnostics error:', error);
      setDiagnostics((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
        lastCheck: new Date().toLocaleString(),
      }));
    }
  };

  const testService = async (serviceName) => {
    setLoading((prev) => ({ ...prev, [serviceName]: true }));

    try {
      let result = { success: false, error: 'Service not implemented' };

      switch (serviceName) {
        case 'googleApiLoader':
          result = await googleApiLoader.testConnection();
          break;
        case 'googleSheets':
          result = await googleSheetsService.testConnection();
          break;
        case 'googleDrive':
          result = await googleDriveService.testConnection();
          break;
        case 'telegram':
          result = await telegramBotService.testConnection();
          break;
        case 'email':
          result = await emailService.testConnection();
          break;
        default:
          result = { success: false, error: 'Unknown service' };
      }

      setTestResults((prev) => ({
        ...prev,
        [serviceName]: {
          ...result,
          timestamp: new Date().toLocaleString(),
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [serviceName]: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleString(),
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [serviceName]: false }));
    }
  };

  const handleTestAllConnections = async () => {
    setLoading((prev) => ({ ...prev, testAll: true }));
    setFullTestResults(null);

    try {
      const results = await apiConnectionTester.testAllConnections();
      setFullTestResults({
        ...results,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setFullTestResults({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading((prev) => ({ ...prev, testAll: false }));
    }
  };

  const handleDebugTest = async () => {
    setLoading((prev) => ({ ...prev, debug: true }));

    try {
      // logger.debug('🔍 Starting debug test from UI...');
      const results = await runDebugTest();
      // logger.debug('Debug test completed:', results);

      if (results.error) {
        alert(`Debug test failed: ${results.error}`);
      } else {
        alert('Debug test completed successfully! Check console for details.');
      }
    } catch (error) {
      // console.error('Debug test error:', error);
      alert(`Debug test error: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, debug: false }));
    }
  };

  const handleTestCreateFolder = async (useREST = false) => {
    setLoading((prev) => ({ ...prev, createFolder: true }));
    setFolderTestResult(null);

    try {
      // logger.debug(`🧪 Testing folder creation${useREST ? ' (REST API)' : ' (gapi.client)'}...`);

      const result = useREST ? await testCreateDriveFolderREST() : await testCreateDriveFolder();

      setFolderTestResult(result);
      // logger.debug('Folder creation test result:', result);

      if (result.success) {
        alert(
          `✅ Folder created successfully!\n\nName: ${result.folderName}\nID: ${result.folderId}\n\nCheck console for details.`
        );
      } else {
        alert(`❌ Folder creation failed!\n\nError: ${result.error}\n\nCheck console for details.`);
      }
    } catch (error) {
      console.error('Folder creation test error:', error);
      const errorResult = {
        success: false,
        error: error.message,
        steps: [`❌ Test failed: ${error.message}`],
      };
      setFolderTestResult(errorResult);
      alert(`❌ Test error: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, createFolder: false }));
    }
  };

  const getStatusColor = (status) => {
    if (status === true) return 'success';
    if (status === false) return 'error';
    return 'warning';
  };

  const getStatusIcon = (status) => {
    if (status === true) return <CheckCircleIcon />;
    if (status === false) return <ErrorIcon />;
    return <WarningIcon />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" component="h1">
          🔧 API Diagnostics
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={runDiagnostics}
            disabled={diagnostics.loading}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={loading.testAll ? <CircularProgress size={16} /> : <PlayArrowIcon />}
            onClick={handleTestAllConnections}
            disabled={loading.testAll}
            color="primary"
          >
            {loading.testAll ? 'Testing...' : 'Test All Connections'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleDebugTest}
            disabled={loading.debug}
            sx={{ ml: 1 }}
            color="warning"
          >
            {loading.debug ? 'Debug...' : 'Debug Console'}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTestCreateFolder(false)}
            disabled={loading.createFolder}
            sx={{ ml: 1 }}
            color="success"
          >
            {loading.createFolder ? 'Creating...' : '📁 Test Create Folder'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleTestCreateFolder(true)}
            disabled={loading.createFolder}
            sx={{ ml: 1 }}
            color="info"
          >
            {loading.createFolder ? 'Creating...' : '📁 Test (REST API)'}
          </Button>
        </Box>
      </Box>

      {diagnostics.loading && <LinearProgress sx={{ mb: 2 }} />}

      {diagnostics.lastCheck && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Lần kiểm tra cuối: {diagnostics.lastCheck}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Constants Check */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Constants Check
              </Typography>

              <Box mb={2}>
                <Chip
                  icon={getStatusIcon(diagnostics.constants.defined)}
                  label={`CONSTANTS Defined: ${diagnostics.constants.defined ? 'YES' : 'NO'}`}
                  color={getStatusColor(diagnostics.constants.defined)}
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>

              {diagnostics.constants.google && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Google Constants:
                  </Typography>
                  {Object.entries(diagnostics.constants.google).map(([key, value]) => (
                    <Chip
                      key={key}
                      icon={getStatusIcon(value)}
                      label={`${key}: ${value ? 'SET' : 'MISSING'}`}
                      color={getStatusColor(value)}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Environment Variables */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🌍 Environment Variables
              </Typography>

              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Variable</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Value (Preview)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(diagnostics.envVars).map(([key, config]) => (
                      <TableRow key={key}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {config.key}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(config.status)}
                            label={config.status ? 'SET' : 'MISSING'}
                            color={getStatusColor(config.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {config.value ? `${config.value.substring(0, 20)}...` : 'Not set'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Services Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔌 Services Status & Testing
              </Typography>

              <Grid container spacing={2}>
                {[
                  { key: 'googleApiLoader', name: 'Google API Loader', icon: '🔑' },
                  { key: 'googleSheets', name: 'Google Sheets', icon: '📊' },
                  { key: 'googleDrive', name: 'Google Drive', icon: '💾' },
                  { key: 'telegram', name: 'Telegram Bot', icon: '💬' },
                  { key: 'email', name: 'Email Service', icon: '📧' },
                ].map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service.key}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {service.icon} {service.name}
                      </Typography>

                      {diagnostics.services[service.key] && (
                        <Box mb={2}>
                          <Chip
                            label={`Connected: ${diagnostics.services[service.key].connected ? 'YES' : 'NO'}`}
                            color={getStatusColor(diagnostics.services[service.key].connected)}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      )}

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={
                          loading[service.key] ? <CircularProgress size={16} /> : <PlayArrowIcon />
                        }
                        onClick={() => testService(service.key)}
                        disabled={loading[service.key]}
                        fullWidth
                      >
                        Test Connection
                      </Button>

                      {testResults[service.key] && (
                        <Box mt={2}>
                          <Alert
                            severity={testResults[service.key].success ? 'success' : 'error'}
                            sx={{ textAlign: 'left', fontSize: '0.75rem' }}
                          >
                            <strong>
                              {testResults[service.key].success ? 'Success' : 'Error'}:
                            </strong>
                            <br />
                            {testResults[service.key].error || 'Connection successful'}
                            <br />
                            <small>{testResults[service.key].timestamp}</small>
                          </Alert>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Folder Creation Test Results */}
        {folderTestResult && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📁 Google Drive Folder Creation Test
                </Typography>

                {folderTestResult.success ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    ✅ Folder created successfully!
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    ❌ Folder creation failed: {folderTestResult.error}
                  </Alert>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Test Steps:
                  </Typography>
                  {folderTestResult.steps &&
                    folderTestResult.steps.map((step, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{ ml: 2, fontFamily: 'monospace', fontSize: '0.85rem' }}
                      >
                        {step}
                      </Typography>
                    ))}
                </Box>

                {folderTestResult.success && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Folder Details:
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Name:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {folderTestResult.folderName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Folder ID:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                          >
                            {folderTestResult.folderId}
                          </Typography>
                        </Grid>
                        {folderTestResult.webViewLink && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              View Link:
                            </Typography>
                            <Typography variant="body2">
                              <a
                                href={folderTestResult.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#1976d2' }}
                              >
                                {folderTestResult.webViewLink}
                              </a>
                            </Typography>
                          </Grid>
                        )}
                        {folderTestResult.createdTime && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              Created:
                            </Typography>
                            <Typography variant="body2">
                              {new Date(folderTestResult.createdTime).toLocaleString()}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Box>
                )}

                {folderTestResult.errorDetails && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Error Details:
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: '#fff3f3' }}>
                      <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
                        {JSON.stringify(folderTestResult.errorDetails, null, 2)}
                      </pre>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Full Test Results */}
        {fullTestResults && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🧪 Complete Connection Test Results
                </Typography>

                {fullTestResults.error ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Test failed: {fullTestResults.error}
                  </Alert>
                ) : (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Test completed at: {new Date(fullTestResults.timestamp).toLocaleString()}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {Object.entries(fullTestResults).map(([service, result]) => {
                        if (service === 'timestamp') return null;

                        return (
                          <Grid item xs={12} sm={6} md={4} key={service}>
                            <Paper sx={{ p: 2 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                {getStatusIcon(result.success)}
                                <Typography variant="subtitle2">
                                  {service
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </Typography>
                              </Box>

                              <Chip
                                label={result.success ? 'PASS' : 'FAIL'}
                                color={result.success ? 'success' : 'error'}
                                size="small"
                                sx={{ mt: 1 }}
                              />

                              {result.error && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  sx={{ mt: 1, fontSize: '0.75rem' }}
                                >
                                  {result.error}
                                </Typography>
                              )}

                              {result.errors && result.errors.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  {result.errors.map((error, index) => (
                                    <Typography
                                      key={index}
                                      variant="body2"
                                      color="error"
                                      sx={{ fontSize: '0.75rem' }}
                                    >
                                      • {error}
                                    </Typography>
                                  ))}
                                </Box>
                              )}

                              {result.warnings && result.warnings.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  {result.warnings.map((warning, index) => (
                                    <Typography
                                      key={index}
                                      variant="body2"
                                      color="warning.main"
                                      sx={{ fontSize: '0.75rem' }}
                                    >
                                      ⚠️ {warning}
                                    </Typography>
                                  ))}
                                </Box>
                              )}
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Debug Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🐛 Debug Information
              </Typography>

              <Box
                component="pre"
                sx={{
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: 300,
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                {JSON.stringify(
                  {
                    window: {
                      gapi: !!window.gapi,
                      gapiClient: !!window.gapi?.client,
                      gapiAuth2: !!window.gapi?.auth2,
                    },
                    process: {
                      nodeEnv: process.env.NODE_ENV,
                      reactAppGoogleClientId: !!process.env.REACT_APP_GOOGLE_CLIENT_ID,
                      reactAppGoogleApiKey: !!process.env.REACT_APP_GOOGLE_API_KEY,
                    },
                    constants: {
                      defined: typeof CONSTANTS !== 'undefined',
                      google: CONSTANTS?.GOOGLE ? Object.keys(CONSTANTS.GOOGLE) : 'undefined',
                    },
                  },
                  null,
                  2
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApiDiagnostics;
