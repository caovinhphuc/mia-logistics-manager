import {
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Error as ErrorIcon,
  Google as GoogleIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Visibility,
  VisibilityOff,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { logService } from '../../services/logService';

// Enhanced validation schema
const validationSchema = {
  email: (value) => {
    if (!value) return 'Email là bắt buộc';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không hợp lệ';
    return null;
  },
  password: (value) => {
    if (!value) return 'Mật khẩu là bắt buộc';
    if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return null;
  },
};

// Enhanced security features
const securityFeatures = [
  {
    title: 'Bảo mật cao',
    description: 'Mã hóa dữ liệu với tiêu chuẩn quốc tế',
    icon: <SecurityIcon />,
  },
  {
    title: 'Hiệu suất tốt',
    description: 'Tốc độ xử lý nhanh và ổn định',
    icon: <SpeedIcon />,
  },
  {
    title: 'Đáng tin cậy',
    description: 'Hệ thống đã được kiểm chứng',
    icon: <CheckCircleIcon />,
  },
];

const Login = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const { login, isAuthenticated, googleAuthService } = useAuth();

  // Redirect if already authenticated - use ref to prevent infinite loops
  const hasRedirectedRef = useRef(false);
  useEffect(() => {
    if (isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      navigate('/dashboard', { replace: true });
    }
    // Reset ref when not authenticated (for logout case)
    if (!isAuthenticated) {
      hasRedirectedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // navigate is stable from useNavigate hook, don't include in deps
  const theme = useTheme();

  // Enhanced validation
  const validateForm = useCallback((values) => {
    const newErrors = {};

    // Email validation
    const emailError = validationSchema.email(values.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validationSchema.password(values.password);
    if (passwordError) newErrors.password = passwordError;

    return newErrors;
  }, []);

  // Enhanced form handling
  const handleChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate field on blur
      const fieldErrors = validateForm({ [field]: formData[field] });
      if (fieldErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
      }
    },
    [formData, validateForm]
  );

  // Enhanced login handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if account is locked
    if (isLocked && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
      showError(`Tài khoản bị khóa trong ${remainingTime} giây`);
      return;
    }

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result && result.success) {
        showSuccess('Đăng nhập thành công!');
        setLoginAttempts(0);
        setIsLocked(false);

        logService.info('Login', 'User logged in successfully', {
          email: formData.email,
          rememberMe: formData.rememberMe,
        });

        // Navigate to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Small delay to show success message
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTime(Date.now() + 300000); // 5 minutes
          logService.warn('Login', 'Account locked due to repeated failures', {
            attempts: newAttempts,
            email: formData.email,
          });
          showWarning('Tài khoản bị khóa 5 phút do đăng nhập sai nhiều lần');
        } else {
          showError((result && result.error) || 'Đăng nhập thất bại');
        }
      }
    } catch (error) {
      logService.error('Login', 'Login error', error);
      showError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      if (!googleAuthService) {
        throw new Error('Google Auth Service not available');
      }

      // Initialize Google OAuth
      await googleAuthService.initialize();

      // Sign in with Google
      const googleUser = await googleAuthService.loginWithGoogle();

      // Login with Google token
      const result = await login({
        googleToken: googleUser.id,
        email: googleUser.email,
      });

      if (result && result.success) {
        showSuccess('Đăng nhập Google thành công!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        showError('Đăng nhập Google thất bại');
      }
    } catch (error) {
      logService.error('Login', 'Google login error', error);
      const message = error instanceof Error ? error.message : 'Không xác định';
      showError('Đăng nhập Google thất bại: ' + message);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced forgot password
  const handleForgotPassword = async () => {
    // Show dialog for email input
    const email = prompt('Nhập email của bạn để đặt lại mật khẩu:');
    if (!email) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3100'}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (result.success) {
        showSuccess('Email đặt lại mật khẩu đã được gửi!');
      } else {
        showError(result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      logService.error('Login', 'Forgot password error', error);
      showError('Có lỗi xảy ra khi gửi email');
    }
  };

  // Lockout timer effect
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setIsLocked(false);
          setLockoutTime(0);
          setLoginAttempts(0);
          showSuccess('Tài khoản đã được mở khóa');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime, showSuccess]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Chào mừng trở lại!
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Đăng nhập để tiếp tục
          </Typography>
        </motion.div>

        {/* Login form */}
        <motion.div variants={itemVariants}>
          <Card sx={{ p: 3, boxShadow: theme.shadows[8] }}>
            <form onSubmit={handleSubmit}>
              {/* Email field */}
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
                disabled={isLoading || isLocked}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                    },
                  },
                }}
              />

              {/* Password field */}
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                margin="normal"
                disabled={isLoading || isLocked}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={isLoading || isLocked}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: `0 0 0 2px ${theme?.palette?.primary?.main || '#1976d2'}20`,
                    },
                  },
                }}
              />

              {/* Remember me checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={(e) => handleChange('rememberMe', e.target.checked)}
                    name="rememberMe"
                    color="primary"
                    disabled={isLoading || isLocked}
                  />
                }
                label="Ghi nhớ đăng nhập"
                sx={{ mt: 1, mb: 2 }}
              />

              {/* Login button */}
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={isLoading || isLocked}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground,
                  },
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <Typography variant="body2">Đang đăng nhập...</Typography>
                  </Box>
                ) : isLocked ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon />
                    <Typography variant="body2">Tài khoản bị khóa</Typography>
                  </Box>
                ) : (
                  'Đăng nhập'
                )}
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  hoặc
                </Typography>
              </Divider>

              {/* Google login button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={isLoading || isLocked}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderColor: theme.palette.grey[300],
                  color: theme.palette.text.primary,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main + '10',
                  },
                }}
              >
                Đăng nhập với Google
              </Button>

              {/* Forgot password */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleForgotPassword}
                  disabled={isLoading || isLocked}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </Box>
            </form>
          </Card>
        </motion.div>

        {/* Security features */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mt: 3, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Tính năng bảo mật
              </Typography>
              <Grid container spacing={2}>
                {securityFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 1,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          mb: 1,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login attempts warning */}
        {loginAttempts > 0 && !isLocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Alert severity="warning" sx={{ mt: 2 }} icon={<WarningIcon />}>
              <Typography variant="body2">
                Bạn đã đăng nhập sai {loginAttempts}/3 lần.
                {loginAttempts >= 2 && ' Tài khoản sẽ bị khóa sau lần đăng nhập sai tiếp theo.'}
              </Typography>
            </Alert>
          </motion.div>
        )}

        {/* Lockout warning */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Alert severity="error" sx={{ mt: 2 }} icon={<ErrorIcon />}>
              <Typography variant="body2">
                Tài khoản bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 5 phút.
              </Typography>
            </Alert>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default Login;
