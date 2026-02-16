// components/profile/HistoryBookingCard.tsx
'use client';

import Image from 'next/image';
import type { Booking } from '@/types';

export const HistoryBookingCard = ({ booking }: { booking: Booking }) => {
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
                    <h3 className="text-lg font-bold font-istok-web">{booking.room.name}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString('ru-RU')} — {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                    </p>
                </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none bg-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition">Оставить отзыв</button>
                <button className="flex-1 sm:flex-none bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition">Повторить</button>
            </div>
        </div>
    );
}
