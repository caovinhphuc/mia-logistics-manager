// Theme Variables and Utilities
import { CONSTANTS } from '../utils/constants';

// Breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Z-Index levels
export const Z_INDEX = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Spacing scale (8px base)
export const SPACING = {
  xs: 4, // 0.5 * 8px
  sm: 8, // 1 * 8px
  md: 16, // 2 * 8px
  lg: 24, // 3 * 8px
  xl: 32, // 4 * 8px
  xxl: 48, // 6 * 8px
};

// Shadow levels
export const SHADOWS = {
  0: 'none',
  1: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  2: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  3: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  4: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
};

// Typography scales
export const TYPOGRAPHY = {
  fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Border radius scale
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Transition durations
export const TRANSITIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// Common mixins
export const MIXINS = {
  // Flexbox utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },

  // Text utilities
  textEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  textClamp: (lines) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),

  // Layout utilities
  fullHeight: {
    height: '100vh',
  },
  fullWidth: {
    width: '100%',
  },
  absoluteCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },

  // Card styles
  card: {
    borderRadius: BORDER_RADIUS.md,
    boxShadow: SHADOWS[2],
    backgroundColor: '#ffffff',
  },

  // Button styles
  button: {
    borderRadius: BORDER_RADIUS.md,
    textTransform: 'none',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    transition: `all ${TRANSITIONS.normal} ${TRANSITIONS.easing.easeInOut}`,
  },

  // Input styles
  input: {
    borderRadius: BORDER_RADIUS.md,
    '& .MuiOutlinedInput-root': {
      borderRadius: BORDER_RADIUS.md,
    },
  },

  // Scrollbar styles
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: CONSTANTS.COLORS.GREY[100],
      borderRadius: BORDER_RADIUS.sm,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: CONSTANTS.COLORS.GREY[400],
      borderRadius: BORDER_RADIUS.sm,
      '&:hover': {
        backgroundColor: CONSTANTS.COLORS.GREY[500],
      },
    },
  },
};

// Responsive helpers
export const RESPONSIVE = {
  up: (breakpoint) => `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`,
  down: (breakpoint) => `@media (max-width: ${BREAKPOINTS[breakpoint] - 0.05}px)`,
  between: (start, end) =>
    `@media (min-width: ${BREAKPOINTS[start]}px) and (max-width: ${BREAKPOINTS[end] - 0.05}px)`,
  only: (breakpoint) => {
    const keys = Object.keys(BREAKPOINTS);
    const index = keys.indexOf(breakpoint);
    if (index === keys.length - 1) {
      return RESPONSIVE.up(breakpoint);
    }
    return RESPONSIVE.between(breakpoint, keys[index + 1]);
  },
};

// Animation presets
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 },
  },
};

export default {
  BREAKPOINTS,
  Z_INDEX,
  SPACING,
  SHADOWS,
  TYPOGRAPHY,
  BORDER_RADIUS,
  TRANSITIONS,
  MIXINS,
  RESPONSIVE,
  ANIMATIONS,
};
