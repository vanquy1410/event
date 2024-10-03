import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

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
    const body = await request.json();
    await connectToDatabase();
    const newEvent = await Organizer.create({
      ...body,
      status: 'Chờ duyệt'
    });
    return NextResponse.json(newEvent);
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
