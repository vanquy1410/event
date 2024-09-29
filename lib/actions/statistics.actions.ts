import { connectToDatabase } from '@/lib/database';
import Event from '@/lib/database/models/event.model';
import Order from '@/lib/database/models/order.model';
import User from '@/lib/database/models/user.model';

export async function getMostPopularEvent() {
  await connectToDatabase();
  const popularEvent = await Event.findOne().sort('-totalParticipants').limit(1);
  
  const chartData = await Event.aggregate([
    { $sort: { totalParticipants: -1 } },
    { $limit: 5 },
    { $project: { name: 1, totalParticipants: 1 } }
  ]);

  return {
    name: popularEvent.title,
    participants: popularEvent.totalParticipants,
    chartData
  };
}

export async function getOrderStatistics() {
  await connectToDatabase();
  const total = await Order.countDocuments();
  const completed = await Order.countDocuments({ status: 'completed' });
  const pending = await Order.countDocuments({ status: 'pending' });

  const chartData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 30 }
  ]);

  return { total, completed, pending, chartData };
}

export async function getUserStatistics() {
  await connectToDatabase();
  const total = await User.countDocuments();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  return { total, newUsers };
}
