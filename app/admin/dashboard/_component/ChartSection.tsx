"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicEventChart = dynamic(() => import('@/components/charts/EventChart'), { ssr: false });
const DynamicOrderChart = dynamic(() => import('@/components/charts/OrderChart'), { ssr: false });
const DynamicUserTrendChart = dynamic(() => import('@/components/charts/UserTrendChart'), { ssr: false });
const DynamicCategoryDistributionChart = dynamic(() => import('@/components/charts/CategoryDistributionChart'), { ssr: false });
const DynamicRevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), { ssr: false });

interface ChartSectionProps {
  popularEvent: any;
  orderStats: any;
  userTrend: any;
  categoryDistribution: any;
  revenue: any;
}

export default function ChartSection({ popularEvent, orderStats, userTrend, categoryDistribution, revenue }: ChartSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="w-full h-64">
        <Suspense fallback={<div>Đang tải biểu đồ...</div>}>
          <DynamicEventChart data={popularEvent.chartData} />
        </Suspense>
      </div>
      <div className="w-full h-64">
        <Suspense fallback={<div>Đang tải biểu đồ...</div>}>
          <DynamicOrderChart data={orderStats.chartData} />
        </Suspense>
      </div>
      <div className="w-full h-64">
        <Suspense fallback={<div>Đang tải biểu đồ...</div>}>
          <DynamicUserTrendChart data={userTrend} />
        </Suspense>
      </div>
      <div className="w-full h-64">
        <Suspense fallback={<div>Đang tải biểu đồ...</div>}>
          <DynamicCategoryDistributionChart data={categoryDistribution} />
        </Suspense>
      </div>
      <div className="w-full h-64">
        <Suspense fallback={<div>Đang tải biểu đồ...</div>}>
          <DynamicRevenueChart data={revenue} />
        </Suspense>
      </div>
    </div>
  );
}
