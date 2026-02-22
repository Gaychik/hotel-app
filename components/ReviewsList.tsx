// components/ReviewsList.tsx
import type { Review } from '@/types';
import { StarIcon } from '@heroicons/react/24/solid';

interface ReviewsListProps {
  reviews: Review[];
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Отзывы наших гостей</h2>
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">{review.author}</span>
              <div className="flex">
                {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="h-5 w-5 text-yellow-400" />)}
                {[...Array(5 - review.rating)].map((_, i) => <StarIcon key={i} className="h-5 w-5 text-gray-300" />)}
              </div>
            </div>
            <p className="text-gray-600 mt-2">{review.text}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString('ru-RU')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
