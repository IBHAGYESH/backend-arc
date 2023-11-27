import { events } from "../../../../models";

/**
 * Only do data manipulations in DB and return results
 */
export const add = async (demoInfo) => {
  return await new events(demoInfo).save();
};
