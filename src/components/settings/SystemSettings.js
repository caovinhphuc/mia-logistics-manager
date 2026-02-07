import { Build, Computer, Memory, Save, Update } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  LinearProgress,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      maxConcurrentUsers: 100,
      sessionCleanupInterval: 60,
    },
    maintenance: {
      maintenanceMode: false,
      autoBackup: true,
      backupFrequency: 'daily',
      maxLogSize: 100,
    },
    monitoring: {
      performanceMonitoring: true,
      errorTracking: true,
      healthChecks: true,
      alertsEnabled: true,
    },
  });

  const systemInfo = {
    version: '2.0.1',
    uptime: '15 ngày 6 giờ',
    memoryUsage: 68,
    storageUsage: 45,
    activeUsers: 23,
    lastBackup: '2 giờ trước',
  };

  const handleSave = () => {
    // logger.debug('Saving system settings:', settings);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Computer sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Cài đặt hệ thống
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* System Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin hệ thống
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Phiên bản
                      </Typography>
                      <Typography variant="h6">{systemInfo.version}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Thời gian hoạt động
                      </Typography>
                      <Typography variant="body1">{systemInfo.uptime}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Người dùng đang online
                      </Typography>
                      <Chip label={systemInfo.activeUsers} color="primary" size="small" />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Sử dụng bộ nhớ ({systemInfo.memoryUsage}%)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={systemInfo.memoryUsage}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Sử dụng ổ cứng ({systemInfo.storageUsage}%)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={systemInfo.storageUsage}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Sao lưu gần nhất
                      </Typography>
                      <Typography variant="body1">{systemInfo.lastBackup}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Memory sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Cài đặt hiệu suất</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Số người dùng đồng thời tối đa"
                      value={settings.performance.maxConcurrentUsers}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          performance: {
                            ...prev.performance,
                            maxConcurrentUsers: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Khoảng thời gian dọn session (phút)"
                      value={settings.performance.sessionCleanupInterval}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          performance: {
                            ...prev.performance,
                            sessionCleanupInterval: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.performance.cacheEnabled}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                performance: {
                                  ...prev.performance,
                                  cacheEnabled: e.target.checked,
                                },
                              }))
                            }
                          />
                        }
                        label="Bật cache"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.performance.compressionEnabled}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                performance: {
                                  ...prev.performance,
                                  compressionEnabled: e.target.checked,
                                },
                              }))
                            }
                          />
                        }
                        label="Nén dữ liệu"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Maintenance Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Build sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Bảo trì hệ thống</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.maintenance.maintenanceMode}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              maintenance: {
                                ...prev.maintenance,
                                maintenanceMode: e.target.checked,
                              },
                            }))
                          }
                          color="warning"
                        />
                      }
                      label="Chế độ bảo trì"
                    />
                    {settings.maintenance.maintenanceMode && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        Hệ thống đang ở chế độ bảo trì. Người dùng sẽ không thể truy cập.
                      </Alert>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.maintenance.autoBackup}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              maintenance: { ...prev.maintenance, autoBackup: e.target.checked },
                            }))
                          }
                        />
                      }
                      label="Tự động sao lưu"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Kích thước log tối đa (MB)"
                      value={settings.maintenance.maxLogSize}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          maintenance: {
                            ...prev.maintenance,
                            maxLogSize: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Monitoring Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Update sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Giám sát hệ thống</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.monitoring.performanceMonitoring}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            monitoring: {
                              ...prev.monitoring,
                              performanceMonitoring: e.target.checked,
                            },
                          }))
                        }
                      />
                    }
                    label="Giám sát hiệu suất"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.monitoring.errorTracking}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            monitoring: { ...prev.monitoring, errorTracking: e.target.checked },
                          }))
                        }
                      />
                    }
                    label="Theo dõi lỗi"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.monitoring.healthChecks}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            monitoring: { ...prev.monitoring, healthChecks: e.target.checked },
                          }))
                        }
                      />
                    }
                    label="Kiểm tra sức khỏe hệ thống"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.monitoring.alertsEnabled}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            monitoring: { ...prev.monitoring, alertsEnabled: e.target.checked },
                          }))
                        }
                      />
                    }
                    label="Cảnh báo"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined">Hủy bỏ</Button>
              <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                Lưu cài đặt
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SystemSettings;
