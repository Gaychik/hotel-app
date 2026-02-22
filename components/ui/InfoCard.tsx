// components/ui/InfoCard.tsx
'use client'; // Этот компонент теперь интерактивен, т.к. использует хуки

import React from 'react';
import { useInView } from 'react-intersection-observer';

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
  // ✅ Добавляем опциональный стиль для задержки анимации
  style?: React.CSSProperties; 
  onClick?: () => void; // ✅ Добавляем onClick
}

const InfoCard: React.FC<InfoCardProps> = ({ children, className = '', style, onClick }) => {
  const { ref, inView } = useInView({
    // ✅ Настройки для анимации:
    triggerOnce: true, // Анимация сработает только один раз
    threshold: 0.1,    // Сработает, когда 10% карточки будет видно
  });

  return (
    <div
      ref={ref} // 1. Привязываем ref к нашему div
      style={style} // 2. Применяем стиль с задержкой
       onClick={onClick}
      // 3. Динамически меняем классы в зависимости от видимости
      className={`
        ${onClick ? 'cursor-pointer' : ''} 
        relative bg-gray-50 rounded-2xl p-8 shadow-sm 
        transition-all duration-700 ease-in-out  // Плавный переход для всех свойств
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} // Анимация "всплытия"
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default InfoCard;
