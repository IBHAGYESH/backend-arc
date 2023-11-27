const { S3Client, PutObjectCommand, GetObjectCommand, CreateBucketCommand } = require('@aws-sdk/client-s3')
const {
    getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");
const config = require("../configs")
let s3
if (config.env.includes("aws") || config.env.includes("local")) {

    s3 = new S3Client({
        region: config?.aws?.region,
        credentials: {
            accessKeyId: config?.aws?.accessKeyId,
            secretAccessKey: config?.aws?.secretAccessKey
        }
    })

} else {
    s3 = null
}

module.exports = { s3, PutObjectCommand, GetObjectCommand, CreateBucketCommand, getSignedUrl }
// exports.PutObjectCommand = PutObjectCommand
// exports.GetObjectCommand = GetObjectCommand
// exports.getSignedUrl = getSignedUrl