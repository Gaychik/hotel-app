// app/booking/page.tsx
'use client'; // Эта страница интерактивна, делаем ее клиентским компонентом

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingForm } from '@/components/BookingForm'; // Мы создадим этот компонент ниже
import { BackButton } from '@/components/ui/BackButton'; 
// Обертка для получения searchParams, т.к. их нужно "читать" в Suspense
const BookingPageContent = () => {
    const searchParams = useSearchParams();
    
    const roomId = searchParams.get('roomId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    // Простая валидация, в реальности может быть сложнее
    if (!roomId || !checkIn || !checkOut) {
        return (
            <div className="container mx-auto text-center py-20">
                <h1 className="text-2xl font-bold">Ошибка бронирования</h1>
                <p>Недостаточно данных для оформления. Пожалуйста, выберите номер и даты заново.</p>
            </div>
        );
    }
    
    return <BookingForm roomId={roomId} checkIn={checkIn} checkOut={checkOut} />;
}

// Экспортируемая страница
const BookingPage = () => {
  return (
    // Suspense необходим для работы useSearchParams в App Router
   <div className="relative">
        <BackButton />
        <Suspense fallback={<div className="container mx-auto text-center py-20">Загрузка данных о бронировании...</div>}>
            <BookingPageContent />
        </Suspense>
    </div>
  );
};

export default BookingPage;
