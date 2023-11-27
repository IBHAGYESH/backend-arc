#!/usr/bin/env node

/**
 * Generate logs directory
 */

import fs from "fs";
if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}

/**
 * Module dependencies.
 */

import app from "./src/app";
const expressApp = app();

import debug from "debug";
debug("tasks-api:server");

import http from "http";
import { logger } from "./src/services/logger";
import "./src/configs/db";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || 5000);
expressApp.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(expressApp);

/**
 * Listen on provided port, on all network interfaces.
 */
global.dbEventEmitter.on("DB", (value: boolean) => {
  switch (value) {
    case true:
      server.listen(port);
      break;
    case false:
      process.exit(0);
  }
});
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr!.port;
  debug("Listening on " + bind);
  logger.info(
    `server Listening on port: ${typeof addr === "string" ? addr : addr!.port}`
  );
}
