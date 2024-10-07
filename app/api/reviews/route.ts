import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Review from '@/lib/database/models/review.model';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { event, user, rating, comment } = await req.json();
    const newReview = await Review.create({ event, user, rating, comment });
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Lỗi khi tạo đánh giá', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Lỗi không xác định khi tạo đánh giá' }, { status: 500 });
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'EventId is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const reviews = await Review.find({ event: eventId }).populate('user', 'firstName lastName');
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
