import { Document, Schema, model, models } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  url2?: string;
  category: { _id: string, name: string }
  organizer: { _id: string, firstName: string, lastName: string }
  participantLimit: number;
  currentParticipants: number;  // Make sure this is included
  seats: boolean[];
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  url2: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  participantLimit: { type: Number, required: true },
  currentParticipants: { type: Number, default: 0 },
  seats: { type: [Boolean], default: [] },
})

const Event = models.Event || model('Event', EventSchema);

export default Event;