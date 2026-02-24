// app/rooms/page.tsx

import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import { BackButton } from '@/components/ui/BackButton';
import RoomsList from '@/components/RoomsList'; // ✅ Мы создадим этот новый компонент

// ✅ Это теперь "чистый" серверный компонент, который обеспечивает общую разметку
const RoomsPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-12 lg:px-20">
        {/* Suspense будет ждать, пока дочерний компонент не будет готов на клиенте */}
        <Suspense fallback={
          <div>
            <div className="mb-8 relative flex items-center">
              {/* ... Можно добавить заглушку для заголовка ... */}
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse h-96"></div>
              ))}
            </div>
          </div>
        }>
          {/* ✅ Рендерим компонент, который использует useSearchParams */}
          <RoomsList />
        </Suspense>
      </main>
    </div>
  );
};

export default RoomsPage;
