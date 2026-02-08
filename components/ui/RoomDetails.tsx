// components/ui/RoomDetails.tsx
import React from 'react';

interface RoomDetailsProps {
  description: string;
  amenities: string[]; // <-- Изменено с features на amenities
}

export const RoomDetails = ({ description, amenities }: RoomDetailsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 font-istok-web">Описание</h2>
      <p className="text-gray-700 mb-6 font-inter">{description}</p>

      <h2 className="text-2xl font-bold mb-4 font-istok-web">Удобства</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((item, index) => ( // <-- Изменено
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm text-green-500">✔</span> 
            <span className="font-inter">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
