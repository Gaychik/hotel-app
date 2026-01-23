// components/ui/InfoCard.tsx

import React from 'react';

// Определяем, какие пропсы (свойства) может принимать наша карточка
interface InfoCardProps {
  children: React.ReactNode; // `children` - это всё, что мы положим внутрь карточки
  className?: string;        // Необязательный класс для дополнительной стилизации
}

const InfoCard: React.FC<InfoCardProps> = ({ children, className = '' }) => {
  return (
    // Вот и сам "фрейм". 
    // Мы добавляем фон, скругленные углы, тени и отступы.
    <div className={` relative  bg-gray-50 rounded-2xl p-8 shadow-sm transition-shadow hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default InfoCard;
