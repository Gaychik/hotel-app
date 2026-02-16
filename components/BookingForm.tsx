// components/BookingForm.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getRoomById, createBooking } from '@/lib/data'; // Предполагаем, что есть функция createBooking
import type { Room } from '@/data/rooms';
import { differenceInCalendarDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { updateBooking } from '@/lib/data';

interface BookingFormProps {
  roomId: string;
  checkIn: string;
  checkOut: string;
  summaryPrice: number;
  currentBookingId?: string;
  mode?: 'new' | 'change';
}


export const BookingForm = ({ roomId, checkIn, checkOut,  currentBookingId, mode = 'new' }: BookingFormProps) => {
    const router = useRouter();
    const [room, setRoom] = useState<Room | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getRoomById(roomId).then((data: Room | undefined) => {
            if (data) {
                setRoom(data);
            }
            setIsLoading(false);
        });
    }, [roomId]);

    const { totalNights, totalPrice } = useMemo(() => {
        if (!room) return { totalNights: 0, totalPrice: 0 };
        const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
        return {
            totalNights: nights,
            totalPrice: nights * room.price
        };
    }, [checkIn, checkOut, room]);

       const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    if (!room) {
      setIsError(true);
      return;
    }
    
    if (mode === 'change' && currentBookingId) {
      // Логика изменения бронирования
      const result = await updateBooking(
        currentBookingId,
        checkIn,
        checkOut
      );
      
      if (result && currentBookingId) {
        // Перенаправление на страницу успеха с информацией об изменении
        router.push(`/booking/success?type=change&bookingId=${currentBookingId}`);
      } else {
        setIsError(true);
      }
    } else {
      // Существующая логика создания бронирования
      const payload = {
        roomId: room.id,
        checkIn: checkIn,
        checkOut: checkOut,
        guestName: "Тестовый Пользователь",
        totalPrice: totalPrice
      };
      
      const result = await createBooking(payload);
      
      if (result) {
        router.push(`/booking/success?bookingId=${result.id}`);
      } else {
        setIsError(true);
      }
    }
  } catch (error) {
    setIsError(true);
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

    if (isLoading) {
        return <div className="text-center py-20">Загружаем детали номера...</div>;
    }

    if (!room) {
        return <div className="text-center py-20">Ошибка: номер не найден.</div>;
    }

    return (
        <main className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold font-karantina mb-8 text-center">Подтверждение бронирования</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Левая колонка: Детали */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Детали вашей поездки</h2>
                        <div className="space-y-2">
                           <p><strong>Номер:</strong> {room.name}</p>
                           <p><strong>Заезд:</strong> {format(new Date(checkIn), 'd MMMM yyyy', { locale: ru })}</p>
                           <p><strong>Выезд:</strong> {format(new Date(checkOut), 'd MMMM yyyy', { locale: ru })}</p>
                           <p><strong>Продолжительность:</strong> {totalNights} ночей</p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Информация о госте</h2>
                        {/* Здесь будет полноценная форма */}
                        <p className="text-gray-500">Раздел для ввода имени, фамилии, email и других данных гостя.</p>
                    </div>
                </div>

                {/* Правая колонка: Итог и оплата */}
                <div className="p-6 bg-white rounded-lg shadow h-fit sticky top-24">
                     <h2 className="text-xl font-bold mb-4">Итог</h2>
                     <div className="space-y-2">
                        <p className="flex justify-between">
                            <span>{room.price.toLocaleString('ru-RU')}₽ x {totalNights} ночей</span> 
                            <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </p>
                        {/* Здесь могут быть налоги и сборы */}
                        <p className="flex justify-between text-sm text-gray-500">
                            <span>Налоги и сборы</span> 
                            <span>Включены</span>
                        </p>
                     </div>
                     <hr className="my-4" />
                     <p className="flex justify-between font-bold text-lg">
                        <span>К оплате</span> 
                        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                     </p>
                     <button onClick={handleSubmit} className="mt-6 w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        Подтвердить и оплатить
                     </button>
                </div>
            </div>
        </main>
    );
};
