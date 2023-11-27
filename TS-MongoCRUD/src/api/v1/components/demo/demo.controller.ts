import {
  create,
  createMultiple,
  fetch,
  fetchMultiple,
  replace,
  removeMultiple,
  update,
  updateMultiple,
  remove,
  replaceMultiple,
} from "./demo.service";
import type { Request, Response, NextFunction } from "express";

/**
 * Only handle request related logic | Use service to provide x data and get y data
 */
export const handleCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const demo = req.body;

    if (!demo) {
      throw new Error("demo required!");
    }

    if (demo.demos) {
      // multiple create
      const response = await createMultiple(demo.demos);
      res.status(200).json({ message: "ok", demos: response });
    } else {
      // single create
      const response = await create(demo);
      res.status(200).json({ message: "ok", demo: response });
    }
  } catch (error) {
    next(error);
  }
};

export const handleFetch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demo_id } = req.params;
    if (!demo_id) {
      throw new Error("demo id required!");
    }
    const response = await fetch(demo_id);
    if (!response) {
      return res.status(404).json({ message: "not found!" });
    }
    res.status(200).json({ message: "ok", demo: response });
  } catch (error) {
    next(error);
  }
};
export const handleFetchMultiple = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demos } = req.query;
    if (!demos) {
      throw new Error("demos arr required!");
    }
    const response = await fetchMultiple((demos as string).split(","));
    res.status(200).json({ message: "ok", demos: response });
  } catch (error) {
    next(error);
  }
};

export const handleReplace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demo_id } = req.params;
    if (!demo_id) {
      throw new Error("demo id required!");
    }
    const demo = req.body;
    if (!demo) {
      throw new Error("demo required!");
    }
    const response = await replace(demo_id, demo);
    res.status(200).json({ message: "ok", demo: response });
  } catch (error) {
    next(error);
  }
};
export const handleReplaceMultiple = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demos } = req.query;
    if (!demos) {
      throw new Error("demos arr required!");
    }
    const demo = req.body;
    if (!demo) {
      throw new Error("demo required!");
    }
    const response = await replaceMultiple((demos as string).split(","), demo);
    res.status(200).json({ message: "ok", demos: response });
  } catch (error) {
    next(error);
  }
};

export const handleUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demo_id } = req.params;
    if (!demo_id) {
      throw new Error("demo id required!");
    }
    const data = req.body;
    if (!data) {
      throw new Error("data required!");
    }
    const response = await update(demo_id, data);
    res.status(200).json({ message: "ok", demo: response });
  } catch (error) {
    next(error);
  }
};
export const handleUpdateMultiple = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demos } = req.query;
    if (!demos) {
      throw new Error("demos arr required!");
    }
    const data = req.body;
    if (!data) {
      throw new Error("data required!");
    }
    const response = await updateMultiple((demos as string).split(","), data);
    res.status(200).json({ message: "ok", demo: response });
  } catch (error) {
    next(error);
  }
};

export const handleRemove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demo_id } = req.params;
    if (!demo_id) {
      throw new Error("demo id required!");
    }
    await remove(demo_id);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    next(error);
  }
};
export const handleRemoveMultiple = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { demos } = req.query;
    if (!demos) {
      throw new Error("demos arr required!");
    }
    await removeMultiple((demos as string).split(","));
    res.status(200).json({ message: "ok" });
  } catch (error) {
    next(error);
  }
};
