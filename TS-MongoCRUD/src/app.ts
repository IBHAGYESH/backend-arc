import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressWinston from "express-winston";
import compression from "compression";
import helmet from "helmet";
import config from "./configs/server";
import v1Routes from "./api/v1/router";
import {
  apiLoggerTransports,
  apiLoggerFormat,
  errorLoggerTransports,
  errorLoggerFormat,
} from "./services/logger";

function generateApp() {
  try {
    // generate express app
    const app = express();

    // cors
    // CORS option to whitelist domains
    app.use(
      cors({
        credentials: true,
        origin: (origin, callback) => {
          if (
            !origin ||
            config.WHITELIST.indexOf(origin) !== -1 ||
            config.WHITELIST.indexOf("*") !== -1
          ) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
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

    app.set("trust proxy", true);

    // Use Helmet!
    app.use(helmet());

    // for compression
    app.use(compression());

    // for parsing application/json
    app.use(express.json());

    // for parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // for parsing cookies
    app.use(cookieParser());

    // for logging all the api requests
    app.use(
      expressWinston.logger({
        level: "info",
        requestWhitelist: ["method"],
        // responseWhitelist: [],
        // bodyWhitelist: [], // Array of body properties to log. Overrides global bodyWhitelist for this instance
        // bodyBlacklist: [], // Array of body properties to omit from logs. Overrides global bodyBlacklist for this instance
        meta: true,
        transports: apiLoggerTransports,
        format: apiLoggerFormat,
      })
    );

    // attaching the API v1 routes to the server
    app.use("/api/v1", v1Routes);

    // handling undefined route
    app.use("*", (req, res) => {
      res.sendStatus(404);
    });

    // for logging the errors of the pipeline.
    app.use(
      expressWinston.errorLogger({
        level: "error",
        // blacklistedMetaFields: ['trace', 'level', 'message', 'error'],
        transports: errorLoggerTransports,
        format: errorLoggerFormat,
      })
    );

    return app;
  } catch (error: unknown) {
    const { message } = error as Error;
    throw new Error(message);
  }
}
export default generateApp;
