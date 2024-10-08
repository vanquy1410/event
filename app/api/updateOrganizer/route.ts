import { NextResponse } from 'next/server';
import { updateOrganizerEvent } from '@/lib/actions/organizer.actions';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...eventData } = body;
    const updatedOrganizer = await updateOrganizerEvent(id, eventData);
    return NextResponse.json(updatedOrganizer);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin ban tổ chức:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật thông tin ban tổ chức' }, { status: 500 });
  }
}
