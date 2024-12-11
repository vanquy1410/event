export interface VenueType {
  name: string;
  capacity: number;
  pricePerDay: number;
  rating?: number;
  facilities?: string[];
}

export interface EventScale {
  id: string;
  name: string;
  capacity: number;
  basePrice: number;
  description: string;
  venues: {
    hotels: VenueType[];
    conference: VenueType[];
    outdoor: VenueType[];
  };
  expectedRevenue: {
    minTicketPrice: number;
    maxTicketPrice: number;
    occupancyRate: number;
  };
}

export const EVENT_SCALES: EventScale[] = [
  {
    id: 'small',
    name: 'Quy mô nhỏ',
    capacity: 500,
    basePrice: 20000000,
    description: 'Phù hợp cho các sự kiện dưới 500 người',
    venues: {
      hotels: [
        {
          name: 'Khách sạn 3 sao',
          capacity: 300,
          pricePerDay: 15000000,
          rating: 3,
          facilities: ['Phòng hội nghị', 'Âm thanh cơ bản', 'Wifi']
        },
        {
          name: 'Khách sạn 4 sao',
          capacity: 400,
          pricePerDay: 25000000,
          rating: 4,
          facilities: ['Phòng hội nghị cao cấp', 'Hệ thống âm thanh hiện đại', 'Wifi tốc độ cao']
        }
      ],
      conference: [
        {
          name: 'Hội trường nhỏ',
          capacity: 300,
          pricePerDay: 10000000,
          facilities: ['Âm thanh', 'Máy chiếu', 'Điều hòa']
        },
        {
          name: 'Phòng họp',
          capacity: 200,
          pricePerDay: 5000000,
          facilities: ['Bàn ghế', 'Máy chiếu', 'Điều hòa']
        }
      ],
      outdoor: [
        {
          name: 'Sân vườn',
          capacity: 500,
          pricePerDay: 15000000,
          facilities: ['Mái che', 'Âm thanh', 'Ánh sáng']
        }
      ]
    },
    expectedRevenue: {
      minTicketPrice: 200000,
      maxTicketPrice: 500000,
      occupancyRate: 0.8
    }
  },
  {
    id: 'medium',
    name: 'Quy mô trung bình',
    capacity: 1000,
    basePrice: 50000000,
    description: 'Phù hợp cho các sự kiện từ 500-1000 người',
    venues: {
      hotels: [
        {
          name: 'Khách sạn 4 sao',
          capacity: 800,
          pricePerDay: 40000000,
          rating: 4,
          facilities: ['Phòng hội nghị lớn', 'Âm thanh ánh sáng cao cấp', 'Dịch vụ ăn uống']
        },
        {
          name: 'Khách sạn 5 sao',
          capacity: 1000,
          pricePerDay: 60000000,
          rating: 5,
          facilities: ['Phòng hội nghị quốc tế', 'Hệ thống âm thanh ánh sáng cao cấp', 'Dịch vụ ăn uống 5 sao']
        }
      ],
      conference: [
        {
          name: 'Trung tâm hội nghị vừa',
          capacity: 1000,
          pricePerDay: 35000000,
          facilities: ['Sân khấu', 'Hệ thống âm thanh', 'Máy chiếu HD']
        },
        {
          name: 'Nhà thi đấu',
          capacity: 800,
          pricePerDay: 30000000,
          facilities: ['Sân khấu lớn', 'Âm thanh', 'Màn hình LED']
        }
      ],
      outdoor: [
        {
          name: 'Công viên',
          capacity: 1000,
          pricePerDay: 25000000,
          facilities: ['Sân khấu ngoài trời', 'Hệ thống âm thanh', 'Đèn sân khấu']
        }
      ]
    },
    expectedRevenue: {
      minTicketPrice: 500000,
      maxTicketPrice: 1000000,
      occupancyRate: 0.75
    }
  },
  {
    id: 'large',
    name: 'Quy mô lớn',
    capacity: 2000,
    basePrice: 100000000,
    description: 'Phù hợp cho các sự kiện trên 1000 người',
    venues: {
      hotels: [
        {
          name: 'Khách sạn 5 sao cao cấp',
          capacity: 1500,
          pricePerDay: 100000000,
          rating: 5,
          facilities: ['Phòng hội nghị quốc tế', 'Hệ thống âm thanh ánh sáng tối tân', 'Dịch vụ ăn uống cao cấp']
        }
      ],
      conference: [
        {
          name: 'Trung tâm hội nghị quốc tế',
          capacity: 2000,
          pricePerDay: 80000000,
          facilities: ['Sân khấu lớn', 'Hệ thống âm thanh cao cấp', 'Màn hình LED cao cấp']
        }
      ],
      outdoor: [
        {
          name: 'Sân vận động',
          capacity: 2000,
          pricePerDay: 70000000,
          facilities: ['Sân khấu ngoài trời lớn', 'Hệ thống âm thanh công suất lớn', 'Màn hình LED']
        }
      ]
    },
    expectedRevenue: {
      minTicketPrice: 1000000,
      maxTicketPrice: 2000000,
      occupancyRate: 0.7
    }
  }
];

export const calculateEstimatedRevenue = (
  scale: EventScale,
  venue: VenueType,
  ticketPrice: number
): number => {
  const expectedAttendees = Math.min(scale.capacity, venue.capacity) * scale.expectedRevenue.occupancyRate;
  const totalRevenue = expectedAttendees * ticketPrice;
  const venueCost = venue.pricePerDay;
  const organizationCost = scale.basePrice;
  
  return totalRevenue - venueCost - organizationCost;
};