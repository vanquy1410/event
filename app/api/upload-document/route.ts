import { NextResponse } from 'next/server';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from '@/lib/s3Client';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const organizerId = formData.get('organizerId') as string;

  if (!file) {
    return NextResponse.json({ error: 'Không có file được upload' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name;

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `documents/${organizerId}/${filename}`,
      Body: buffer,
      ACL: 'public-read-write' as const,
      ContentType: file.type,
    }));

    const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/documents/${organizerId}/${filename}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('Lỗi khi lưu file:', error);
    return NextResponse.json({ error: 'Lỗi khi lưu file' }, { status: 500 });
  }
}
