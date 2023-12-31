#!/usr/bin/env node
import fs from "fs";

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

/**
 * Module dependencies.
 */

import app from "./src/app";
const expressApp = app();

import http from "http";
import "./src/models/db";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || 5000);

/**
 * Create HTTP server.
 */

const server = http.createServer(expressApp);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
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
  console.log(
    `server Listening on port: ${typeof addr === "string" ? addr : addr!.port}`
  );
}
