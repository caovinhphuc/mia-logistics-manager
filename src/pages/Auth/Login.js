import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate login - replace with actual authentication
      if (email === 'admin@mia.com' && password === 'admin123') {
        await login({ email, name: 'Admin' });
        navigate('/dashboard');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f0f2f5',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                MIA Logistics
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Đăng nhập vào hệ thống quản lý
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
              </Button>
            </form>

            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Demo: admin@mia.com / admin123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
