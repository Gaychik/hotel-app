// components/FavoritesList.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Room } from '@/types';
import { roomsData } from '@/data/rooms';

interface FavoritesListProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ isOpen, onClose }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteRooms, setFavoriteRooms] = useState<Room[]>([]);

  const router = useRouter();

  // Загружаем избранные номера из localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  // Обновляем список избранных номеров при изменении favorites
  useEffect(() => {
    const favoriteRoomsList = roomsData.filter(room => favorites.includes(room.id));
    setFavoriteRooms(favoriteRoomsList);
  }, [favorites]);

  const removeFromFavorites = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newFavorites = favorites.filter(id => id !== roomId);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const goToRoomDetails = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-istok-web">Избранные номера</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Закрыть"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {favoriteRooms.length === 0 ? (
            <div className="text-center py-12">
              <HeartSolidIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">У вас пока нет избранных номеров</p>
              <p className="text-gray-400 mt-2">Начните добавлять номера в избранное, нажимая на сердечко</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRooms.map((room) => (
                <div 
                  key={room.id}
                  className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => goToRoomDetails(room.id)}
                >
                  <div className="relative">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${room.images[0]})` }}
                    />
                    <button
                      onClick={(e) => removeFromFavorites(room.id, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors duration-200"
                      aria-label="Удалить из избранного"
                    >
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 truncate">{room.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{room.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="mt-3 font-semibold text-gray-900">
                      {room.price.toLocaleString('ru-RU')} ₽ <span className="text-sm font-normal text-gray-500">/ ночь</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesList;