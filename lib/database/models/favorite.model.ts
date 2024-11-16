import { Schema, model, models, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  eventId: Schema.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema({
  userId: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  createdAt: { type: Date, default: Date.now }
});

FavoriteSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Favorite = models.Favorite || model('Favorite', FavoriteSchema);

export default Favorite; 