const crypto = require('crypto');

class TokenManager {
  static generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }

  static generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static verifyTokenExpiry(tokenCreatedAt, expiryHours = 24) {
    const now = Date.now();
    const tokenAge = now - tokenCreatedAt;
    const expiryMs = expiryHours * 60 * 60 * 1000;
    return tokenAge < expiryMs;
  }
}

module.exports = TokenManager;