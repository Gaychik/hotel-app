// components/ui/SearchButton.tsx

import React from 'react';

// Определяем пропсы: иконка, заголовок и текущее значение
interface SearchButtonProps {
  icon: React.ReactNode; // Можем передать любой React-элемент как иконку
  label: string;
  value: string;
  onClick?: () => void; // Необязательная функция для обработки клика
}

const SearchButton: React.FC<SearchButtonProps> = ({ icon, label, value, onClick }) => {
  return (
    <button 
      onClick={onClick}
      // Стили для кнопки: фон, отступы, скругления, тень при наведении.
      // group - специальный класс, чтобы менять стили дочерних элементов при наведении на родителя.
      className="group flex w-full items-center space-x-3 rounded-xl bg-white/50 p-3 text-left transition-all hover:bg-white hover:shadow-md"
    >
      {/* Контейнер для иконки, которая будет увеличиваться при наведении на кнопку */}
      <div className="transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">{value}</p>
      </div>
    </button>
  );
};

export default SearchButton;
