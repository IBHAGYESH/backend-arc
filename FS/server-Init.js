const fs = require("../utils/fs");
const path = require("path");

async function generateDirectories() {
	try {
		if (!fs.existsSync(path.resolve(__dirname, "../uploads"))) {
			fs.mkdirSync(path.resolve(__dirname, "../uploads"));
		}

		if (!fs.existsSync(path.resolve(__dirname, "../uploads/temp"))) {
			fs.mkdirSync(path.resolve(__dirname, "../uploads/temp"));
		}

		if (!fs.existsSync(path.resolve(__dirname, "../uploads/thumbnail"))) {
			fs.mkdirSync(path.resolve(__dirname, "../uploads/thumbnail"));
		}
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = { generateDirectories };
