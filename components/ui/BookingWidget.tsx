// components/ui/BookingWidget.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BookingWidgetProps {
  pricePerNight: number;
  roomId: string;
}

export const BookingWidget = ({ pricePerNight, roomId }: BookingWidgetProps) => {
  const router = useRouter();

  const startBookingProcess = () => {
    // Формируем URL с параметрами для "режима бронирования"
    const queryParams = new URLSearchParams({
      mode: 'booking',
      roomId,
    });
    router.push(`/calendar?${queryParams.toString()}`);
  };

  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white sticky top-24">
      <div className="text-xl mb-6">
        <span className="font-bold text-2xl font-source-serif-pro">{pricePerNight.toLocaleString('ru-RU')} ₽</span>
        <span className="text-gray-600"> / ночь</span>
      </div>
      
      <button
        onClick={startBookingProcess}
        className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
      >
        Забронировать
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        Вы сможете выбрать даты на следующем шаге.
      </p>
    </div>
  );
};
