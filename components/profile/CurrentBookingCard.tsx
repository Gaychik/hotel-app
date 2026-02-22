// components/profile/CurrentBookingCard.tsx
'use client';

import Image from 'next/image';
import type { Booking } from '@/types';
import { useRouter } from 'next/navigation';

interface CurrentBookingCardProps {
    booking: Booking;
    onBookingCancel?: (bookingId: string) => void;
    onBookingChange?: (bookingId:string) => void;
}

export const CurrentBookingCard = ({ booking, onBookingCancel, onBookingChange }: CurrentBookingCardProps) => {


      const router = useRouter();

    const handleChangeBooking = () => {
        // Вот ключевой момент: мы передаем ID комнаты в URL
         const queryParams = new URLSearchParams({
            mode: 'booking',
            roomId: booking.room.id,
            currentBookingId: booking.id, // ID самого бронирования
        });

        router.push(`/calendar?${queryParams.toString()}`);
    };

    const handleCancelBooking = () => {
        onBookingCancel?.(booking.id);
    };

 
    const getStatusInfo = () => {
        switch(booking.status) {
            case 'active': return { text: 'Активно', color: 'text-green-700 bg-green-100' };
            case 'cancelled': return { text: 'Отменено', color: 'text-red-700 bg-red-100' };
            case 'completed': return { text: 'Завершено', color: 'text-blue-700 bg-blue-100' };
            default: return { text: 'Активно', color: 'text-green-700 bg-green-100' };
        }
    };
    
    const status = getStatusInfo();

    return (
        <div className="border rounded-lg shadow-md overflow-hidden bg-white">
            <div className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <Image
                        src={booking.room.images[0]}
                        alt={booking.room.name}
                        width={200}
                        height={150}
                        className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto rounded-lg object-cover"
                    />
                    <div className="flex-1">
                        <p className={`text-sm font-semibold px-2 py-1 rounded-full inline-block ${status.color}`}>
                           {status.text}
                        </p>
                        <h3 className="text-xl sm:text-2xl font-bold mt-2 font-istok-web">{booking.room.name}</h3>
                        <p className="text-gray-500 mt-2 text-sm">Номер брони: <span className="font-mono bg-gray-100 p-1 rounded">{booking.id}</span></p>
                        <p className="font-semibold mt-3 text-lg">
                           {new Date(booking.checkIn).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })} — {new Date(booking.checkOut).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                    onClick={handleChangeBooking}
                    className="w-full sm:w-auto bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-md hover:bg-blue-200 transition"
                >
                    Изменить бронь
                </button>
                <button
                    onClick={handleCancelBooking}
                    className="w-full sm:w-auto bg-red-100 text-red-800 font-semibold py-2 px-4 rounded-md hover:bg-red-200 transition"
                >
                    Отменить бронь
                </button>
            </div>
        </div>
    );
}
