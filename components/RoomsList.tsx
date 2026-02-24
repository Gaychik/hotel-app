// components/RoomsList.tsx
'use client'; // ✅ Этот компонент будет клиентским

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RoomCard from '@/components/RoomCard';
import { getRooms } from '@/lib/data';
import type { Room } from '@/types';
import { RoomCardSkeleton } from '@/components/ui/RoomCardSkeleton';
import { BackButton } from '@/components/ui/BackButton';
import Header from './layout/Header';

export default function RoomsList() {
   const searchParams = useSearchParams(); // <-- Получаем доступ к URL параметрам
  const guestsParam = searchParams.get('guests'); // <-- Читаем параметр 'guests'
  
  // Преобразуем параметр в число. Если его нет, по умолчанию 0 (покажем все)
  const requiredCapacity = guestsParam ? parseInt(guestsParam, 10) : 0;

  // ✅ УПРАВЛЯЕМ СОСТОЯНИЕМ ДАННЫХ, ЗАГРУЗКИ И ОШИБОК
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ ИСПОЛЬЗУЕМ useEffect ДЛЯ ВЫЗОВА API-ФУНКЦИИ
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedRooms = await getRooms(requiredCapacity);
        setRooms(fetchedRooms);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить номера. Попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [requiredCapacity]); // Перезапрашиваем данные, если изменился параметр 'guests'

  
  const renderContent = () => {
    // 1. Если идет загрузка, показываем скелетоны
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Создаем массив из 3-х элементов для рендеринга скелетонов */}
          {Array.from({ length: 3 }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
        </div>
      );
    }
    
    // 2. Если есть ошибка
    if (error) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow">
                 <h2 className="text-2xl font-bold text-red-600">Произошла ошибка</h2>
                 <p className="text-gray-500 mt-2">{error}</p>
            </div>
        );
    }

    // 3. Если данные загружены, но массив пуст (ничего не найдено)
    if (rooms.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800">Ничего не найдено</h2>
          <p className="text-gray-500 mt-2">
            К сожалению, у нас нет номеров, вмещающих {requiredCapacity} гостей.
          </p>
           <button 
              onClick={() => window.location.href = '/rooms'}
              className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Показать все номера
            </button>
        </div>
      );
    }

    // 4. Если все хорошо, показываем карточки
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12 lg:px-20">
        <div className="mb-8 relative flex items-center">
            <BackButton />
            <div className="ml-16">
                 <h1 className="text-4xl font-bold font-source-serif-pro text-gray-800">
                    {requiredCapacity > 0 ? `Номера для ${requiredCapacity} гостей` : 'Все доступные номера'}
                </h1>
            </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
