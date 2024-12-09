import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Organizer from '@/lib/database/models/organizer.model';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await connectToDatabase();

    const deletedOrganizer = await Organizer.findByIdAndDelete(id);

    if (!deletedOrganizer) {
      return NextResponse.json({ error: 'Không tìm thấy phiếu đăng ký' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Xóa phiếu thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa phiếu:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}