import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const assignedTo = searchParams.get('assignedTo');

    console.log('API: Fetching tasks for assignedTo:', assignedTo);

    let query = {};
    if (assignedTo) {
      query = { assignedTo: assignedTo };
    }

    const tasks = await Task.find(query).sort({ createdAt: 'desc' });
    console.log('API: Tasks found:', tasks);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách công việc:', error);
    return NextResponse.json({ message: 'Lỗi server khi lấy danh sách công việc' }, { status: 500 });
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
