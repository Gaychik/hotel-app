// components/calendar/BookingDetailsPanel.tsx

import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { RoomDetails } from '@/components/ui/RoomDetails';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Room } from '@/data/rooms';
import { getAvailableRoomsByDates } from '@/lib/data';

interface BookingDetailsPanelProps {
  selectedRange: DateRange | undefined;
}

export default function BookingDetailsPanel({ selectedRange }: BookingDetailsPanelProps) {
  if (!selectedRange?.from) {
    return (
      <div className='p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center items-center text-center'>
        <h2 className='text-xl font-bold mb-2 font-istok-web'>Детали бронирования</h2>
        <p className='text-gray-500'>Выберите даты в календаре, чтобы увидеть доступные номера и рассчитать стоимость.</p>
      </div>
    );
  }

  const checkIn = selectedRange.from;
  const checkOut = selectedRange.to;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRange?.from && selectedRange?.to) {
      fetchRooms(selectedRange);
    }
  }, [selectedRange]);

  const fetchRooms = async (range: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      
      // Форматируем даты в строку для передачи в API
      const checkInStr = format(range.from || new Date(), 'yyyy-MM-dd');
      const checkOutStr = format(range.to || new Date(), 'yyyy-MM-dd');
      
      // Получаем доступные номера для указанных дат
      const availableRooms = await getAvailableRoomsByDates(checkInStr, checkOutStr);
      setRooms(availableRooms);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Ошибка при загрузке доступных номеров');
      // В случае ошибки можно показать все номера или пустой список
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Состояние для отслеживания выбранного номера
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <div className='p-6 bg-white rounded-lg shadow-lg h-full'>
      <h2 className='text-2xl font-bold mb-4 font-istok-web'>Ваш выбор</h2>
      <div className='space-y-4'>
        <div>
            <h3 className='font-semibold'>Заезд</h3>
            <p className='text-lg text-blue-700'>{format(checkIn, 'd MMMM yyyy', { locale: ru })}</p>
        </div>
        {checkOut && (
            <div>
                <h3 className='font-semibold'>Выезд</h3>
                <p className='text-lg text-blue-700'>{format(checkOut, 'd MMMM yyyy', { locale: ru })}</p>
            </div>
        )}
      </div>

      <hr className='my-6' />

      <div>
        <h3 className='text-xl font-bold mb-4 font-istok-web'>Доступные номера</h3>
        
        {error && (
          <div className='text-red-500 text-center py-4'>
            {error}
          </div>
        )}
        
        {loading ? (
          <div className='flex justify-center items-center h-32'>
            <p className='text-gray-500'>Загрузка доступных номеров...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className='text-center py-4 text-gray-500'>
            {error ? 'Произошла ошибка' : 'Нет доступных номеров на выбранные даты'}
          </div>
        ) : (
          <div className='space-y-4'>
            {rooms.map((room) => (
              <div 
                key={room.id} 
                className='p-4 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200' 
                onClick={() => setSelectedRoom(room)}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-bold'>{room.name}</p>
                    <p className='text-sm text-gray-600'>{room.description}</p>
                  </div>
                  <p className='text-right font-bold text-lg'>{room.price.toLocaleString()} ₽</p>
                </div>
                {room.amenities && room.amenities.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Плавно раскрывающаяся детальная информация о номере */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedRoom ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className='p-4 border rounded-lg bg-white shadow-lg'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-bold'>{selectedRoom?.name}</h3>
            <button 
              onClick={() => setSelectedRoom(null)}
              className='text-gray-500 hover:text-gray-700'
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>
          
          <RoomDetails 
            description={selectedRoom?.description || ''} 
            amenities={selectedRoom?.amenities || []} 
          />
          
          <div className='mt-6 flex justify-end space-x-4'>
            <button 
              className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
              onClick={() => setSelectedRoom(null)}
            >
              Закрыть
            </button>
            <button 
              className='px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'
              onClick={() => {
                // Перенаправляем на страницу бронирования с параметрами
                const checkInStr = format(checkIn, 'yyyy-MM-dd');
                const checkOutStr = format(checkOut || new Date(), 'yyyy-MM-dd');
                window.location.href = `/booking?roomId=${selectedRoom?.id}&checkIn=${checkInStr}&checkOut=${checkOutStr}`;
              }}
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
