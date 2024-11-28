import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SeatingMap from './SeatingMap';

type SeatSelectionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  participantLimit: number;
  seats: boolean[];
  onSeatSelect: (selectedSeat: number) => void;
  basePrice: number;
};

const SeatSelectionPopup: React.FC<SeatSelectionPopupProps> = ({
  isOpen,
  onClose,
  participantLimit,
  seats,
  onSeatSelect,
  basePrice,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSeatSelect = (seatIndex: number) => {
    setSelectedSeat(seatIndex);
  };

  const handleConfirm = () => {
    if (selectedSeat !== null) {
      onSeatSelect(selectedSeat);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Chọn chỗ ngồi</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <SeatingMap
            participantLimit={participantLimit}
            seats={seats}
            selectedSeat={selectedSeat}
            onSeatSelect={handleSeatSelect}
            basePrice={basePrice}
          />
        </div>

        <div className="p-6 border-t bg-white flex justify-end gap-2">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="mr-2"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedSeat === null}
            className="bg-primary-500"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPopup;
