import path from "path";
import winston from "winston";

import "winston-daily-rotate-file";
import config from "../configs/server";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const fileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, `../../logs/${config.NODE_ENV}/triggers/logs`),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

const transports = [new winston.transports.Console(), fileTransport];

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.printf((data) => {
    const splat = data[Symbol.for("splat")];
    let string = `[${data.timestamp}] [${data.level}]`;
    splat &&
      splat.forEach((param) => {
        if (Array.isArray(param)) {
          param.forEach((p) => {
            string += ` [${p}]`;
          });
        }
        if (!!param && param.constructor === Object) {
          Object.entries(param).forEach(([key, value]) => {
            string += ` [${key}:${value}]`;
          });
        }
      });
    string += ` : ${data.message}`;
    return string;
  })
);

export const logger = winston.createLogger({
  level: "debug",
  levels,
  format,
  transports,
});

/**
 * API Logger
 */

const apiSuccessFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(
    __dirname,
    `../../logs/${config.NODE_ENV}/api/success/logs`
  ),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

// Define which transports the logger must use to print out messages.
export const apiLoggerTransports = [
  new winston.transports.Console(),
  apiSuccessFileTransport,
];

// Chose the aspect of your log customizing the log format.
export const apiLoggerFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.printf((data) => {
    return `[${data.timestamp}] [${data.level}] [${data?.meta?.req?.method}] [${data?.meta?.responseTime}ms] [${data?.meta?.res?.statusCode}] : ${data.message}`;
  })
);

/**
 * Error Logger
 */

const errorLoggerFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(
    __dirname,
    `../../logs/${config.NODE_ENV}/api/error/logs`
  ),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

// Define which transports the logger must use to print out messages.
export const errorLoggerTransports = [
  new winston.transports.Console(),
  errorLoggerFileTransport,
];

// Chose the aspect of your log customizing the log format.
export const errorLoggerFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.printf((data) => {
    return `[${data.timestamp}] [${data.level}] [${data?.meta?.req?.method}] [${
      data?.meta?.req?.url
    }] [${data?.meta?.message}] : ${JSON.stringify(data?.meta?.stack)}`;
  })
);
