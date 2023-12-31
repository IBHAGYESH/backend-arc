import mongoose from "mongoose";
import config from "../configs";

mongoose.connect(config.DB_URL);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open to " + config.DB_URL);
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
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

export default mongoose;
