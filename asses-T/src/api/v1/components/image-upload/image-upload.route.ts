import { handleCreate } from "./image-upload.controller";
import type { Request, Response, NextFunction, Router } from "express";
import multerConfig from "../../../../services/multer";

export default (router: Router, prefix: String) => {
  /**
   * Add image-upload route middleware
   * router.use((req, res, next) => next())
   */
  router.use((req: Request, res: Response, next: NextFunction) => {
    // image-upload route specific middleware
    next();
  });

  router.use(multerConfig().array("images"));

  // CREATE
  router.post(`/${prefix}`, handleCreate);
};
