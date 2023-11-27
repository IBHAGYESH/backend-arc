import fs from "fs";
import path from "path";

const mkdirParent = (
  dirPath: string,
  mode?: any,
  callback?: (error: any) => unknown
) => {
  //Call the standard fs.mkdir
  fs.mkdir(dirPath, mode, function (error: any) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      mkdirParent(path.dirname(dirPath), mode, callback);
      //And then the directory
      mkdirParent(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
};

export default mkdirParent;
