import { Schema, model, models, Document, Model } from 'mongoose';

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
  price: number;
  participantLimit: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

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
  price: { type: Number, required: true },
  participantLimit: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  }
});

let Organizer: Model<IOrganizer>;

if (typeof models !== 'undefined' && models.Organizer) {
  Organizer = models.Organizer as Model<IOrganizer>;
} else {
  Organizer = model<IOrganizer>('Organizer', OrganizerSchema);
}

export default Organizer;
