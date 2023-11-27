/**
 * Server config
 */

import dotenv from "dotenv";
dotenv.config();

export default {
  // server configuration
  NODE_ENV: process.env.NODE_ENV || "development",

  // database configuration
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/events",

  // cors
  WHITELIST: process.env.WHITELIST!.split(",") || ["*"],

  // Supported image types
  SUPPORTED_IMAGE_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/gif",
  ],
};
