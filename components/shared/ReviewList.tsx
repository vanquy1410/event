'use client';

import { IReview } from '@/lib/database/models/review.model';
import ReactStars from 'react-rating-stars-component';

type ReviewListProps = {
  reviews: IReview[];
};

const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={typeof review._id === 'string' ? review._id : review._id?.toString()} className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{review.user.firstName} {review.user.lastName}</span>
            <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
          </div>
          <div className="mb-2">
            <ReactStars
              count={5}
              value={review.rating}
              size={24}
              activeColor="#ffd700"
              edit={false}
            />
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
