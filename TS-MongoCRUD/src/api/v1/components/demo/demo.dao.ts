import { demos } from "../../../../models";
import { createType } from "../../../../configs/db";

/**
 * Only do data manipulations in DB and return results
 */
export const add = async (demoInfo) => {
  const { string } = demoInfo;
  return await demos.build({
    string,
  });
};

export const get = async (demoId) => {
  return await demos.findById(demoId);
};

export const swap = async (demoId, newDemo, newCopy) => {
  return await demos.findOneAndReplace(
    { _id: new createType(demoId) },
    newDemo,
    { new: newCopy ? true : false }
  );
};

export const modify = async (demoId, data, newCopy) => {
  return await demos.findByIdAndUpdate(demoId, data, {
    new: newCopy ? true : false,
  });
};

export const clean = async (demoId) => {
  return await demos.findByIdAndDelete(demoId);
};
