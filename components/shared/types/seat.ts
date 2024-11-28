export interface SeatType {
  id: string;
  name: string;
  description: string;
  color: string;
  rowRange: {
    start: number;
    end: number;
  };
}

export const SEAT_TYPES: SeatType[] = [
  {
    id: 'vip',
    name: 'Ghế VIP',
    description: 'Hàng ghế đầu, vị trí tốt nhất để xem sự kiện',
    color: 'bg-purple-500',
    rowRange: { start: 1, end: 2 }
  },
  {
    id: 'premium',
    name: 'Ghế Premium',
    description: 'Khu vực trung tâm, tầm nhìn tốt',
    color: 'bg-blue-500',
    rowRange: { start: 3, end: 5 }
  },
  {
    id: 'standard',
    name: 'Ghế Thường',
    description: 'Khu vực thường',
    color: 'bg-green-500',
    rowRange: { start: 6, end: 10 }
  }
]; 