import { IReview } from '@/lib/database/models/review.model';

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
            Đánh giá: {review.rating}/5
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
