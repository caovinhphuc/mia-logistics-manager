import { Key, Lock, Save, Security, Shield } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90,
    },
    twoFactor: {
      enabled: false,
      method: 'email',
    },
    sessionSecurity: {
      sessionTimeout: 30,
      maxSessions: 3,
      lockAfterFailedAttempts: 5,
    },
    auditLog: {
      enabled: true,
      retentionDays: 365,
    },
  });

  const handleSave = () => {
    // console.log('Saving security settings:', settings);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Security sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Cài đặt bảo mật
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Password Policy */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Lock sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Chính sách mật khẩu</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Độ dài tối thiểu"
                      value={settings.passwordPolicy.minLength}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          passwordPolicy: {
                            ...prev.passwordPolicy,
                            minLength: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Thời hạn mật khẩu (ngày)"
                      value={settings.passwordPolicy.passwordExpiry}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          passwordPolicy: {
                            ...prev.passwordPolicy,
                            passwordExpiry: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <FormControlLabel
                        control={<Switch checked={settings.passwordPolicy.requireUppercase} />}
                        label="Yêu cầu chữ hoa"
                      />
                      <FormControlLabel
                        control={<Switch checked={settings.passwordPolicy.requireLowercase} />}
                        label="Yêu cầu chữ thường"
                      />
                      <FormControlLabel
                        control={<Switch checked={settings.passwordPolicy.requireNumbers} />}
                        label="Yêu cầu số"
                      />
                      <FormControlLabel
                        control={<Switch checked={settings.passwordPolicy.requireSpecialChars} />}
                        label="Yêu cầu ký tự đặc biệt"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Two-Factor Authentication */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Shield sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Xác thực hai yếu tố</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactor.enabled}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          twoFactor: { ...prev.twoFactor, enabled: e.target.checked },
                        }))
                      }
                    />
                  }
                  label="Bật xác thực hai yếu tố"
                />

                {!settings.twoFactor.enabled && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Khuyến nghị bật xác thực hai yếu tố để tăng cường bảo mật tài khoản.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Session Security */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Key sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">Bảo mật phiên</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Thời gian timeout (phút)"
                      value={settings.sessionSecurity.sessionTimeout}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          sessionSecurity: {
                            ...prev.sessionSecurity,
                            sessionTimeout: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Số phiên tối đa"
                      value={settings.sessionSecurity.maxSessions}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          sessionSecurity: {
                            ...prev.sessionSecurity,
                            maxSessions: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Khóa sau số lần sai"
                      value={settings.sessionSecurity.lockAfterFailedAttempts}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          sessionSecurity: {
                            ...prev.sessionSecurity,
                            lockAfterFailedAttempts: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Audit Log */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Nhật ký kiểm toán
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.auditLog.enabled}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          auditLog: { ...prev.auditLog, enabled: e.target.checked },
                        }))
                      }
                    />
                  }
                  label="Bật ghi log hoạt động"
                />

                <Box sx={{ mt: 2 }}>
                  <TextField
                    type="number"
                    label="Thời gian lưu trữ log (ngày)"
                    value={settings.auditLog.retentionDays}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        auditLog: { ...prev.auditLog, retentionDays: parseInt(e.target.value) },
                      }))
                    }
                    sx={{ width: 200 }}
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

export default SecuritySettings;
