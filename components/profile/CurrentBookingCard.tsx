// components/profile/CurrentBookingCard.tsx
import Image from 'next/image';
import type { Booking } from '@/types'; // Предположим, вы вынесете типы в отдельный файл

export const CurrentBookingCard = ({ booking }: { booking: Booking }) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <Image src={booking.room.images[0]} alt={booking.room.name} width={200} height={150} className="rounded-lg object-cover"/>
                    <div>
                        <p className="text-sm text-green-600 font-semibold">Активно</p>
                        <h3 className="text-2xl font-bold mt-1">{booking.room.name}</h3>
                        <p className="text-gray-600 mt-2">Номер брони: <span className="font-mono">{booking.id}</span></p>
                        <p className="font-semibold mt-2">
                            {new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-3">
                <button className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-md hover:bg-blue-200">Изменить бронь</button>
                <button className="bg-red-100 text-red-800 font-semibold py-2 px-4 rounded-md hover:bg-red-200">Отменить бронь</button>
            </div>
        </div>
    )
}
