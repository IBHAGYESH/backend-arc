import express from "express";
import cors from "cors";
import compression from "compression";
import config from "./configs";
import v1Routes from "./api/v1/router";

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

    app.set("trust proxy", true);

    // for compression
    app.use(compression());

    // for parsing application/json
    app.use(express.json());

    // for parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // attaching the API v1 routes to the server
    app.use("/api/v1", v1Routes);

    // handling undefined route
    app.use("*", (req, res) => {
      res.sendStatus(404);
    });

    return app;
  } catch (error: unknown) {
    const { message } = error as Error;
    console.log(message);
  }
}
export default generateApp;
