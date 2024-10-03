import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

export default s3Client;

export async function uploadToS3(fileBuffer: ArrayBuffer, fileName: string, fileType: string): Promise<string> {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('S3_BUCKET_NAME is not defined in environment variables');
  }

  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `${process.env.S3_ENDPOINT}${params.Key}`;
  } catch (error) {
    console.error('Lỗi khi upload lên S3:', error);
    throw error;
  }
}
