import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';
import { auth } from '@clerk/nextjs';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;
    const { status } = await request.json();

    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      id,
      { status },
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
    console.error('Lỗi khi cập nhật trạng thái:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật trạng thái' },
      { status: 500 }
    );
  }
}
