import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Task from '@/lib/database/models/task.model';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    await connectToDatabase();

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { message: 'Không tìm thấy công việc' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái công việc:', error);
    return NextResponse.json(
      { message: 'Lỗi khi cập nhật trạng thái công việc' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectToDatabase();

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json(
        { message: 'Không tìm thấy công việc' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Công việc đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa công việc:', error);
    return NextResponse.json(
      { message: 'Lỗi khi xóa công việc' },
      { status: 500 }
    );
  }
}
