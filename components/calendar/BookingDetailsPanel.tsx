import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { RoomDetails } from '@/components/ui/RoomDetails';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Типы данных для номеров
interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating?: number;
  amenities: string[];
  images?: string[];
  maxOccupancy?: number;
}

// Моковые данные для имитации API
const mockRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Номер "Стандарт"',
    description: 'Отличный выбор для двоих.',
    price: 15000,
    currency: '₽',
    amenities: ['WiFi', 'TV', 'Кондиционер'],
    maxOccupancy: 2
  },
  {
    id: 'room-2',
    name: 'Номер "Делюкс"',
    description: 'Простор и комфорт.',
    price: 25000,
    currency: '₽',
    amenities: ['WiFi', 'TV', 'Балкон', 'Мини-бар'],
    rating: 4.8,
    maxOccupancy: 3
  },
  {
    id: 'room-3',
    name: 'Люкс',
    description: 'Максимум комфорта и роскоши.',
    price: 45000,
    currency: '₽',
    amenities: ['WiFi', 'TV', 'Джакузи', 'Сейф', 'Халаты'],
    rating: 4.9,
    maxOccupancy: 4
  }
];

interface BookingDetailsPanelProps {
  selectedRange: DateRange | undefined;
}

export default function BookingDetailsPanel({ selectedRange }: BookingDetailsPanelProps) {
  if (!selectedRange?.from) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center items-center text-center">
        <h2 className="text-xl font-bold mb-2 font-istok-web">Детали бронирования</h2>
        <p className="text-gray-500">Выберите даты в календаре, чтобы увидеть доступные номера и рассчитать стоимость.</p>
      </div>
    );
  }

  const checkIn = selectedRange.from;
  const checkOut = selectedRange.to;

  // TODO: В будущем заменить на реальный вызов API
  // const [rooms, setRooms] = useState<Room[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // 
  // useEffect(() => {
  //   if (selectedRange?.from && selectedRange?.to) {
  //     fetchRooms(selectedRange);
  //   }
  // }, [selectedRange]);
  // 
  // const fetchRooms = async (range: DateRange) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`/api/rooms?from=${range.from}&to=${range.to}`);
  //     const data = await response.json();
  //     setRooms(data.rooms);
  //   } catch (error) {
  //     console.error('Error fetching rooms:', error);
  //     // В случае ошибки используем моковые данные
  //     setRooms(mockRooms);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Для имитации загрузки данных
  const rooms = mockRooms;
  const loading = false;

  // Состояние для отслеживания выбранного номера
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg h-full">
      <h2 className="text-2xl font-bold mb-4 font-istok-web">Ваш выбор</h2>
      <div className="space-y-4">
        <div>
            <h3 className="font-semibold">Заезд</h3>
            <p className="text-lg text-blue-700">{format(checkIn, 'd MMMM yyyy', { locale: ru })}</p>
        </div>
        {checkOut && (
            <div>
                <h3 className="font-semibold">Выезд</h3>
                <p className="text-lg text-blue-700">{format(checkOut, 'd MMMM yyyy', { locale: ru })}</p>
            </div>
        )}
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="text-xl font-bold mb-4 font-istok-web">Рекомендованные номера</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">Загрузка доступных номеров...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="p-4 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200" onClick={() => setSelectedRoom(room)}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{room.name}</p>
                    <p className="text-sm text-gray-600">{room.description}</p>
                    {room.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-gray-600 ml-1">{room.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-right font-bold text-lg">{room.price.toLocaleString()} {room.currency}</p>
                </div>
                {room.amenities && room.amenities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
        className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedRoom ? 'max-h-screen opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 border rounded-lg bg-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{selectedRoom?.name}</h3>
            <button 
              onClick={() => setSelectedRoom(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <RoomDetails 
            description={selectedRoom?.description || ''} 
            amenities={selectedRoom?.amenities || []} 
          />
          
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedRoom(null)}
            >
              Закрыть
            </button>
            <button 
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => {
                // TODO: Реализовать переход к бронированию
                console.log('Переход к бронированию номера:', selectedRoom?.id);
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
