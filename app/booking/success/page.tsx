// app/booking/success/page.tsx
'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getBookingById } from '@/lib/data';

type Booking = Awaited<ReturnType<typeof getBookingById>>;

const ConfirmationDetails = () => {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (bookingId) {
            getBookingById(bookingId).then(data => setBooking(data));
        }
    }, [bookingId]);

    if (!bookingId) {
        return <div className="text-center"><h1 className="font-bold text-xl">Ошибка: ID бронирования не найден.</h1></div>;
    }
    if (!booking) {
        return <div className="text-center">Загружаем детали вашего бронирования...</div>;
    }
    
    return (
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto text-center">
            {/* Статус */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold font-karantina mt-4">Бронирование подтверждено!</h1>
            <p className="text-gray-600 mt-2">Спасибо, {booking.guestName}! Ваш отдых в Hotel California скоро начнется.</p>
            
            {/* Номер брони */}
            <div className="mt-6 bg-gray-50 border-dashed border-2 rounded-lg p-4">
                <p className="text-sm text-gray-500">Номер вашего бронирования</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{booking.id}</p>
            </div>
            
            {/* Краткая сводка */}
            <div className="mt-6 text-left border-t pt-6 space-y-3">
                <h3 className="font-bold text-lg text-center mb-4">Детали поездки</h3>
                <div className="flex justify-between">
                    <span className="text-gray-600">Номер:</span>
                    <span className="font-semibold">{booking.room.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Даты:</span>
                    <span className="font-semibold">{format(new Date(booking.checkIn), 'd MMM')} - {format(new Date(booking.checkOut), 'd MMM yyyy', { locale: ru })}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Итоговая стоимость:</span>
                    <span className="font-semibold">{booking.totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
            </div>

            {/* Кнопки действий */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/profile" className="md:col-span-2 w-full bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-800">
                    Перейти в личный кабинет
                </Link>
                <button onClick={() => alert('Загрузка чека...')} className="bg-gray-100 hover:bg-gray-200 font-semibold py-3 rounded-lg transition-colors">Скачать чек</button>
                <button onClick={() => alert('Связь с отелем...')} className="bg-gray-100 hover:bg-gray-200 font-semibold py-3 rounded-lg transition-colors">Связаться</button>
            </div>
        </div>
    );
};

const SuccessPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <Suspense fallback={<div className="text-center">Загрузка...</div>}>
                <ConfirmationDetails />
            </Suspense>
        </div>
    );
}

export default SuccessPage;
