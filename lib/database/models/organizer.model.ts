import mongoose, { Schema } from 'mongoose';
import { IOrganizer } from '@/types/organizer';

const OrganizerSchema = new Schema({
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
    capacity: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    venues: {
      name: { type: String, required: true },
      capacity: { type: Number, required: true },
      pricePerDay: { type: Number, required: true },
      rating: { type: Number },
      facilities: [{ type: String }]
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  documents: [{ type: String }]
}, {
  timestamps: true
});

const Organizer = mongoose.models.Organizer || mongoose.model<IOrganizer>('Organizer', OrganizerSchema);

export default Organizer;