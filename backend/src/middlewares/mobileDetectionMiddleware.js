/**
 * Mobile Detection Middleware
 * Blocks mobile device access to the application
 */

// Mobile user agent patterns
const MOBILE_USER_AGENTS = [
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

// Check if user agent indicates a mobile device
const isMobileUserAgent = (userAgent) => {
  return MOBILE_USER_AGENTS.some(pattern => pattern.test(userAgent));
};

// Check screen size headers (if available)
const isMobileScreenSize = (req) => {
  const screenWidth = req.get('Screen-Width');
  const screenHeight = req.get('Screen-Height');
  
  // If screen size headers are present, check them
  if (screenWidth && screenHeight) {
    return parseInt(screenWidth) <= 1024 || parseInt(screenHeight) <= 1024;
  }
  
  // If not available, we can't determine from headers alone
  return false;
};

// Check if request is likely from a mobile device
const isLikelyMobile = (req) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Check user agent first
  if (isMobileUserAgent(userAgent)) {
    return true;
  }
  
  // Check screen size if available
  if (isMobileScreenSize(req)) {
    return true;
  }
  
  // Additional checks for mobile characteristics
  const isTouchDevice = req.get('Touch-Support') === 'true';
  const deviceMemory = req.get('Device-Memory');
  
  // If touch support is declared and device memory is low, likely mobile
  if (isTouchDevice && deviceMemory && parseInt(deviceMemory) <= 4) {
    return true;
  }
  
  return false;
};

/**
 * Middleware to block mobile device access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const mobileDetectionMiddleware = (req, res, next) => {
  // Skip mobile detection for API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Skip mobile detection for static assets
  if (req.path.startsWith('/static/') || req.path.includes('.')) {
    return next();
  }
  
  // Special handling for mobile not supported page
  if (req.path === '/mobile-not-supported') {
    // Serve the mobile not supported HTML page
    return res.sendFile('mobile-not-supported.html', { root: 'src/public' });
  }
  
  // Check if request is from a mobile device
  if (isLikelyMobile(req)) {
    // Redirect to mobile not supported page
    return res.redirect('/mobile-not-supported');
  }
  
  next();
};

module.exports = mobileDetectionMiddleware;