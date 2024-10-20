import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Task from '@/lib/database/models/task.model';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newTask = await Task.create(body);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi tạo công việc' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách công việc' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    const body = await req.json();
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
    if (!updatedTask) {
      return NextResponse.json({ error: 'Không tìm thấy công việc' }, { status: 404 });
    }
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi cập nhật công việc' }, { status: 500 });
  }
}
