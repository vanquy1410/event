import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../s3Client";
import Event from "../database/models/event.model";

export async function uploadFileToS3(file: Buffer, fileName: string) {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ACL: "public-read-write",
  };

  try {
    const s3Data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("S3 Upload Success", s3Data);

    const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${fileName}`;

    return {
      s3Data,
      fileUrl,
    };
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
}