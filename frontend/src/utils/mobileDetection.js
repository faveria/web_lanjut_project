/**
 * Comprehensive mobile detection utility
 * Detects real device type using multiple methods to prevent bypassing
 */

// Device type patterns
const MOBILE_PATTERNS = [
  /Android/i,
  /webOS/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /BlackBerry/i,
  /IEMobile/i,
  /Opera Mini/i,
  /Mobile/i,
  /Tablet/i
];

// Touch device detection
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

// Screen size heuristics
const isSmallScreen = () => {
  // Get actual screen dimensions, not just window size
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  
  // Check if screen dimensions suggest mobile device
  const isSmallDimensions = screenWidth <= 1024 || screenHeight <= 1024;
  
  // Check device pixel ratio (mobile devices typically have higher DPI)
  const isHighDPI = window.devicePixelRatio > 1;
  
  // Combined check
  return isSmallDimensions && (isTouchDevice() || isHighDPI);
};

// User agent detection
const isMobileUserAgent = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return MOBILE_PATTERNS.some(pattern => pattern.test(userAgent));
};

// Orientation check
const isPortraitOrientation = () => {
  return window.matchMedia("(orientation: portrait)").matches;
};

// Hardware concurrency check (mobile devices typically have fewer cores)
const isLimitedHardware = () => {
  return navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
};

// Memory check (mobile devices typically have less memory)
const isLowMemory = () => {
  if (navigator.deviceMemory) {
    return navigator.deviceMemory <= 4; // GB
  }
  return false;
};

/**
 * Comprehensive mobile detection
 * Combines multiple detection methods to prevent bypassing
 * @returns {boolean} True if device is detected as mobile/tablet
 */
export const isMobileDevice = () => {
  // Primary detection methods
  const userAgentMobile = isMobileUserAgent();
  const screenMobile = isSmallScreen();
  const touchMobile = isTouchDevice();
  
  // Secondary detection methods
  const orientationMobile = isPortraitOrientation() && isSmallScreen();
  const hardwareMobile = isLimitedHardware();
  const memoryMobile = isLowMemory();
  
  // Require multiple positive detections to reduce false positives
  // But be strict with clear mobile indicators
  if (userAgentMobile) return true;
  if (screenMobile && touchMobile) return true;
  if (screenMobile && orientationMobile) return true;
  if (touchMobile && hardwareMobile) return true;
  
  // Conservative detection - if multiple secondary indicators are present
  const secondaryIndicators = [orientationMobile, hardwareMobile, memoryMobile];
  const positiveSecondary = secondaryIndicators.filter(Boolean).length;
  
  return positiveSecondary >= 2;
};

/**
 * Utility function to check if screen width is small (mobile/tablet equivalent)
 * @returns {boolean} True if the screen width is <= 768px, false otherwise
 */
export const isScreenWidthSmall = () => {
  return window.innerWidth <= 768;
};

/**
 * Redirects users based on device type
 */
export const handleScreenSizeRedirect = () => {
  // Mobile blocking is temporarily disabled
  // const isMobile = isMobileDevice();
  // const isOnMobilePage = window.location.pathname.includes('/mobile-not-supported');
  // 
  // if (isMobile && !isOnMobilePage) {
  //   // If device is mobile and user is not on mobile-not-supported page, redirect there
  //   window.location.href = '/mobile-not-supported';
  // } else if (!isMobile && isOnMobilePage) {
  //   // If device is not mobile and user is on mobile-not-supported page, redirect to home
  //   window.location.href = '/';
  // }
};

/**
 * Sets up comprehensive detection listeners
 * @returns {function} Function to remove the event listeners
 */
export const setupMobileDetectionListeners = () => {
  let timeoutId;
  
  const handleResize = () => {
    // Debounce resize events to prevent excessive checking
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handleScreenSizeRedirect();
    }, 300);
  };
  
  const handleOrientationChange = () => {
    // Immediate check on orientation change
    handleScreenSizeRedirect();
  };
  
  // Add listeners
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientationChange);
  
  // Periodic check to catch bypass attempts
  const intervalId = setInterval(() => {
    handleScreenSizeRedirect();
  }, 2000); // Check every 2 seconds
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
    clearInterval(intervalId);
  };
};