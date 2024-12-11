import React from 'react';
import { Button } from '@/components/ui/button';

interface SeatingMapProps {
  participantLimit: number;
  seats: boolean[];
  selectedSeat: number | null;
  onSeatSelect?: (seatIndex: number) => void;
  readOnly?: boolean;
  basePrice: number;
}

const SeatingMap: React.FC<SeatingMapProps> = ({
  participantLimit,
  seats,
  selectedSeat,
  onSeatSelect,
  readOnly = false,
  basePrice
}) => {
  const SEATS_PER_ROW = 10;
  const rows = Math.ceil(participantLimit / SEATS_PER_ROW);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">Sơ đồ chỗ ngồi</h3>

      {/* Chú thích trạng thái ghế */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Còn trống</span>
        </div>
      </div>

      {/* Sơ đồ ghế */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="w-full h-2 bg-gray-300 mb-12 rounded-full relative">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
            Màn hình
          </div>
        </div>
        
        <div className="grid gap-6">
          {Array.from({ length: rows }).map((_, rowIndex) => {
            return (
              <div key={rowIndex} className="flex flex-col gap-2">
                <div className="text-sm text-gray-600 mb-1">
                  Hàng {rowIndex + 1}
                </div>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: SEATS_PER_ROW }).map((_, colIndex) => {
                    const seatIndex = rowIndex * SEATS_PER_ROW + colIndex;
                    if (seatIndex >= participantLimit) return null;

                    const isOccupied = seats[seatIndex];
                    const isSelected = selectedSeat === seatIndex;

                    return (
                      <Button
                        key={seatIndex}
                        className={`w-10 h-10 text-xs ${
                          isOccupied 
                            ? 'bg-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        } hover:opacity-80 transition-opacity`}
                        onClick={() => !readOnly && !isOccupied && onSeatSelect?.(seatIndex)}
                        disabled={isOccupied || readOnly}
                        title={`Ghế ${seatIndex + 1}`}
                      >
                        {seatIndex + 1}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeatingMap; 