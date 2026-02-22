// components/ui/StarRating.tsx
'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <StarIcon
              className={`h-8 w-8 transition-colors ${
                ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
