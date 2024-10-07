'use server';

import { revalidatePath } from 'next/cache';
import Review from '@/lib/database/models/review.model';
import { connectToDatabase } from '@/lib/database';

export async function createReview(reviewData: {
  event: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
}) {
  try {
    await connectToDatabase();
    const newReview = new Review(reviewData);
    await newReview.save();
    revalidatePath(`/events/${reviewData.event}`);
    return JSON.parse(JSON.stringify(newReview));
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error);
    if (error instanceof Error) {
      throw new Error(`Lỗi khi tạo đánh giá: ${error.message}`);
    } else {
      throw new Error('Lỗi không xác định khi tạo đánh giá');
    }
  }
}

export async function getReviewsByEvent(eventId: string) {
  try {
    await connectToDatabase();
    const reviews = await Review.find({ event: eventId }).populate('user', 'firstName lastName');
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá:', error);
    throw error;
  }
}
