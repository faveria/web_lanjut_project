import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => Promise<void>;
  theme: any;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Dark theme colors
const darkTheme = {
  colors: {
    primary: '#00A884',      
    primaryDark: '#15803d',  
    secondary: '#6366f1',    
    accent: '#06b6d4',       
    background: '#111827',   // Dark background
    surface: '#1f2937',      // Dark surface
    text: {
      primary: '#f9fafb',    // Light text
      secondary: '#9ca3af',  // Light gray text
      disabled: '#6b7280',   // Disabled text
    },
    status: {
      success: '#10b981',    
      warning: '#f59e0b',    
      error: '#ef4444',      
      info: '#3b82f6',       
    },
    border: '#374151',       // Darker border
    shadow: 'rgba(0, 0, 0, 0.3)',
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

// Light theme (default)
const lightTheme = {
  colors: {
    primary: '#00A884',      
    primaryDark: '#15803d',  
    secondary: '#6366f1',    
    accent: '#06b6d4',       
    background: '#f9fafb',   
    surface: '#ffffff',      
    text: {
      primary: '#111827',    
      secondary: '#6b7280',  
      disabled: '#9ca3af',   
    },
    status: {
      success: '#10b981',    
      warning: '#f59e0b',    
      error: '#ef4444',      
      info: '#3b82f6',       
    },
    border: '#e5e7eb',       
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

export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('app_theme');
        if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    try {
      await SecureStore.setItemAsync('app_theme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};