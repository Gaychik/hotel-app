// components/RoomCard.tsx
'use client'; // CRITICAL: Обязательно для использования хуков и localStorage

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import type { Room } from '@/types'; // Импортируем наш тип
import { useRouter } from 'next/navigation';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon } from '@heroicons/react/24/solid';
// Пропсы для карточки номера
interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Загружаем статус избранного из localStorage при монтировании
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(room.id));
  }, [room.id]);

  // Переключаем статус избранного
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем клик по всей карточке
    
    const favorites: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites: string[];
    
    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== room.id);
    } else {
      newFavorites = [...favorites, room.id];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleClick = () => {
    router.push(`/rooms/${room.id}`);
  };

  // Логика для запуска/остановки авто-слайдера
  useEffect(() => {
    if (!isHovered) return; // Если курсор не наведен, ничего не делаем

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Смена фото каждые 2 секунды

    return () => clearInterval(timer); // Очищаем таймер при уходе мыши
  }, [isHovered, room.images.length]);

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0); // Сбрасываем на первое фото при уходе мыши
      }}
      onClick={handleClick}
    >
      {/* Блок изображения */}
      <div className='relative aspect-video w-full'>
        <SwitchTransition>
          <CSSTransition
            key={currentImageIndex}
            nodeRef={nodeRef}
            timeout={500}
            classNames='fade'
          >
            <div ref={nodeRef} className='absolute inset-0'>
              <div
                className='h-full w-full bg-cover bg-center'
                style={{ backgroundImage: `url(${room.images[currentImageIndex]})` }}
              />
            </div>
          </CSSTransition>
        </SwitchTransition>
        
        {/* Кнопка избранного */}
        <button
          onClick={toggleFavorite}
          className='absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 transform hover:scale-110 active:scale-95'
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          {isFavorite ? (
            <HeartSolidIcon className='h-5 w-5 text-red-500' />
          ) : (
            <HeartIcon className='h-5 w-5 text-gray-600' />
          )}
        </button>
      </div>

      {/* Информационная часть */}
      <div className='flex flex-grow flex-col p-6'>
        <h3 className='text-xl font-bold font-source-serif-pro text-gray-800'>{room.name}</h3>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <UserGroupIcon className="h-5 w-5 text-gray-400" />
            <span>до {room.capacity} гостей</span>
        </div>

        <p className='mt-2 flex-grow text-sm text-gray-600 line-clamp-2'>{room.description}</p>
        
        {/* Блок удобств */}     
        <div className='my-4 flex flex-wrap gap-x-4 gap-y-2'>
          {room.amenities.slice(0, 4).map(amenity => ( // Показываем только первые 4 для чистоты
            <span key={amenity} className='text-xs text-gray-500'>{amenity}</span>
          ))}
        </div>

        {/* Цена */}
        <div className='mt-auto'>
          <p className='text-lg font-semibold text-gray-900'>
            {room.price.toLocaleString('ru-RU')}₽ <span className='text-sm font-normal text-gray-500'>/ ночь</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

