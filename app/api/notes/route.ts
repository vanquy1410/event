import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    const notes = await mongoose.connection.db.collection('notes').find({}).toArray();
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Lỗi khi lấy ghi chú:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { note } = await request.json();
    await connectToDatabase();
    
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    
    const result = await mongoose.connection.db.collection('notes').insertOne(note);
    
    return NextResponse.json({ message: 'Ghi chú đã được lưu', noteId: result.insertedId });
  } catch (error) {
    console.error('Lỗi chi tiết khi lưu ghi chú:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Lỗi khi lưu ghi chú', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Lỗi không xác định khi lưu ghi chú' }, { status: 500 });
    }
  }
}
