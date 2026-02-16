// app/rooms/page.tsx
"use client"
import React from 'react';
import Header from '@/components/layout/Header';
import RoomCard from '@/components/RoomCard'; // Мы создадим этот компонент на следующем шаге
import { roomsData } from '@/data/rooms'; // И эти данные тоже
import { BackButton } from '@/components/ui/BackButton';

const RoomsPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12 lg:px-20">
        <div className="mb-8 relative">
          <BackButton />
          <h1 className="text-4xl font-bold font-source-serif-pro text-gray-800">
            Доступные номера
          </h1>
        </div>

        {/* Сетка для наших карточек */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {roomsData.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default RoomsPage;
