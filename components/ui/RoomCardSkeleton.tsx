// components/ui/RoomCardSkeleton.tsx
import React from 'react';

export const RoomCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* Блок изображения-скелетона */}
      <div className="aspect-video w-full bg-gray-200 animate-pulse"></div>
      
      {/* Информационная часть-скелетон */}
      <div className='flex flex-grow flex-col p-6'>
        {/* Заголовок-скелетон */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        
        {/* Вместимость-скелетон */}
        <div className="flex items-center gap-2 mt-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Описание-скелетон */}
        <div className="mt-3 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Удобства-скелетоны */} 
        <div className='my-5 flex flex-wrap gap-x-4 gap-y-2'>
          <div className="h-3 w-12 bg-gray-200 rounded-sm animate-pulse"></div>
          <div className="h-3 w-16 bg-gray-200 rounded-sm animate-pulse"></div>
          <div className="h-3 w-14 bg-gray-200 rounded-sm animate-pulse"></div>
        </div>
        
        {/* Цена-скелетон */}
        <div className='mt-auto'>
           <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
