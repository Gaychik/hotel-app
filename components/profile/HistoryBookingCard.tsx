// components/profile/HistoryBookingCard.tsx
'use client';

import Image from 'next/image';
import type { Booking } from '@/types';

// Функция для получения цвета и текста статуса
const getStatusInfo = (status: Booking['status']) => {
    switch(status) {
        case 'cancelled': return { text: 'Отменено', color: 'text-red-700 bg-red-100' };
        case 'completed': return { text: 'Завершено', color: 'text-blue-700 bg-blue-100' };
        default: return null; // Для старых бронирований без статуса
    }
};

interface HistoryBookingCardProps {
  booking: Booking;
  onLeaveReview: (booking: Booking) => void; // ✅ НОВЫЙ ПРОПС
}
export const HistoryBookingCard = ({ booking, onLeaveReview }: HistoryBookingCardProps) => {
    const statusInfo = getStatusInfo(booking.status);

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <Image
                    src={booking.room.images[0]}
                    alt={booking.room.name}
                    width={120}
                    height={90}
                    className="w-full sm:w-32 h-32 sm:h-24 rounded-md object-cover"
                />
                <div className="text-center sm:text-left">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                         <h3 className="text-lg font-bold font-istok-web">{booking.room.name}</h3>
                         {/* Ярлык статуса */}
                         {statusInfo && (
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusInfo.color}`}>
                                {statusInfo.text}
                            </span>
                         )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(booking.checkIn).toLocaleDateString('ru-RU')} — {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                    </p>
                </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                {/* Кнопка "Оставить отзыв" только для завершенных */}
                {booking.status === 'completed' && (
                     <button className="flex-1 sm:flex-none bg-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition"
                     onClick={() => onLeaveReview(booking)}
                     >Оставить отзыв</button>
                )}
                <button className="flex-1 sm:flex-none bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition">Повторить</button>
            </div>
        </div>
    );
}

