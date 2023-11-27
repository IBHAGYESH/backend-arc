import {
  handleCreate,
  handleFetch,
  handleFetchMultiple,
  handleReplace,
  handleReplaceMultiple,
  handleUpdate,
  handleUpdateMultiple,
  handleRemove,
  handleRemoveMultiple,
} from "./demo.controller";
import type { Request, Response, NextFunction, Router } from "express";

export default (router: Router) => {
  /**
   * Add demo route middleware
   * router.use((req, res, next) => next())
   */
  router.use((req: Request, res: Response, next: NextFunction) => {
    // console.log("demo route middleware");
    next();
  });

  // CREATE
  router.post("/demos", handleCreate);

  // READ
  router.get("/demos/:demo_id", handleFetch);
  router.get("/demos", handleFetchMultiple);

  // UPDATE
  router.put("/demos/:demo_id", handleReplace);
  router.put("/demos", handleReplaceMultiple);
  router.patch("/demos/:demo_id", handleUpdate);
  router.patch("/demos", handleUpdateMultiple);

  // DELETE
  router.delete("/demos/:demo_id", handleRemove);
  router.delete("/demos", handleRemoveMultiple);
};
