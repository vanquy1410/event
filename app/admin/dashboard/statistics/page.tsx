import StatisticsCard from "../_component/StatisticsCard";
import { getMostPopularEvent, getOrderStatistics, getUserStatistics } from '@/lib/actions/statistics.actions';
import ChartSection from '../_component/ChartSection';

export default async function StatisticsPage() {
  const popularEvent = await getMostPopularEvent();
  const orderStats = await getOrderStatistics();
  const userStats = await getUserStatistics();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatisticsCard
          title="Sự kiện phổ biến nhất"
          value={popularEvent.name}
          subValue={`${popularEvent.participants} người tham gia`}
        />
        <StatisticsCard
          title="Tổng số đơn hàng"
          value={orderStats.total.toString()}
          subValue={`${orderStats.completed} hoàn thành, ${orderStats.pending} đang chờ xử lý`}
        />
        <StatisticsCard
          title="Tổng số người dùng"
          value={userStats.total.toString()}
          subValue={`${userStats.newUsers} người dùng mới trong tháng này`}
        />
      </div>
      <ChartSection popularEvent={popularEvent} orderStats={orderStats} />
    </div>
  );
}
