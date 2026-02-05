import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: '#1976d2', mb: 2 }} />

        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#1976d2' }}
        >
          404
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2 }}>
          Trang không tìm thấy
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{ px: 4, py: 1.5 }}
        >
          Về trang chủ
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
