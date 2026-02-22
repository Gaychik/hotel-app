// components/booking/SuccessConfirmation.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getBookingById } from '@/lib/data';
import { AnimatedStatusIcon } from '@/components/ui/AnimatedStatusIcon';
import { useRouter } from 'next/navigation'; // <-- 1. Импортируем useRouter

type Booking = Awaited<ReturnType<typeof getBookingById>>;

interface SuccessConfirmationProps {
  bookingId: string;
}

export const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({ bookingId }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const router = useRouter(); // <-- 2. Инициализируем роутер

  // Этот useEffect для загрузки данных остается без изменений
  useEffect(() => {
    getBookingById(bookingId).then(data => setBooking(data));
  }, [bookingId]);

  // ✅ 3. НОВЫЙ useEffect ДЛЯ ПЕРЕНАПРАВЛЕНИЯ
  useEffect(() => {
    // Устанавливаем таймер, который сработает через 5 секунд (5000 миллисекунд)
    const timer = setTimeout(() => {
      router.push('/'); // Перенаправляем на главную страницу
    }, 5000);

    // ВАЖНО: Функция очистки. Если пользователь уйдет со страницы раньше,
    // чем сработает таймер (например, кликнет по ссылке),
    // мы отменим таймер, чтобы избежать ошибок.
    return () => clearTimeout(timer);
    
  }, [router]); // Зависимость от router, чтобы хук имел к нему доступ

  if (!booking) {
    return <div className="text-center">Загружаем детали вашего бронирования...</div>;
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto text-center">
      <AnimatedStatusIcon status="success" />
      <h1 className="text-3xl font-bold font-karantina mt-6">Бронирование подтверждено!</h1>
      <p className="text-gray-600 mt-2">Спасибо, {booking.guestName}! Ваш отдых в Hotel California скоро начнется.</p>
      
      {/* ... (остальная часть с деталями и кнопками остается без изменений) ... */}
  
      {/* ✅ Информационное сообщение для пользователя */}
      <p className="text-center text-xs text-gray-400 mt-6 animate-pulse">
        Вы будете автоматически перенаправлены на гrлавную страницу...
      </p>
    </div>
  );
};
