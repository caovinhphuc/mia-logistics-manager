import { Save, Tune } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'MIA Logistics',
    companyAddress: '',
    companyPhone: '',
    companyEmail: 'kho.1@mia.vn',
    preferences: {
      language: 'vi',
      currency: 'VND',
      dateFormat: 'DD/MM/YYYY',
      darkMode: false,
      autoSave: true,
    },
  });

  const handleSave = () => {
    // TODO: Implement save to backend/Google Sheets
    // For now, settings are only stored in component state
    // logger.debug("Saving general settings:", settings);
  };

  const handlePreferenceChange = (key) => (event) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      },
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Tune sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Cài đặt chung
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Company Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin công ty
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tên công ty"
                      value={settings.companyName}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, companyName: e.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email công ty"
                      value={settings.companyEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, companyEmail: e.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={settings.companyPhone}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, companyPhone: e.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      value={settings.companyAddress}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, companyAddress: e.target.value }))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* System Preferences */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tùy chọn hệ thống
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Ngôn ngữ</InputLabel>
                      <Select
                        value={settings.preferences.language}
                        onChange={handlePreferenceChange('language')}
                        label="Ngôn ngữ"
                      >
                        <MenuItem value="vi">Tiếng Việt</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Định dạng ngày</InputLabel>
                      <Select
                        value={settings.preferences.dateFormat}
                        onChange={handlePreferenceChange('dateFormat')}
                        label="Định dạng ngày"
                      >
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tiền tệ</InputLabel>
                      <Select
                        value={settings.preferences.currency}
                        onChange={handlePreferenceChange('currency')}
                        label="Tiền tệ"
                      >
                        <MenuItem value="VND">VNĐ</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
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
                  </Grid>
                </Grid>
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

export default GeneralSettings;
