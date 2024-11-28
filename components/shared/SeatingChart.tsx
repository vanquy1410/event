"use client"

import React from 'react';
import Image from 'next/image';

interface SeatingChartProps {
  participantLimit: number;
  currentParticipants: number;
  seats: boolean[];
}

const SeatingChart: React.FC<SeatingChartProps> = ({
  participantLimit,
  currentParticipants,
  seats = []
}) => {
  const SEATS_PER_ROW = 10;
  const rows = Math.ceil(participantLimit / SEATS_PER_ROW);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Sơ đồ chỗ ngồi</h3>
        <p className="text-gray-600">
          Số chỗ còn trống: {participantLimit - currentParticipants}/{participantLimit}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Còn trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Đã đặt</span>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        {/* Render your seating chart here */}
      </div>
    </div>
  );
};

export default SeatingChart; 