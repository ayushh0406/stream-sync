exports.logRequest = function (req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

let rateLimitStore = {};
exports.rateLimit = function (req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  rateLimitStore[ip] = rateLimitStore[ip] || [];
  rateLimitStore[ip] = rateLimitStore[ip].filter(ts => now - ts < 60000);
  if (rateLimitStore[ip].length > 30) {
    return res.status(429).json({ detail: 'Rate limit exceeded' });
  }
  rateLimitStore[ip].push(now);
  next();
};
