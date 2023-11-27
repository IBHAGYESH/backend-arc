const path = require("path")
const winston = require('winston')
require('winston-daily-rotate-file');
const expressWinston = require('express-winston')
const config = require("../configs")
const isObj = require('../utils/isObj');

const { levels, level, colors } = require("../configs/winston")

// Tell winston that you want to link the colors 
// defined above to the severity levels.
winston.addColors(colors)

function apiLogger(app) {
	const apiSuccessFileTransport = new winston.transports.DailyRotateFile({
		filename: path.join(__dirname, `/../logs/${config.env}/api/success/logs`),
		datePattern: "YYYY-MM-DD-HH",
		zippedArchive: true,
		maxSize: "20m",
		maxFiles: "30d",
	});

	// Define which transports the logger must use to print out messages.
	const loggerTransports = [
		// Allow the use the console to print the messages
		new winston.transports.Console(),
		apiSuccessFileTransport,
	];

	// Chose the aspect of your log customizing the log format.
	const apiLoggerFormat = winston.format.combine(
		// Add the message timestamp with the preferred format
		winston.format.timestamp(),
		winston.format.json(),
		winston.format.errors({ stack: true }),
		// Define the format of the message showing the timestamp, the level and the message
		winston.format.printf((data) => {
			// console.log(data, "...Info");
			return `[${data.timestamp}] [${data.level}] [${
				data?.meta?.req?.method
			}] [${data?.meta?.responseTime}ms] [${data?.meta?.res?.statusCode}] : ${
				data.message
			} ${data?.meta?.req?.fileHash ? `[${data?.meta?.req?.fileHash}]` : ""}`;
		})
	);

	app.use(
		expressWinston.logger({
			level: "info",
			levels,
			requestWhitelist: ["method", "fileHash"],
			// responseWhitelist: [],
			// bodyWhitelist: [], // Array of body properties to log. Overrides global bodyWhitelist for this instance
			// bodyBlacklist: [], // Array of body properties to omit from logs. Overrides global bodyBlacklist for this instance
			meta: true,
			transports: loggerTransports,
			format: apiLoggerFormat,
		})
	);
}

function apiErrorLogger(app) {
	const apiFailedFileTransport = new winston.transports.DailyRotateFile({
		filename: path.join(__dirname, `/../logs/${config.env}/api/error/logs`),
		datePattern: "YYYY-MM-DD-HH",
		zippedArchive: true,
		maxSize: "20m",
		maxFiles: "30d",
	});

	// Define which transports the logger must use to print out messages.
	const errorTransports = [
		// Allow the use the console to print the messages
		new winston.transports.Console(),
		apiFailedFileTransport,
	];

	// Chose the aspect of your log customizing the log format.
	const apiErrorLoggerFormat = winston.format.combine(
		// Add the message timestamp with the preferred format
		winston.format.timestamp(),
		winston.format.json(),
		winston.format.errors({ stack: true }),
		// Define the format of the message showing the timestamp, the level and the message
		winston.format.printf((data) => {
			return `[${data.timestamp}] [${data.level}] [${
				data?.meta?.req?.method
			}] [${data?.meta?.req?.url}] ${
				data?.meta?.req?.fileHash ? `[${data?.meta?.req?.fileHash}]` : ""
			} [${
				isObj(data?.meta?.error.message)
					? data?.meta?.error.message.message
					: data?.meta?.error.message
			}] : 
                    ${JSON.stringify(data?.meta?.stack)}`;
		})
	);

	app.use(
		expressWinston.errorLogger({
			level: "error",
			levels,
			requestWhitelist: ["method", "url", "fileHash"],
			// blacklistedMetaFields: ['trace', 'level', 'message', 'error'],
			transports: errorTransports,
			format: apiErrorLoggerFormat,
		})
	);
}

module.exports = { apiLogger, apiErrorLogger };
