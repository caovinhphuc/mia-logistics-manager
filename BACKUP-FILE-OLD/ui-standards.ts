/**
 * UI/UX Standards cho MIA Logistics Manager
 * Chuẩn hóa giao diện toàn dự án
 */

export const UI_STANDARDS = {
  // === SPACING SYSTEM ===
  spacing: {
    // Base spacing unit: 8px
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    xxl: '3rem', // 48px

    // Page layout spacing
    pagePadding: {
      xs: '0.5rem', // 8px
      sm: '1rem', // 16px
      md: '1.5rem', // 24px
      lg: '2rem', // 32px
    },

    // Section spacing
    sectionGap: {
      xs: '0.5rem', // 8px
      sm: '1rem', // 16px
      md: '1.5rem', // 24px
    },

    // Component spacing
    componentGap: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '0.75rem', // 12px
    },
  },

  // === TYPOGRAPHY ===
  typography: {
    // Font sizes
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      xxl: '1.5rem', // 24px
    },

    // Font weights
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },

    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  // === LAYOUT HEIGHTS ===
  heights: {
    // Card heights
    card: {
      xs: '100px',
      sm: '120px',
      md: '140px',
      lg: '160px',
    },

    // Table heights
    table: {
      minHeight: '300px',
      maxHeight: '600px',
    },

    // Header heights
    header: {
      xs: '48px',
      sm: '56px',
      md: '64px',
    },
  },

  // === COLORS ===
  colors: {
    // Status colors
    status: {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      primary: '#1976d2',
    },

    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#e9ecef',
    },

    // Text colors
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#bdbdbd',
    },
  },

  // === BORDER RADIUS ===
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  // === SHADOWS ===
  shadows: {
    light: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.15)',
    heavy: '0 8px 16px rgba(0,0,0,0.2)',
  },

  // === TRANSITIONS ===
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

// === LAYOUT COMPONENTS ===
export const LAYOUT_COMPONENTS = {
  // Page container
  pageContainer: {
    sx: {
      p: UI_STANDARDS.spacing.pagePadding,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: UI_STANDARDS.spacing.sectionGap,
      overflow: 'hidden',
    },
  },

  // Section container
  sectionContainer: {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      gap: UI_STANDARDS.spacing.componentGap,
    },
  },

  // Card container
  cardContainer: {
    sx: {
      height: UI_STANDARDS.heights.card,
      flexShrink: 0,
      mb: UI_STANDARDS.spacing.componentGap,
    },
  },

  // Table container
  tableContainer: {
    sx: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: UI_STANDARDS.heights.table.minHeight,
      overflow: 'hidden',
      position: 'relative',
    },
  },

  // Action bar
  actionBar: {
    sx: {
      display: 'flex',
      justifyContent: { xs: 'space-between', sm: 'flex-end' },
      alignItems: 'center',
      mb: UI_STANDARDS.spacing.componentGap,
      flexWrap: 'wrap',
      gap: 1,
    },
  },
};

// === RESPONSIVE BREAKPOINTS ===
export const BREAKPOINTS = {
  xs: 0, // 0px
  sm: 600, // 600px
  md: 900, // 900px
  lg: 1200, // 1200px
  xl: 1536, // 1536px
};

// === UTILITY FUNCTIONS ===
export const getResponsiveValue = (values: {
  xs?: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
}) => {
  return {
    xs: values.xs || values.sm || values.md || values.lg,
    sm: values.sm || values.md || values.lg,
    md: values.md || values.lg,
    lg: values.lg,
  };
};

export const getSpacing = (size: keyof typeof UI_STANDARDS.spacing) => {
  return UI_STANDARDS.spacing[size];
};

export const getHeight = (
  type: keyof typeof UI_STANDARDS.heights,
  size?: keyof typeof UI_STANDARDS.heights.card
) => {
  if (type === 'card' && size) {
    return UI_STANDARDS.heights.card[size];
  }
  return UI_STANDARDS.heights[type];
};
