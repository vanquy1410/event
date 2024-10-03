import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3Client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không có file được cung cấp' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name;
    const fileType = file.type;

    const url = await uploadToS3(buffer, fileName, fileType);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Lỗi khi upload lên S3:', error);
    return NextResponse.json({ error: 'Lỗi khi upload file', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
