import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Notification from '@/lib/database/models/notification.model';

export async function GET() {
  try {
    await connectToDatabase();

    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Lỗi khi lấy thông báo:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
