"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EventChartData {
  name: string;
  totalParticipants: number;
}

interface EventChartProps {
  data: EventChartData[];
}

const EventChart: React.FC<EventChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Số người tham gia',
        data: data.map(item => item.totalParticipants),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Sự kiện phổ biến nhất' },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default EventChart;
