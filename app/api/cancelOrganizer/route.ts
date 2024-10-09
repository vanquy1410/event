import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function PUT(request: Request) {
  try {
    const { id } = await request.json();

    await connectToDatabase();

    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedOrganizer) {
      return NextResponse.json({ error: 'Không tìm thấy ban tổ chức' }, { status: 404 });
    }

    return NextResponse.json(updatedOrganizer);
  } catch (error) {
    console.error('Lỗi khi hủy đăng ký:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
