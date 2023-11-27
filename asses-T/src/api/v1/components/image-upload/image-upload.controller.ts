import type { Request, Response } from "express";
import { create } from "./image-upload.service";

/**
 * Only handle request related logic | Use service to provide x data and get y data
 */
export const handleCreate = async (req: Request, res: Response) => {
  try {
    const event = req.body;
    const { files } = req;
    if (!event) {
      throw new Error("Event data required!");
    }
    if (!files) {
      throw new Error("Event data required!");
    }
    var filesArr = Array(files);

    // console.log(event, "+++");
    // console.log(typeof filesArr[0], "<<<<<");

    const {
      event_name,
      event_title,
      event_description,
      event_location,
      event_date,
    } = event;
    if (
      !event_name ||
      !event_title ||
      !event_description ||
      !event_location ||
      !event_date
    ) {
      throw new Error("Invalid data!");
    }

    const createEvent = { ...event };
    createEvent["images"] = [];

    for (const file in req?.files) {
      createEvent.images.push(req.files[file]);
    }

    // single create
    const response = await create(createEvent);
    return res.status(200).send("You created event successfully");
  } catch (error) {
    return res.status(500).send("internal Server Error!");
  }
};
