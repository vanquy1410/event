import React from 'react';
import { Button } from '@/components/ui/button';
import { SEAT_TYPES, SeatType } from './types/seat';

interface SeatingMapProps {
  participantLimit: number;
  seats: boolean[];
  selectedSeat: number | null;
  onSeatSelect?: (seatIndex: number, seatType: SeatType) => void;
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

  const getSeatType = (rowIndex: number): SeatType => {
    const row = rowIndex + 1;
    return SEAT_TYPES.find(type => 
      row >= type.rowRange.start && row <= type.rowRange.end
    ) || SEAT_TYPES[SEAT_TYPES.length - 1];
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">Sơ đồ chỗ ngồi</h3>
      
      {/* Thông tin trải nghiệm */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Trải nghiệm theo vị trí</h4>
        <div className="max-h-40 overflow-y-auto pr-4">
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h5 className="text-purple-600 font-medium">Ghế VIP (Hàng 1-2)</h5>
              <p className="text-sm text-gray-600">
                - Vị trí đẹp nhất, gần màn hình nhất<br/>
                - Góc nhìn thoải mái nhất<br/>
                - Âm thanh rõ ràng nhất<br/>
                - Không gian riêng tư
              </p>
            </div>
            
            <div className="border-b pb-3">
              <h5 className="text-blue-600 font-medium">Ghế Premium (Hàng 3-5)</h5>
              <p className="text-sm text-gray-600">
                - Vị trí cân bằng giữa khoảng cách và góc nhìn<br/>
                - Tầm nhìn tổng thể tốt<br/>
                - Trải nghiệm
              </p>
            </div>
            
            <div>
              <h5 className="text-green-600 font-medium">Ghế Thường (Hàng 6+)</h5>
              <p className="text-sm text-gray-600">
                - Góc nhìn toàn cảnh<br/>
                - Không gian thoáng đãng<br/>
                - Giá vé tiết kiệm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chú thích loại ghế */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {SEAT_TYPES.map((type) => (
          <div key={type.id} className="flex flex-col gap-2 p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${type.color}`}></div>
              <span className="font-semibold">{type.name}</span>
            </div>
            <p className="text-sm text-gray-600">{type.description}</p>
          </div>
        ))}
      </div>

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
            const seatType = getSeatType(rowIndex);
            return (
              <div key={rowIndex} className="flex flex-col gap-2">
                <div className="text-sm text-gray-600 mb-1">
                  Hàng {rowIndex + 1} - {seatType.name}
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
                            : seatType.color
                        } hover:opacity-80 transition-opacity`}
                        onClick={() => !readOnly && !isOccupied && onSeatSelect?.(seatIndex, seatType)}
                        disabled={isOccupied || readOnly}
                        title={`Ghế ${seatIndex + 1} - ${seatType.name}`}
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