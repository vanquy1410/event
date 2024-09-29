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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Suspense fallback={<div>Loading chart...</div>}>
        <DynamicEventChart data={popularEvent.chartData} />
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <DynamicOrderChart data={orderStats.chartData} />
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <DynamicUserTrendChart data={userTrend} />
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <DynamicCategoryDistributionChart data={categoryDistribution} />
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <DynamicRevenueChart data={revenue} />
      </Suspense>
    </div>
  );
}
