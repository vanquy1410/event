import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { userName, phoneNumber, address, email, message } = await req.json();

      // Kết nối đến database
      const client = await connectToDatabase();
      const db = client.db();

      // Lưu thông tin liên hệ vào collection 'contacts'
      await db.collection('contacts').insertOne({
        userName,
        phoneNumber,
        address,
        email,
        message,
        createdAt: new Date()
      });

      return NextResponse.json({ message: 'Thông tin liên hệ đã được gửi thành công' }, { status: 200 });
    } catch (error) {
      console.error('Lỗi khi lưu thông tin liên hệ:', error);
      return NextResponse.json({ message: 'Đã xảy ra lỗi khi gửi thông tin liên hệ' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Phương thức không được hỗ trợ' }, { status: 405 });
  }
}
