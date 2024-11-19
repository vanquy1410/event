import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import CancelNotification from '@/lib/database/models/cancelNotification.model';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const notifications = await CancelNotification.find()
      .sort({ cancelDate: -1 })
      .limit(50);
      
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Lỗi khi lấy thông báo hủy vé:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông báo hủy vé' },
      { status: 500 }
    );
  }
} 