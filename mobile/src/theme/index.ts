// Theme file with improved color palette and visual elements matching the web frontend
export const theme = {
  colors: {
    primary: '#00A884',      // Green from frontend
    primaryDark: '#15803d',  // Darker green
    secondary: '#6366f1',    // Indigo
    accent: '#06b6d4',       // Cyan
    background: '#f9fafb',   // Light gray background (tailwind gray-50)
    surface: '#ffffff',      // White surface
    text: {
      primary: '#111827',    // Dark text
      secondary: '#6b7280',  // Gray text
      disabled: '#9ca3af',   // Disabled text
    },
    status: {
      success: '#10b981',    // Emerald
      warning: '#f59e0b',    // Amber
      error: '#ef4444',      // Red
      info: '#3b82f6',       // Blue
    },
    border: '#e5e7eb',       // Gray-200
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
  },
};

export type Theme = typeof theme;