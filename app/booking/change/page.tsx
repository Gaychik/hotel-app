// app/booking/change/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createBooking, getRoomById } from '@/lib/data';
import { BookingForm } from '@/components/BookingForm';
import type { Room } from '@/types';

const ChangeBookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomId = searchParams.get('roomId');
        const currentBookingId = searchParams.get('currentBookingId');
        
        if (!roomId || !currentBookingId) {
          setError('Недостаточно данных для изменения бронирования');
          setLoading(false);
          return;
        }

        const roomData = await getRoomById(roomId);
        if (!roomData) {
          setError('Номер не найден');
          return;
        }

        setRoom(roomData);
      } catch (err) {
        console.error('Ошибка при загрузке данных для изменения бронирования:', err);
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
    return <div className="container mx-auto py-8">Загрузка данных для изменения бронирования...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  if (!room) {
    return <div className="container mx-auto py-8">Номер не найден</div>;
  }

  // Получаем параметры из URL
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const currentBookingId = searchParams.get('currentBookingId');

  // Вычисляем количество ночей
  let nightsCount = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    nightsCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Вычисляем общую стоимость
  const totalPrice = nightsCount > 0 ? room.price * nightsCount : room.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-karantina">Изменение бронирования</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{room.name}</h2>
        <p className="text-gray-600 mb-2">
          {checkIn && checkOut && `${format(new Date(checkIn), 'dd MMMM yyyy', { locale: ru })} — ${format(new Date(checkOut), 'dd MMMM yyyy', { locale: ru })}`}
        </p>
        <p className="text-lg font-semibold">{totalPrice.toLocaleString('ru-RU')} ₽</p>
        {nightsCount > 0 && <p className="text-gray-600">{nightsCount} {nightsCount === 1 ? 'ночь' : nightsCount < 5 ? 'ночи' : 'ночей'}</p>}
      </div>

      <BookingForm 
        roomId={room.id} 
        checkIn={checkIn || ''} 
        checkOut={checkOut || ''}  
        currentBookingId={currentBookingId || ''}
        mode="change" 
      />
    </div>
  );
};

export default ChangeBookingPage;