import { add, get, swap, modify, clean } from "./demo.dao";

/**
 * Only handle provided x data and return y data | Use dao to get data from DB
 */

export const create = async (demo) => {
  try {
    return await add(demo);
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};
export const createMultiple = async (demosArr) => {
  try {
    const resultArr: Record<string, any>[] = [];
    for await (const demo of demosArr) {
      const result = await add(demo);
      if (result !== null) {
        resultArr.push(result);
      }
    }
    return resultArr;
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};

export const fetch = async (demoId) => {
  try {
    return await get(demoId);
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};
export const fetchMultiple = async (demosIdArr) => {
  try {
    const resultArr: Record<string, any>[] = [];
    for await (const demoId of demosIdArr) {
      const result = await get(demoId);
      if (result !== null) {
        resultArr.push(result);
      }
    }
    return resultArr;
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};

export const replace = async (demoId, newDemo) => {
  try {
    return await swap(demoId, newDemo, true);
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};
export const replaceMultiple = async (demosIdArr, newDemo) => {
  try {
    const resultArr: Record<string, any>[] = [];
    for await (const demoId of demosIdArr) {
      const result = await swap(demoId, newDemo, true);
      if (result !== null) {
        resultArr.push(result);
      }
    }
    return resultArr;
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};

export const update = async (demoId, data) => {
  try {
    return await modify(demoId, data, true);
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};
export const updateMultiple = async (demosIdArr, data) => {
  try {
    const resultArr: Record<string, any>[] = [];
    for await (const demoId of demosIdArr) {
      const result = await modify(demoId, data, true);
      if (result !== null) {
        resultArr.push(result);
      }
    }
    return resultArr;
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};

export const remove = async (demoId) => {
  try {
    return await clean(demoId);
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};
export const removeMultiple = async (demosIdArr) => {
  try {
    const resultArr: Record<string, any>[] = [];
    for await (const demoId of demosIdArr) {
      const result = await clean(demoId);
      if (result !== null) {
        resultArr.push(result);
      }
    }
    return resultArr;
  } catch (error: unknown) {
    const { message } = error as Error;
    return new Error(message);
  }
};
