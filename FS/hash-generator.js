const crypto = require('crypto');

/**
 * @description Generates a unique random 32-char string
 * @returns {String} UUID
 */
function generateFileHash(req,res,next) {
    req.fileHash = crypto.randomBytes(16).toString('hex');
    next()
}

module.exports = { generateFileHash }