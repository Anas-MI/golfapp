'use strict';

module.exports = {
  env: 'production',
  db: "mongodb+srv://admin:123@cluster0-0adls.mongodb.net/test?retryWrites=true&w=majority",
  port: process.env.PORT || 4000,
  jwtIssuer: 'www.firforgolfusa.com',
  jwtExpires: 86400 // Numeric seconds expiry (86400 = '1d'). If string supplied, you provide units (e.g., "8h")
};
