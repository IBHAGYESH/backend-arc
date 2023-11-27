const config = require("../configs");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("../configs/redis");
const { logger } = require("../configs/winston");
const AppError = require("../Services/errors/AppError");

const rateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "middleware",
	...config.rateLimiter,
});

const rateLimiterMiddleware = async (req, res, next) => {
	try {
		if (
			req.headers["x-test-key"] &&
			req.headers["x-test-key"] === process.env.TEST_KEY &&
			config.env === "local"
		) {
			next();
		} else {
			const ip =
				req.headers["x-forwarded-for"] ||
				req.connection.remoteAddress ||
				request.socket.remoteAddress ||
				req.ip;
			const res = await rateLimiter.consume(ip);

			if (res) {
				next();
			}
		}
	} catch (error) {
		if (redisClient.status !== "ready") {
			logger.error("Redis connection Error");
			throw new AppError(500, { code: 500, message: "Internal server error" });
		} else {
			return res.status(429).json({ code: 429, message: "Too Many Requests" });
		}
	}
};

module.exports = rateLimiterMiddleware;
