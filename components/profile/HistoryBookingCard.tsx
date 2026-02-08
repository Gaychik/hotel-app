// components/profile/HistoryBookingCard.tsx
import Image from 'next/image';
import type { Booking } from '@/types';

export const HistoryBookingCard = ({ booking }: { booking: Booking }) => {
    return (
        <div className="border rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex gap-4 items-center">
                <Image src={booking.room.images[0]} alt={booking.room.name} width={120} height={90} className="rounded-md object-cover"/>
                <div>
                    <h3 className="text-lg font-bold">{booking.room.name}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                </div>
             </div>
             <div className="flex gap-3">
                <button className="bg-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Оставить отзыв</button>
                <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">Повторить</button>
             </div>
        </div>
    )
}
