import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;
    const body = await request.json();

    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      id,
      { 
        $set: {
          ...body,
          startDateTime: new Date(body.startDateTime),
          endDateTime: new Date(body.endDateTime)
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
