/**
 * Utility function to check if screen width is small (mobile/tablet equivalent)
 * @returns {boolean} True if the screen width is <= 768px, false otherwise
 */
export const isSmallScreen = () => {
  return window.innerWidth <= 768;
};

/**
 * Redirects users based on screen width
 */
export const handleScreenSizeRedirect = () => {
  const isSmall = isSmallScreen();
  const isOnMobilePage = window.location.pathname.includes('/mobile-not-supported');
  
  if (isSmall && !isOnMobilePage) {
    // If screen is small and user is not on mobile-not-supported page, redirect there
    window.location.href = '/mobile-not-supported';
  } else if (!isSmall && isOnMobilePage) {
    // If screen is large and user is on mobile-not-supported page, redirect to home
    window.location.href = '/';
  }
};

/**
 * Sets up a screen resize listener to handle dynamic screen size changes
 * @returns {function} Function to remove the event listener
 */
export const setupScreenSizeListener = () => {
  const handleResize = () => {
    const isSmall = isSmallScreen();
    const isOnMobilePage = window.location.pathname.includes('/mobile-not-supported');
    
    if (isSmall && !isOnMobilePage) {
      // If screen becomes small and user is not on mobile-not-supported page, redirect there
      window.location.href = '/mobile-not-supported';
    } else if (!isSmall && isOnMobilePage) {
      // If screen becomes large and user is on mobile-not-supported page, redirect to home
      window.location.href = '/';
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  // Return function to remove the event listener
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};