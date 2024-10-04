import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/actions/upload.action';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;

    if (!file) {
      return NextResponse.json({ error: 'Không có file được cung cấp' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name;

    const result = await uploadFileToS3(Buffer.from(buffer), fileName, file.type);

    return NextResponse.json({
      message: 'Upload thành công',
      s3Data: result.s3Data,
      fileUrl: result.fileUrl
    });
  } catch (error) {
    console.error('Lỗi khi upload lên S3:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi xử lý file', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}