import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Contact from '@/lib/database/models/contact.model';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { userName, phoneNumber, address, email, message } = await req.json();

      // Kết nối đến database
      await connectToDatabase();

      // Tạo một document mới trong collection 'contacts'
      const newContact = new Contact({
        userName,
        phoneNumber,
        address,
        email,
        message,
        createdAt: new Date()
      });

      // Lưu document vào database
      await newContact.save();

      return NextResponse.json({ message: 'Thông tin liên hệ đã được gửi thành công' }, { status: 200 });
    } catch (error) {
      console.error('Lỗi chi tiết:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
      return NextResponse.json({ message: 'Đã xảy ra lỗi khi gửi thông tin liên hệ', error: errorMessage }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Phương thức không được hỗ trợ' }, { status: 405 });
  }
}
