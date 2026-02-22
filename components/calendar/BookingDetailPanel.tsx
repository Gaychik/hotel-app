// components/calendar/BookingDetailsPanel.tsx
'use client';

import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Room } from '@/types';
import { getAvailableRoomsByDates } from '@/lib/data';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ChevronUpIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image'; 

const AvailableRoomCard = ({ room }: { room: Room }) => {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleGoToRoom = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/rooms/${room.id}`);
    };

    return (
        <CSSTransition timeout={300} classNames="room-item">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* ✅ 2. Основная часть теперь - это flex-контейнер */}
                <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-start gap-4">
                        {/* ✅ 3. Добавляем изображение номера */}
                        <div className="flex-shrink-0">
                            <Image
                                src={room.images[0]}
                                alt={room.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover aspect-square"
                            />
                        </div>
                        
                        {/* Контейнер для текста, чтобы он занял оставшееся место */}
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-800">{room.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">до {room.capacity} гостей</p>
                                </div>
                                <p className="text-right font-bold text-lg text-gray-900 whitespace-nowrap ml-2">
                                    {room.price.toLocaleString('ru-RU')} ₽
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Раскрывающаяся детальная часть (остается без изменений) */}
                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                        <div className="flex justify-between items-center">
                            {/* Кнопка "Свернуть" */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Свернуть"
                            >
                                <ChevronUpIcon className="h-6 w-6 text-gray-600" />
                            </button>
                            {/* Кнопка "Перейти" */}
                            <button
                                onClick={handleGoToRoom}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
                            >
                                <span>Перейти</span>
                                <ArrowRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
};

// Основной компонент панели
export default function BookingDetailsPanel({ selectedRange }: { selectedRange: DateRange | undefined }) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedRange?.from && selectedRange?.to) {
            const fetchRooms = async () => {
                setLoading(true);
                setError(null);
                try {
                    const checkInStr = format(selectedRange.from!, 'yyyy-MM-dd');
                    const checkOutStr = format(selectedRange.to!, 'yyyy-MM-dd');
                    const availableRooms = await getAvailableRoomsByDates(checkInStr, checkOutStr);
                    setRooms(availableRooms);
                } catch (err) {
                    setError('Ошибка при загрузке номеров');
                } finally {
                    setLoading(false);
                }
            };
            fetchRooms();
        } else {
            setRooms([]); // Очищаем список, если даты сброшены
        }
    }, [selectedRange]);

    if (!selectedRange?.from) {
        return (
            <div className='p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center items-center text-center'>
                <h2 className='text-xl font-bold mb-2 font-istok-web'>Детали бронирования</h2>
                <p className='text-gray-500'>Выберите даты в календаре, чтобы увидеть доступные номера.</p>
            </div>
        );
    }
    
    return (
        <div className='p-4 md:p-6 bg-white rounded-lg shadow-lg h-full'>
            <h2 className='text-2xl font-bold mb-4 font-istok-web'>Доступные номера</h2>
            
            {loading && <p className="text-center text-gray-500 py-4">Загрузка...</p>}
            {error && <p className="text-center text-red-500 py-4">{error}</p>}
            
            {!loading && !error && rooms.length === 0 && (
                 <p className="text-center text-gray-500 py-4">Нет доступных номеров на выбранные даты.</p>
            )}
            
            {/* ✅ КОНТЕЙНЕР ДЛЯ АНИМИРОВАННОГО СПИСКА */}
            <TransitionGroup className="space-y-4">
                {rooms.map((room) => (
                    // Оборачиваем каждую карточку в CSSTransition для индивидуальной анимации
                    <CSSTransition key={room.id} timeout={300} classNames="room-item">
                        <AvailableRoomCard room={room} />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
}
