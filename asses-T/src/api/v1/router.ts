import express from "express";
const router = express.Router();
import type { Request, Response, NextFunction } from "express";

/**
 * Add global route middleware
 * router.use((req, res, next) => next())
 */
router.use((req: Request, res: Response, next: NextFunction) => {
  // console.log("global route middleware");
  next();
});

// server ping
router.use("/ping", (req, res) => {
  res.status(200).json({
    message: "Server online!",
    version: 1.0,
  });
});

import demoRoute from "./components/image-upload/image-upload.route";
demoRoute(router, "events");

export default router;
