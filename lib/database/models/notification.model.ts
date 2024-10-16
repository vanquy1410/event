import { Schema, model, models, Document } from 'mongoose';

export interface INotification extends Document {
  message: string;
  eventId: Schema.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Notification = models.Notification || model('Notification', NotificationSchema);

export default Notification;
