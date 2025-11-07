import { useState, useEffect } from 'react';
import { useDarkMode } from '../theme/DarkModeContext';

// Custom hook to create dynamic styles based on theme
export const useDynamicStyles = (styleCreator: (theme: any) => any) => {
  const { theme } = useDarkMode();
  const [styles, setStyles] = useState(styleCreator(theme));

  useEffect(() => {
    setStyles(styleCreator(theme));
  }, [theme]);

  return styles;
};