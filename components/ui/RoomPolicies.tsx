import React from 'react';

// Предположим, что данные об условиях приходят в таком формате
interface Policies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  pets: string;
}

interface RoomPoliciesProps {
  policies: Policies;
}

export const RoomPolicies = ({ policies }: RoomPoliciesProps) => {
  return (
    <div className="mt-6 border-t pt-6">
      <h2 className="text-2xl font-bold mb-4 font-istok-web">Условия</h2>
      <ul className="space-y-3">
        <li className="flex items-center">
          <span className="w-28 font-semibold">Заезд:</span>
          <span className="font-inter">{policies.checkIn}</span>
        </li>
        <li className="flex items-center">
          <span className="w-28 font-semibold">Выезд:</span>
          <span className="font-inter">{policies.checkOut}</span>
        </li>
        <li className="flex items-center">
          <span className="w-28 font-semibold">Отмена:</span>
          <span className="font-inter">{policies.cancellation}</span>
        </li>
         <li className="flex items-center">
          <span className="w-28 font-semibold">Животные:</span>
          <span className="font-inter">{policies.pets}</span>
        </li>
      </ul>
    </div>
  );
};
