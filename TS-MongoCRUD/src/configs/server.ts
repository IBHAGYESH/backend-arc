/**
 * Server config
 */

import dotenv from "dotenv";
dotenv.config();

export default {
  // server configuration
  NODE_ENV: process.env.NODE_ENV || "development",

  // database configuration
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/",

  // cors
  WHITELIST: process.env.WHITELIST!.split(",") || ["*"],

  // jwt token configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRY_TIME: process.env.REFRESH_TOKEN_EXPIRY_TIME,

  // google oauth email credentials
  SYSTEM_EMAIL_GMAIL: process.env.SYSTEM_EMAIL_GMAIL,
  CLIENT_ID_GMAIL: process.env.CLIENT_ID_GMAIL,
  CLIENT_SECRET_GMAIL: process.env.CLIENT_SECRET_GMAIL,
  REDIRECT_URI_GMAIL: process.env.REDIRECT_URI_GMAIL,
  REFRESH_TOKEN_GMAIL: process.env.REFRESH_TOKEN_GMAIL,
};
