import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Favorite from '@/lib/database/models/favorite.model';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');
    
    await connectToDatabase();
    
    const favorite = await Favorite.findOne({ userId, eventId });
    
    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái yêu thích:', error);
    return NextResponse.json(
      { error: 'Lỗi khi kiểm tra trạng thái yêu thích' },
      { status: 500 }
    );
  }
} 