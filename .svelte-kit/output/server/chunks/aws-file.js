import { a as S3_ENDPOINT, b as S3_ACCESS_KEY, c as S3_SECRETE_KEY, S as S3_BUCKET_NAME } from "./private.js";
import AWS from "aws-sdk";
const s3 = new AWS.S3({
  endpoint: S3_ENDPOINT,
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRETE_KEY,
  signatureVersion: "v4",
  s3ForcePathStyle: true
});
async function getFile(key) {
  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl(
      "getObject",
      {
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Expires: 3600
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
  return url;
}
export {
  getFile as g,
  s3 as s
};
