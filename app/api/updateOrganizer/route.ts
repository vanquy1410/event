import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      id,
      { 
        $set: {
          ...updateData,
          startDateTime: new Date(updateData.startDateTime),
          endDateTime: new Date(updateData.endDateTime)
        }
      },
      { new: true }
    );

    if (!updatedOrganizer) {
      return NextResponse.json(
        { error: 'Không tìm thấy ban tổ chức' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrganizer);
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật thông tin' },
      { status: 500 }
    );
  }
}
