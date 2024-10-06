import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const eventData = await request.json();
    const newEvent = await Organizer.create({
      ...eventData,
      status: 'pending'
    });
    return NextResponse.json(newEvent, { status: 200 });
  } catch (error) {
    console.error('Lỗi trong API route:', error);
    return NextResponse.json(
      { 
        error: 'Lỗi khi tạo sự kiện', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
