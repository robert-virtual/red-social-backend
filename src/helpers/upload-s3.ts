import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
const uuid = require("uuid").v4;
import { S3 } from "aws-sdk";
export const s3 = new S3({
  apiVersion: "2006-03-01",
});
export const BUCKET_NAME = "red-social-robert";

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: "public-read",
    metadata: (_, file, cb) => {
      cb(null, {
        fieldname: file.fieldname,
      });
    },
    key: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    },
  }),
});
