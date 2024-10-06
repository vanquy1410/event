import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Event from '@/lib/database/models/event.model';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');

  try {
    await connectToDatabase();

    let filter: any = {};

    if (query) {
      filter.title = { $regex: query, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (startDate) {
      filter.startDateTime = { $gte: new Date(startDate) };
    }

    if (endDate) {
      filter.endDateTime = { $lte: new Date(endDate) };
    }

    if (minPrice) {
      filter.price = { $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    }

    const totalEvents = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalEvents / limit);

    const events = await Event.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category');

    return NextResponse.json({
      data: events,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sự kiện:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
