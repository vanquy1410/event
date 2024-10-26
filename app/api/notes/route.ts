import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const notes = await db.collection('notes').findOne({});
    return NextResponse.json({ notes: notes?.content || '' });
  } catch (error) {
    console.error('Lỗi khi lấy ghi chú:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();
    const { db } = await connectToDatabase();
    await db.collection('notes').updateOne({}, { $set: { content: notes } }, { upsert: true });
    return NextResponse.json({ message: 'Ghi chú đã được lưu' });
  } catch (error) {
    console.error('Lỗi khi lưu ghi chú:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

