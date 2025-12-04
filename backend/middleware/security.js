// Request logging for security monitoring
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, ip } = req;
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

// Input validation middleware
export const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    next();
  };
};

// File upload security
export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only images are allowed.'
    });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.'
    });
  }

  next();
};

// Prevent parameter pollution
export const preventParamPollution = (req, res, next) => {
  for (let key in req.query) {
    if (Array.isArray(req.query[key])) {
      req.query[key] = req.query[key][0];
    }
  }
  next();
};

// Check if user session is valid
export const checkSession = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Session expired or invalid'
    });
  }
};

// CSRF token validation (if using CSRF tokens)
export const csrfProtection = (req, res, next) => {
  // In production, implement CSRF token validation
  // For now, we rely on SameSite cookies
  next();
};

// IP-based access control (whitelist/blacklist)
const blacklistedIPs = new Set();

export const checkIPAccess = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (blacklistedIPs.has(ip)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  next();
};

// Add IP to blacklist
export const blacklistIP = (ip) => {
  blacklistedIPs.add(ip);
  console.log(`🚫 IP blacklisted: ${ip}`);
};

// Remove IP from blacklist
export const removeFromBlacklist = (ip) => {
  blacklistedIPs.delete(ip);
  console.log(`✅ IP removed from blacklist: ${ip}`);
};
