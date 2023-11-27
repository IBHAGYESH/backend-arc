const multer = require("multer");
const fs = require("../utils/fs");
const path = require("path");
const config = require("../configs");
const AppError = require("../Services/errors/AppError");
const mime = require("mime");
///////////////////////////////////////////////////////////////////////////////////////////////////

// dest or storage:	Where to store the files
// fileFilter:	Function to control which files are accepted
// limits:	Limits of the uploaded data
// preservePath:	Keep the full path of files instead of just the base name

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter,
//     limits: { fileSize: 1024 * 1024 },
// });

///////////////////////////////////////////////////////////////////////////////////////////////////
// storage

// DiskStorage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldName + '-' + uniqueSuffix)
//     }
// })

// MemoryStorage
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

///////////////////////////////////////////////////////////////////////////////////////////////////
// fileFilter

// function fileFilter(req, file, cb) {

//     // The function should call `cb` with a boolean
//     // to indicate if the file should be accepted

//     // To reject this file pass `false`, like so:
//     cb(null, false)

//     // To accept the file pass `true`, like so:
//     cb(null, true)

//     // You can always pass an error if something goes wrong:
//     cb(new Error('I don\'t have a clue!'))

// }

///////////////////////////////////////////////////////////////////////////////////////////////////
// limits

// fieldNameSize:	Max field name size	100 bytes
// fieldSize:	Max field value size(in bytes)	1MB
// fields:	Max number of non - file fields	Infinity
// fileSize:	For multipart forms, the max file size(in bytes)	Infinity
// files:	For multipart forms, the max number of file fields	Infinity
// parts:	For multipart forms, the max number of parts(fields + files)	Infinity
// headerPairs:	For multipart forms, the max number of header key => value pairs to parse	2000

///////////////////////////////////////////////////////////////////////////////////////////////////
// Error handling

// const multer = require('multer')
// const upload = multer().single('avatar')

// app.post('/profile', function (req, res) {
//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             // A Multer error occurred when uploading.
//         } else if (err) {
//             // An unknown error occurred when uploading.
//         }

//         // Everything went fine.
//     })
// })

///////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function multerConfig(options) {
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
		if(typeof type === 'object') {
			return ""
		}
		return type
	}
	const multerStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			if (!options || !Object.keys(options).length) {
				// dumping the file to the temp folder
				fs.mkdirParent(path.resolve(__dirname, "../uploads/temp"));
				cb(null, "./uploads/temp");
			} else {
				// when custom options passed
				cb(null, options.destination);
			}
		},
		filename: (req, file, cb) => {
			// validating the token against the actual uploaded resource metadata

			// TOKEN
			// req.filename -> node -> auth (encoded)
			// req.mime_type -> node -> auth
			// req.platform -> node -> auth
			// req.fileHash -> node -> hash

			// multer
			// req.tempFilePath -> node -> multer
			// req.fileExt -> node -> multer
			// req.fileMimetype -> node -> multer
			// req.fileType -> node -> multer
			// req.originalname -> node -> multer

			const ext = getFileExt(file);
			// console.log(
			// 	req.filename,
			// 	"::",
			// 	file.originalname,
			// 	"::",
			// 	req.mime_type,
			// 	"::",
			// 	getFileMime(file)
			// );

			if (
				req.filename !== file.originalname ||
				req.mime_type !== getFileMime(file)
			) {
				cb(new AppError(401, "Invalid token."), null);
			}

			// attaching hash to the filename
			req.tempFilePath = path.resolve(
				__dirname,
				`../uploads/temp/${req.fileHash}.${ext}`
			);
			req.fileExt = ext;
			req.fileMimetype = getFileMime(file);
			cb(null, `${req.fileHash}.${ext}`); // save file in temp folder
		},
	});

	const multerFilter = (req, file, cb) => {
		if (
			config.supportedImageFileTypes.some((type) =>
				getFileMime(file).includes(type)
			)
		) {
			req.fileType = "image";
			cb(null, true);
		} else if (
			config.supportedOtherFileTypes.some((type) =>
				getFileMime(file).includes(type)
			)
		) {
			req.fileType = "other";
			cb(null, true);
		} else if (
			config.supportedVideoFileTypes.some((type) =>
				getFileMime(file).includes(type)
			)
		) {
			req.fileType = "other";
			req.isVideo = true;
			cb(null, true);
		} else {
			cb(
				new AppError(200, { message: "File Type Not Supported!!", code: 200 }),
				false
			);
		}
	};

	const multerConfig = {
		storage: multerStorage,
		fileFilter: multerFilter,
		limits: { fileSize: 1024 * 1024 * config.allowedMaxFileUploadSize },
	};
	return (upload = multer(multerConfig));
};
