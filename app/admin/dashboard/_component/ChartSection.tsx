"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicEventChart = dynamic(() => import('@/components/charts/EventChart'), { ssr: false });
const DynamicOrderChart = dynamic(() => import('@/components/charts/OrderChart'), { ssr: false });

interface ChartData {
  name: string;
  totalParticipants: number;
}

interface PopularEvent {
  name: string;
  participants: number;
  chartData: ChartData[];
}

interface OrderStats {
  total: number;
  completed: number;
  pending: number;
  chartData: { _id: string; count: number }[];
}

interface ChartSectionProps {
  popularEvent: PopularEvent;
  orderStats: OrderStats;
}

export default function ChartSection({ popularEvent, orderStats }: ChartSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Suspense fallback={<div>Loading chart...</div>}>
        <DynamicEventChart data={popularEvent.chartData} />
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <DynamicOrderChart data={orderStats.chartData} />
      </Suspense>
    </div>
  );
}
