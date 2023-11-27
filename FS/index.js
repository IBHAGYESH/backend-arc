const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("../configs");
const rateLimiterRedisMiddleware = require("./rate-limiter");
const { apiLogger, apiErrorLogger } = require("./api-logger");
const methodOverride = require("method-override");
const apiErrorHandler = require("./apiErrorHandler");
const AppError = require("../Services/errors/AppError");

/**
 * @description function configure app with middleware, cors, body parser, etc
 * @param {any} app
 */
function configureMiddleware(app) {
  try {
    // cors
    // CORS option to whitelist domains
    // providing a Connect/Express middleware that can be used to enable COL̥RS with various options
    app.use(
      cors({
        credentials: true,
        origin: (origin, callback) => {
          if (
            !origin ||
            config.whitelist.indexOf(origin) !== -1 ||
            config.whitelist.indexOf("*") !== -1
          ) {
            callback(null, true);
          } else {
            callback(
              new AppError(500, { message: "Not allowed by CORS", code: 500 })
            );
          }
        },
      })
    );

    app.use((req, res, next) => {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS "
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With," +
          " Content-Type, Accept," +
          " Authorization," +
          " Access-Control-Allow-Credentials"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });

    // rate limiter configuration
    app.use(rateLimiterRedisMiddleware);

    app.set("trust proxy", true);

    app.use(methodOverride());

    // for parsing application/json
    app.use(express.json());

    // for parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // for parsing cookies
    app.use(cookieParser());

    // for logging all the api requests
    apiLogger(app);

    // attaching the routes to the server
    app.use("/", require("../routes/index"));

    // for logging the errors of the pipeline.
    apiErrorLogger(app);

    // for sending the error api response
    app.use(apiErrorHandler);

    // handling undefined route
    app.use("*", (req, res) => {
      res.status(200).json({
        message: "File Server root",
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { configureMiddleware };
