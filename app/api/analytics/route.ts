import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Order from '@/lib/database/models/order.model';
import Favorite from '@/lib/database/models/favorite.model';
import Event from '@/lib/database/models/event.model';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await connectToDatabase();
    
    // Lấy dữ liệu orders và favorites
    const orders = await Order.find({ buyer: userId })
      .populate({
        path: 'event',
        model: Event,
        populate: ['category']
      });

    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'eventId',
        model: Event,
        populate: ['category']
      });

    // Xử lý dữ liệu cho biểu đồ danh mục
    const categoryCount: { [key: string]: number } = {};
    const favoriteCategoryCount: { [key: string]: number } = {};

    orders.forEach(order => {
      const category = order.event.category?.name || 'Không có danh mục';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    favorites.forEach(favorite => {
      const category = favorite.eventId.category?.name || 'Không có danh mục';
      favoriteCategoryCount[category] = (favoriteCategoryCount[category] || 0) + 1;
    });

    // Xử lý dữ liệu theo tháng
    const monthlyData: { [key: string]: number } = {};
    orders.forEach(order => {
      const month = new Date(order.event.startDateTime).toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const analytics = {
      totalEventsAttended: orders.length,
      totalFavorites: favorites.length,
      totalSpent: orders.reduce((sum, order) => sum + (order.event.price || 0), 0),
      
      categoryAnalytics: {
        attended: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
        favorites: Object.entries(favoriteCategoryCount).map(([name, value]) => ({ name, value }))
      },
      
      monthlyAttendance: Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy dữ liệu thống kê' },
      { status: 500 }
    );
  }
} 