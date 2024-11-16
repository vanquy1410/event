import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Favorite from '@/lib/database/models/favorite.model';
import Event from '@/lib/database/models/event.model';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { userId, eventId } = await request.json();
    
    const favorite = await Favorite.create({ userId, eventId });
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi thêm vào yêu thích' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { userId, eventId } = await request.json();
    
    await Favorite.findOneAndDelete({ userId, eventId });
    return NextResponse.json({ message: 'Đã xóa khỏi yêu thích' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi xóa khỏi yêu thích' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await connectToDatabase();
    
    // Lấy danh sách favorites và populate thông tin sự kiện
    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'eventId',
        model: Event,
        populate: [
          { path: 'organizer' },
          { path: 'category' }
        ]
      });

    // Chuyển đổi dữ liệu để chỉ lấy thông tin sự kiện
    const favoriteEvents = favorites.map(fav => fav.eventId);
    
    return NextResponse.json(favoriteEvents);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách yêu thích' },
      { status: 500 }
    );
  }
} 