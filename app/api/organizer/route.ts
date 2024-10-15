import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model'; // Đảm bảo đường dẫn này chính xác

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    await connectToDatabase();
    const query = status ? { status } : {};
    const events = await Organizer.find(query);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    
    // Đặt status mặc định là 'pending' hoặc 'Chờ duyệt'
    const newOrganizer = new Organizer({
      ...body,
      status: 'pending' // hoặc 'Chờ duyệt', tùy thuộc vào cách bạn định nghĩa enum
    });

    await newOrganizer.save();

    return NextResponse.json(newOrganizer, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi tạo organizer:', error);
    return NextResponse.json({ error: 'Lỗi khi tạo organizer' }, { status: 500 });
  }
}
