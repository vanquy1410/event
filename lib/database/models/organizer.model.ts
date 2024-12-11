import { Schema, model, models, Document, Model } from 'mongoose';

// Định nghĩa interface cho venues trong scaleDetails
export interface IVenue {
  name: string;
  capacity: number;
  pricePerDay: number;
  rating: number;
  facilities: string[];
}

// Định nghĩa interface cho scaleDetails
export interface IScaleDetails {
  capacity: number;
  basePrice: number;
  venues: IVenue;
}

// Interface chính cho dữ liệu
export interface IOrganizerData {
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
  documents: string[];
}

// Interface cho model MongoDB
export interface IOrganizer extends Document {
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
  documents: string[];
}

// Schema definition
const OrganizerSchema = new Schema<IOrganizer>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  eventTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  eventType: { type: String, required: true },
  eventScale: { type: String, required: true },
  venueType: { type: String, required: true },
  venue: { type: String, required: true },
  expectedTicketPrice: { type: Number, required: true },
  expectedRevenue: { type: Number, required: true },
  participantLimit: { type: Number, required: true },
  price: { type: Number, required: true },
  scaleDetails: {
    type: {
      capacity: { type: Number, required: true },
      basePrice: { type: Number, required: true },
      venues: {
        type: {
          name: { type: String, required: true },
          capacity: { type: Number, required: true },
          pricePerDay: { type: Number, required: true },
          rating: { type: Number, required: true },
          facilities: [{ type: String, required: true }]
        },
        required: true
      }
    },
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  documents: { type: [String], default: [] }
}, {
  timestamps: true
});

// Model
let Organizer: Model<IOrganizer>;

try {
  Organizer = models.Organizer || model<IOrganizer>('Organizer', OrganizerSchema);
} catch {
  Organizer = model<IOrganizer>('Organizer', OrganizerSchema);
}

export default Organizer;