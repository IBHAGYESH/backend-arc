import { add } from "./image-upload.dao";

/**
 * Only handle provided x data and return y data | Use dao to get data from DB
 */

export const create = async (event) => {
  try {
    return await add(event);
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};
