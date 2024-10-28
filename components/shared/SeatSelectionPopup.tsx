import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type SeatSelectionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  participantLimit: number;
  seats: boolean[];
  onSeatSelect: (selectedSeat: number) => void;
};

const SeatSelectionPopup: React.FC<SeatSelectionPopupProps> = ({
  isOpen,
  onClose,
  participantLimit,
  seats,
  onSeatSelect,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSeatClick = (index: number) => {
    if (!seats[index]) { // Chỉ cho phép chọn ghế chưa có người
      setSelectedSeat(index);
    }
  };

  const handleConfirm = () => {
    if (selectedSeat !== null) {
      onSeatSelect(selectedSeat);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Chọn chỗ ngồi</h2>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {Array.from({ length: participantLimit }).map((_, index) => (
            <Button
              key={index}
              className={`w-8 h-8 ${
                seats[index]
                  ? 'bg-red-500' // Ghế đã có người
                  : selectedSeat === index
                  ? 'bg-blue-500' // Ghế đang được chọn
                  : 'bg-green-500' // Ghế chưa có người
              }`}
              onClick={() => handleSeatClick(index)}
              disabled={seats[index]} // Không cho phép chọn ghế đã có người
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} className="mr-2">Hủy</Button>
          <Button onClick={handleConfirm} disabled={selectedSeat === null}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPopup;
