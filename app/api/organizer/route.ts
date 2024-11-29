import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const events = await Organizer.find().sort({ createdAt: -1 });
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
    
    const newOrganizer = new Organizer({
      ...body,
      status: 'pending'
    });

    await newOrganizer.save();
    return NextResponse.json(newOrganizer, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi tạo organizer:', error);
    return NextResponse.json({ error: 'Lỗi khi tạo organizer' }, { status: 500 });
  }
}
