import multer from "multer";
import mime from "mime";
import configs from "../configs";

const multerConfig = () => {
  function getFileExt(file) {
    // get the file extension
    const name = file.originalname.split(".");
    const ext = name[name.length - 1];
    return ext;
  }
  function getFileMime(file) {
    // get the file mime type
    const ext = getFileExt(file);
    const type = mime.getType(ext);
    if (typeof type === "object") {
      return "";
    }
    return type;
  }
  const timestamp = Date.now();
  const multerStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      // attaching hash to the filename
      cb(null, `${timestamp}_${file.originalname}`); // save file in temp folder
    },
  });

  const multerFilter = (req, file, cb) => {
    if (
      configs.SUPPORTED_IMAGE_FILE_TYPES.some((type) =>
        getFileMime(file).includes(type)
      )
    ) {
      req.fileType = "image";
      cb(null, true);
    } else {
      cb(new Error("File Type Not Supported!!"), false);
    }
  };

  const multerConfig = {
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 10 },
  };

  const upload = multer(multerConfig);
  return upload;
};

export default multerConfig;
