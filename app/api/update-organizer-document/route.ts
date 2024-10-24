import { NextResponse } from 'next/server';
import { updateOrganizerDocument } from '@/lib/actions/organizer.actions';

export async function POST(req: Request) {
  const { organizerId, documentUrl } = await req.json();

  if (!organizerId || !documentUrl) {
    return NextResponse.json({ error: 'Thiếu thông tin cần thiết' }, { status: 400 });
  }

  try {
    const updatedOrganizer = await updateOrganizerDocument(organizerId, documentUrl);
    return NextResponse.json(updatedOrganizer);
  } catch (error) {
    console.error('Lỗi khi cập nhật tài liệu:', error);
    return NextResponse.json({ error: 'Không thể cập nhật tài liệu' }, { status: 500 });
  }
}

