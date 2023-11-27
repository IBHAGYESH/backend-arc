import mongoose from "mongoose";
import config from "./server";
import events from "events";

const dbEventEmitter = new events.EventEmitter();

mongoose.connect(config.DB_URL);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open to " + config.DB_URL);
  dbEventEmitter.emit("DB", true);
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
  dbEventEmitter.emit("DB", false);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
  dbEventEmitter.emit("DB", false);
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function () {
  mongoose.connection.close(true).then(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

global.dbEventEmitter = dbEventEmitter;

export default mongoose;
export const refType = mongoose.Schema.Types.ObjectId;
export const createType = mongoose.Types.ObjectId;
