'use client'; // Этот компонент интерактивный

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // 👈 Импортируем useRouter

interface BookingWidgetProps {
  pricePerNight: number;
  roomId: string; // 👈 Добавляем ID комнаты
}

export const BookingWidget = ({ pricePerNight, roomId }: BookingWidgetProps) => {
  const router = useRouter(); // 👈 Инициализируем роутер
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const totalNights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (end <= start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [checkInDate, checkOutDate]);

  const handleBooking = () => {
    if(totalNights > 0) {
      // 👇 ФОРМИРУЕМ URL С ПАРАМЕТРАМИ И ПЕРЕХОДИМ НА СТРАНИЦУ
      const queryParams = new URLSearchParams({
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate
      });
      router.push(`/booking?${queryParams.toString()}`);
    } else {
      alert('Пожалуйста, выберите корректные даты.')
    }
  }

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white sticky top-24">
      {/* ... остальная JSX-разметка виджета остается без изменений ... */}
      <div className="text-xl mb-4">
        <span className="font-bold text-2xl font-source-serif-pro">{pricePerNight} ₽</span>
        <span className="text-gray-600"> / ночь</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Заезд</label>
          <input type="date" id="checkin" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Выезд</label>
          <input type="date" id="checkout" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </div>
      {totalNights > 0 && (
        <div className="flex justify-between items-center my-4 font-inter">
          <span className="text-gray-700">{pricePerNight} ₽ x {totalNights} ночей</span>
          <span className="font-bold">{totalNights * pricePerNight} ₽</span>
        </div>
      )}
      <button 
        onClick={handleBooking}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Забронировать
      </button>
    </div>
  );
};
