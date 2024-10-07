'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createReview } from '@/lib/actions/review.actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type ReviewFormProps = {
  eventId: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
};

const ReviewForm = ({ eventId, userId, userFirstName, userLastName }: ReviewFormProps) => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createReview({
        event: eventId,
        userId: userId,
        user: {
          firstName: userFirstName,
          lastName: userLastName
        },
        rating: parseInt(data.rating),
        comment: data.comment,
      });
      reset();
      toast.success('Đánh giá đã được gửi thành công!');
      router.refresh();
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      if (error instanceof Error) {
        toast.error(`Lỗi khi gửi đánh giá: ${error.message}`);
      } else {
        toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Đánh giá
        </label>
        <Input
          type="number"
          id="rating"
          {...register('rating', { required: true, min: 1, max: 5 })}
          min="1"
          max="5"
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Bình luận
        </label>
        <Textarea
          id="comment"
          {...register('comment', { required: true })}
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </Button>
    </form>
  );
};

export default ReviewForm;