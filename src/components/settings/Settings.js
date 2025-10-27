import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Save, Notifications, Security, Language, Palette } from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'MIA Logistics',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderUpdates: true,
      systemAlerts: true
    },
    preferences: {
      language: 'vi',
      currency: 'VND',
      dateFormat: 'DD/MM/YYYY',
      darkMode: false,
      autoSave: true
    }
  });

  const handleSave = () => {
    // Handle save settings
    console.log('Saving settings:', settings);
  };

  const handleNotificationChange = (key) => (event) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: event.target.checked
      }
    }));
  };

  const handlePreferenceChange = (key) => (event) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: event.target.checked || event.target.value
      }
    }));
  };

  const handleCompanyInfoChange = (key) => (event) => {
    setSettings(prev => ({
      ...prev,
      [key]: event.target.value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cài đặt hệ thống
      </Typography>

      <Grid container spacing={3}>
        {/* Company Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">Thông tin công ty</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên công ty"
                    value={settings.companyName}
                    onChange={handleCompanyInfoChange('companyName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={settings.companyPhone}
                    onChange={handleCompanyInfoChange('companyPhone')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={settings.companyEmail}
                    onChange={handleCompanyInfoChange('companyEmail')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    multiline
                    rows={2}
                    value={settings.companyAddress}
                    onChange={handleCompanyInfoChange('companyAddress')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Cài đặt thông báo</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onChange={handleNotificationChange('emailNotifications')}
                    />
                  }
                  label="Thông báo qua Email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onChange={handleNotificationChange('smsNotifications')}
                    />
                  }
                  label="Thông báo qua SMS"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onChange={handleNotificationChange('pushNotifications')}
                    />
                  }
                  label="Thông báo đẩy"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.orderUpdates}
                      onChange={handleNotificationChange('orderUpdates')}
                    />
                  }
                  label="Cập nhật đơn hàng"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onChange={handleNotificationChange('systemAlerts')}
                    />
                  }
                  label="Cảnh báo hệ thống"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Palette sx={{ mr: 1 }} />
                <Typography variant="h6">Tùy chọn cá nhân</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Ngôn ngữ"
                  value={settings.preferences.language}
                  onChange={handlePreferenceChange('language')}
                  SelectProps={{ native: true }}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Đơn vị tiền tệ"
                  value={settings.preferences.currency}
                  onChange={handlePreferenceChange('currency')}
                  SelectProps={{ native: true }}
                >
                  <option value="VND">VND (₫)</option>
                  <option value="USD">USD ($)</option>
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Định dạng ngày"
                  value={settings.preferences.dateFormat}
                  onChange={handlePreferenceChange('dateFormat')}
                  SelectProps={{ native: true }}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </TextField>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.preferences.darkMode}
                      onChange={handlePreferenceChange('darkMode')}
                    />
                  }
                  label="Chế độ tối"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.preferences.autoSave}
                      onChange={handlePreferenceChange('autoSave')}
                    />
                  }
                  label="Tự động lưu"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Google Sheets Integration */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Language sx={{ mr: 1 }} />
                <Typography variant="h6">Tích hợp Google Sheets</Typography>
              </Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Cấu hình kết nối với Google Sheets để đồng bộ dữ liệu
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sheet ID"
                    placeholder="ID của Google Sheet"
                    helperText="Lấy từ URL của Google Sheet"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Range"
                    placeholder="A1:Z1000"
                    helperText="Phạm vi dữ liệu cần đồng bộ"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" sx={{ mr: 2 }}>
                    Kiểm tra kết nối
                  </Button>
                  <Button variant="contained">
                    Đồng bộ ngay
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined">
              Hủy bỏ
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Lưu cài đặt
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;