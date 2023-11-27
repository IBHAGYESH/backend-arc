const AppError = require("../Services/errors/AppError");
const { logger } = require("../configs/winston");

const apiErrorHandler = (error, req, res, next) => {
	try {
		// console.log(error, ":::ERROR");
		logger.error(error.message ? error.message : "Internal Server Error!");

		// handling errors coming from libraries
		if (error.name === "ValidationError") {
			return res.status(400).send({
				type: "ValidationError",
				details: error.details,
			});
		}

		// if file is larger than config size limit
		if (error.name === "MulterError") {
			return res.status(500).send({
				status: 500,
				message: error.message
			});
		}

		// handling AppError
		if (error instanceof AppError) {
			return res.status(error.statusCode).json(error.message);
		}

		// handling default Error
		return res.status(500).json({
			code: 500,
			message: "Internal Server Error!",
		});
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = apiErrorHandler;
