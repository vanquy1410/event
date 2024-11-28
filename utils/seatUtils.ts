import { SeatType, SEAT_TYPES } from '@/components/shared/types/seat';

export const getSeatType = (rowIndex: number): SeatType => {
  const row = rowIndex + 1;
  return SEAT_TYPES.find(type => 
    row >= type.rowRange.start && row <= type.rowRange.end
  ) || SEAT_TYPES[SEAT_TYPES.length - 1];
}; 