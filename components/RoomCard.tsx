// components/RoomCard.tsx

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import type { Room } from '@/data/rooms'; // Импортируем наш тип

// Пропсы для нашего компонента
interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Эффект для запуска/остановки слайдера
  useEffect(() => {
    if (!isHovered) return; // Если мышь не наведена, ничего не делаем

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Меняем фото каждые 2 секунды

    return () => clearInterval(timer); // Очищаем таймер при уходе мыши
  }, [isHovered, room.images.length]);

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0); // Сбрасываем на первое фото при уходе мыши
      }}
    >
      {/* Слайдер изображений */}
      <div className="relative aspect-video w-full">
        <SwitchTransition>
          <CSSTransition
            key={currentImageIndex}
            nodeRef={nodeRef}
            timeout={500}
            classNames="fade"
          >
            <div ref={nodeRef} className="absolute inset-0">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${room.images[currentImageIndex]})` }}
              />
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>

      {/* Информационный блок */}
      <div className="flex flex-grow flex-col p-6">
        <h3 className="text-xl font-bold font-source-serif-pro text-gray-800">{room.name}</h3>
        <p className="mt-2 flex-grow text-sm text-gray-600">{room.description}</p>
        
        {/* Иконки удобств (пока текстом, можно будет заменить на иконки) */}
        <div className="my-4 flex flex-wrap gap-x-4 gap-y-2">
          {room.amenities.map(amenity => (
            <span key={amenity} className="text-xs text-gray-500">{amenity}</span>
          ))}
        </div>

        {/* Цена */}
        <div className="mt-auto">
          <p className="text-lg font-semibold text-gray-900">
            {room.price.toLocaleString('ru-RU')} ₽ <span className="text-sm font-normal text-gray-500">/ ночь</span>
          </p>
        </div>

        {/* Кнопки */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link  className="rounded-lg border border-gray-300 px-4 py-2 text-center font-medium text-gray-700 transition hover:bg-gray-100" href={`/rooms/${room.id}`} passHref>
              Подробнее      
          </Link>
          <Link href={`/booking/${room.id}`} passHref className="w-full rounded-lg bg-gray-800 px-4 py-2 text-center font-medium text-white transition hover:bg-gray-900">
              Выбрать
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
