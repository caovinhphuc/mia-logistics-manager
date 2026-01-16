import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';
import sessionManager from '../../services/sessionManager';

/**
 * Session Timeout Warning Dialog
 * Hiển thị cảnh báo khi session sắp hết hạn
 */
const SessionTimeoutWarning = () => {
  const [open, setOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [canExtend, setCanExtend] = useState(false);

  useEffect(() => {
    const handleSessionEvent = (event, data) => {
      switch (event) {
        case 'show_warning':
          setOpen(true);
          setRemainingTime(data.remaining);
          setCanExtend(sessionManager.canExtendSession());
          break;

        case 'session_tick':
          if (open) {
            setRemainingTime(data.remaining);
            setCanExtend(sessionManager.canExtendSession());
          }
          break;

        case 'session_expired':
        case 'session_cleared':
          setOpen(false);
          break;

        default:
          break;
      }
    };

    const unsubscribe = sessionManager.subscribe(handleSessionEvent);
    return unsubscribe;
  }, [open]);

  const handleExtendSession = () => {
    sessionManager.extendSession();
    setOpen(false);
  };

  const handleLogout = () => {
    sessionManager.clearSession();
    setOpen(false);
    window.location.href = '/login';
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (remainingTime / (5 * 60 * 1000)) * 100; // 5 minutes warning period

  if (!open) return null;

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.8,
            },
          },
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <TimerIcon color="warning" />
          <Typography variant="h6">Phiên đăng nhập sắp hết hạn</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Phiên đăng nhập của bạn sẽ hết hạn trong <strong>{formatTime(remainingTime)}</strong>.
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Thời gian còn lại
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress < 20 ? 'error' : 'warning'}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="h4" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
            {formatTime(remainingTime)}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {canExtend
            ? 'Bạn có thể gia hạn phiên đăng nhập để tiếp tục làm việc.'
            : 'Hãy lưu công việc của bạn trước khi phiên đăng nhập hết hạn.'}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleLogout} variant="outlined" color="inherit">
          Đăng xuất
        </Button>
        {canExtend && (
          <Button onClick={handleExtendSession} variant="contained" color="primary" autoFocus>
            Gia hạn phiên đăng nhập
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutWarning;
