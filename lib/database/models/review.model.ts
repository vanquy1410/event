import mongoose, { Document } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
}

export interface IReview extends Document {
  event: mongoose.Types.ObjectId | string;
  userId: string;
  user: IUser;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: String, required: true },
  user: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;