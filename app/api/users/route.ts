import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}, 'id username');
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách người dùng' }, { status: 500 });
  }
}

