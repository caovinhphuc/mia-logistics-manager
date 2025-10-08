import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Here you can send error to logging service
    // Example: sendErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600 }}>
              <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

              <Typography variant="h4" component="h1" gutterBottom color="error">
                Đã xảy ra lỗi
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Xin lỗi, đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                >
                  Thử lại
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                >
                  Tải lại trang
                </Button>
              </Box>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ mt: 3, textAlign: 'left' }}>
                  <Typography variant="h6" color="error">
                    Chi tiết lỗi (Development):
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      backgroundColor: 'grey.100',
                      p: 1,
                      borderRadius: 1,
                      overflow: 'auto',
                      maxHeight: 200,
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
