export interface IVenue {
  name: string;
  capacity: number;
  pricePerDay: number;
  rating: number;
  facilities: string[];
}

export interface IScaleDetails {
  capacity: number;
  basePrice: number;
  venues: IVenue;
}

export interface IOrganizer {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  eventTitle: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  eventType: string;
  eventScale: string;
  venueType: string;
  venue: string;
  expectedTicketPrice: number;
  expectedRevenue: number;
  participantLimit: number;
  price: number;
  scaleDetails: IScaleDetails;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  documents?: string[];
  digitalSignature?: string;
} 