// components/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { StarRating } from './ui/StarRating';
import { addReview } from '@/lib/data';
import type { Booking } from '@/types';

interface ReviewFormProps {
  booking: Booking;
  onClose: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ booking, onClose }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) {
      alert("Пожалуйста, поставьте оценку и напишите отзыв.");
      return;
    }
    setIsSubmitting(true);
    await addReview({
      author: 'Текущий Пользователь', // В будущем здесь будет имя из сессии
      rating,
      text,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Оставить отзыв</h2>
      <p className="text-gray-600 mb-4">о номере "{booking.room.name}"</p>
      
      <div className="mb-4">
        <p className="font-semibold mb-2">Ваша оценка:</p>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <div className="mb-6">
        <label htmlFor="reviewText" className="font-semibold mb-2 block">Ваши впечатления:</label>
        <textarea
          id="reviewText"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Расскажите, как прошел ваш отдых..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  );
};
