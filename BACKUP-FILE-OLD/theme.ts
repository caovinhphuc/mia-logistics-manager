import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Màu xanh dương chính của MIA
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f57c00', // Màu cam cho accents
      light: '#ffb74d',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    // Thêm màu sắc cho status
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    // Thêm màu sắc cho UX/UI
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
    // Thêm màu sắc cho trạng thái đặc biệt (sử dụng custom palette)
    // pending, processing, completed, cancelled sẽ được định nghĩa trong custom theme
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    // Định nghĩa typography đồng nhất
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  components: {
    // Button styles đồng nhất
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:focus': {
            outline: '2px solid',
            outlineOffset: '2px',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8rem',
          borderRadius: 6,
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
          borderRadius: 10,
        },
        // Button variants cho UX/UI
        containedPrimary: {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          },
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1b5e20 0%, #0d4f14 100%)',
          },
        },
        containedWarning: {
          background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
          },
        },
        containedError: {
          background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
          },
        },
      },
    },
    // Chip styles đồng nhất
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          fontWeight: 600,
          minWidth: '80px',
          height: '24px',
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          backgroundColor: 'white',
        },
        filled: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
        sizeSmall: {
          fontSize: '0.7rem',
          height: '20px',
          minWidth: '70px',
          borderRadius: '10px',
        },
        sizeMedium: {
          fontSize: '0.8rem',
          height: '28px',
          minWidth: '90px',
          borderRadius: '14px',
        },
        // Chip variants cho UX/UI
        colorPrimary: {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          },
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #1b5e20 0%, #0d4f14 100%)',
          },
        },
        colorWarning: {
          background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
          },
        },
        colorError: {
          background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
          },
        },
      },
    },
    // Paper styles đồng nhất
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        },
        elevation4: {
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        },
        elevation5: {
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
        },
      },
    },
    // Card styles đồng nhất
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
        // Card variants cho UX/UI
        // elevation variants được xử lý tự động bởi Material-UI
      },
    },
    // Table styles đồng nhất - Compact & Consistent
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.6rem',
            color: '#495057',
            borderBottom: '1px solid #dee2e6',
            textTransform: 'none',
            letterSpacing: 0,
            padding: '6px 4px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.65rem',
          padding: '6px 4px',
          borderBottom: '1px solid #e9ecef',
          transition: 'background-color 0.2s ease-in-out',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        },
        body: {
          fontSize: '0.65rem',
          // Special styling for address cells
          '&.address-cell': {
            whiteSpace: 'normal',
            textOverflow: 'unset',
            overflow: 'visible',
            lineHeight: 1.2,
          },
        },
        head: {
          fontWeight: 600,
          color: '#495057',
          backgroundColor: '#f8f9fa',
        },
        // Cell variants cho UX/UI
        // size variants được xử lý tự động bởi Material-UI
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#f8f9fa',
          },
          '&:nth-of-type(even)': {
            backgroundColor: '#fafbfc',
          },
          '&.Mui-selected': {
            backgroundColor: '#e3f2fd',
            '&:hover': {
              backgroundColor: '#bbdefb',
            },
          },
        },
      },
    },
    // Dialog styles đồng nhất
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        },
        paperFullScreen: {
          borderRadius: 0,
        },
        paperScrollPaper: {
          maxHeight: 'calc(100% - 64px)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px 24px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e9ecef',
          '& .MuiTypography-root': {
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#212121',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:first-of-type': {
            paddingTop: '24px',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px 24px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e9ecef',
          gap: '8px',
        },
      },
    },
    // TextField styles đồng nhất
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#1976d2',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
            borderWidth: '2px',
          },
        },
        notchedOutline: {
          borderColor: '#e0e0e0',
          transition: 'border-color 0.2s ease-in-out',
        },
      },
    },
    // IconButton styles đồng nhất
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          '&:focus': {
            outline: '2px solid',
            outlineOffset: '2px',
          },
        },
        sizeSmall: {
          padding: 6,
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem',
          },
        },
        sizeMedium: {
          padding: 8,
          '& .MuiSvgIcon-root': {
            fontSize: '1.25rem',
          },
        },
        sizeLarge: {
          padding: 12,
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
          },
        },
        // IconButton variants cho UX/UI
        colorPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
        colorSecondary: {
          '&:hover': {
            backgroundColor: 'rgba(245, 124, 0, 0.08)',
          },
        },
        colorSuccess: {
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
          },
        },
        colorWarning: {
          '&:hover': {
            backgroundColor: 'rgba(237, 108, 2, 0.08)',
          },
        },
        colorError: {
          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.08)',
          },
        },
      },
    },
    // Alert styles đồng nhất
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '& .MuiAlert-icon': {
            fontSize: '1.25rem',
          },
          '& .MuiAlert-message': {
            fontSize: '0.875rem',
            fontWeight: 500,
          },
        },
        standardSuccess: {
          backgroundColor: '#e8f5e8',
          color: '#1b5e20',
          border: '1px solid #4caf50',
        },
        standardInfo: {
          backgroundColor: '#e3f2fd',
          color: '#0d47a1',
          border: '1px solid #2196f3',
        },
        standardWarning: {
          backgroundColor: '#fff3e0',
          color: '#e65100',
          border: '1px solid #ff9800',
        },
        standardError: {
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #f44336',
        },
      },
    },
    // Snackbar styles đồng nhất
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    // Tooltip styles đồng nhất
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#424242',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '& .MuiTooltip-arrow': {
            color: '#424242',
          },
        },
      },
    },
    // Badge styles đồng nhất
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.75rem',
          fontWeight: 600,
          minWidth: '20px',
          height: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        colorPrimary: {
          backgroundColor: '#1976d2',
        },
        colorSecondary: {
          backgroundColor: '#f57c00',
        },
        colorError: {
          backgroundColor: '#d32f2f',
        },
      },
    },
    // Avatar styles đồng nhất
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        circular: {
          borderRadius: '50%',
        },
        rounded: {
          borderRadius: 8,
        },
        square: {
          borderRadius: 4,
        },
      },
    },
    // Divider styles đồng nhất
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e0e0e0',
          margin: '16px 0',
        },
        vertical: {
          margin: '0 16px',
        },
      },
    },
    // List styles đồng nhất
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 0',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.12)',
            },
          },
        },
      },
    },
    // Menu styles đồng nhất
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          border: '1px solid #e0e0e0',
        },
      },
    },
    // Select styles đồng nhất
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
            borderWidth: '2px',
          },
        },
      },
    },
    // Checkbox styles đồng nhất
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
      },
    },
    // Radio styles đồng nhất
    MuiRadio: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
      },
    },
    // Switch styles đồng nhất
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            transition: 'all 0.2s ease-in-out',
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
          },
          '& .MuiSwitch-thumb': {
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
  },
  // Spacing và breakpoints
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  // Shape
  shape: {
    borderRadius: 8,
  },
  // Transitions
  transitions: {
    create: (
      props: string | string[],
      options?: { duration?: number; easing?: string }
    ) => {
      const duration = options?.duration || 200;
      const easing = options?.easing || 'ease-in-out';
      const propsArray = Array.isArray(props) ? props : [props];
      return `${propsArray.join(', ')} ${duration}ms ${easing}`;
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  // Z-index
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});
