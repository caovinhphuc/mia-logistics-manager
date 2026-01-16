import { Box, Paper, Typography } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#333' }}
      >
        Cài đặt hệ thống
      </Typography>

      <Paper sx={{ p: 3, textAlign: 'center', boxShadow: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Trang cài đặt hệ thống đang được phát triển...
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Tính năng này sẽ bao gồm:
        </Typography>
        <ul style={{ textAlign: 'left', marginTop: '16px' }}>
          <li>Cài đặt tài khoản</li>
          <li>Cấu hình hệ thống</li>
          <li>Quản lý người dùng</li>
          <li>Sao lưu dữ liệu</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Settings;
