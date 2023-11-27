const Redis = require('ioredis');
const config = require('../configs');
const AppError = require('../Services/errors/AppError');

const redisClient = new Redis({
    ...config.redisConfig,
    autoResubscribe: false,
    lazyConnect: false,
    maxRetriesPerRequest: 0,
    showFriendlyErrorStack: true,
    quit: (e) => {
        // log error
    },
    sentinelRetryStrategy: config.sentinelRetryStrategy ? function (error) {
        return config.sentinelRetryStrategy; // reconnect after 2 seconds
    } : null,
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') throw new AppError(500, {code:500, message: 'Connection Refused'});
        return Math.min(options.attempt * 100, 3000);
    },
    reconnectOnError: (e) => {
        const targetError = 'READONLY';
        if (e.message.includes(targetError)) {
            // Only reconnect when the error contains "READONLY"
            return true; // or `return 1;`
        }
        // log error
    },
})
    .on('connect', () => {
        // onConnectMethod
    })
    .on('ready', async () => {
        // initMethod
    })
    .on('error', (e) => {
        // cleanUpMethod
    });


module.exports = redisClient