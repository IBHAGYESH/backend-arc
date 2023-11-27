const path = require("path")
const winston = require('winston')
require('winston-daily-rotate-file');

const config = require('../configs/index');

// Define your severity levels. 
// With them, You can create log files, 
// see or hide levels based on the running ENV.
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// This method set the current severity based on 
// the current NODE_ENV: show all the log levels 
// if the server was run in development mode; otherwise, 
// if it was run in production, show only warn and error messages.
const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

// Define different colors for each level. 
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

// Tell winston that you want to link the colors 
// defined above to the severity levels.
winston.addColors(colors)

const fileTransport = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, `/../logs/${config.env}/triggers/logs`),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
});

// Define which transports the logger must use to print out messages. 
const transports = [
    // Allow the use the console to print the messages
    new winston.transports.Console(),
    fileTransport,
]

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
    // Add the message timestamp with the preferred format
    winston.format.timestamp(),
    // Tell Winston that the logs must be colored
    // winston.format.colorize({ all: true }),
    winston.format.json(),
    winston.format.errors({ stack: true }),
    // Define the format of the message showing the timestamp, the level and the message
    winston.format.printf(
        (data) => {
            const splat = data[Symbol.for('splat')]
            let string = `[${data.timestamp}] [${data.level}]`
            splat && splat.forEach((param) => {
                if (Array.isArray(param)) {
                    param.forEach((p) => {
                        string += ` [${p}]`
                    })
                }
                if ((!!param) && (param.constructor === Object)) {
                    Object.entries(param).forEach(([key, value]) => {
                        string += ` [${key}:${value}]`
                    })
                }
            })
            string += ` : ${data.message}`
            return string
        }
    ),
)

// Create the logger instance that has to be exported 
const logger = winston.createLogger({
    level: 'debug',
    levels,
    format,
    transports,
})

module.exports = { logger, levels, level, colors }