"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface OrderChartData {
  _id: string;
  count: number;
}

interface OrderChartProps {
  data: OrderChartData[];
}

const OrderChart: React.FC<OrderChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'Số đơn hàng',
        data: data.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Số đơn hàng theo ngày' },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default OrderChart;
