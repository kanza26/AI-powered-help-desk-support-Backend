const jwt = require('jsonwebtoken');

class JwtService {
  // ✅ Don't capture env vars in constructor — read them at call-time
  get accessTokenSecret() { return process.env.JWT_ACCESS_SECRET; }
  get refreshTokenSecret() { return process.env.JWT_REFRESH_SECRET; }
  get accessTokenExpiry() { return process.env.JWT_ACCESS_EXPIRY; }
  get refreshTokenExpiry() { return process.env.JWT_REFRESH_EXPIRY; }

  generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired'); // ✅ re-throw expiry so caller can refresh
      }
      return null; // ✅ return null for invalid tokens instead of throwing
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      return null; // ✅ same fix for refresh token
    }
  }

  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  getTokenExpiry(token) {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  }

  isTokenExpired(token) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;
    return Date.now() > expiry.getTime(); // ✅ strict > instead of >=
  }
}

module.exports = new JwtService();