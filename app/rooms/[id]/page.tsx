// app/rooms/[id]/page.tsx

import { getRoomById, getAllRooms } from '@/lib/data';
import { notFound } from 'next/navigation';

// Импортируем UI компоненты
import { ImageGallery } from '@/components/ui/ImageGallery';
import { RoomDetails } from '@/components/ui/RoomDetails';
import { RoomPolicies } from '@/components/ui/RoomPolicies';
import { BookingWidget } from '@/components/ui/BookingWidget';

interface PageProps {
  params: { id: string };
}

// Это самый стандартный и правильный способ для Next.js App Router
export default async function RoomDetailPage({ params }: PageProps) {
  const { id } = params;

  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold font-karantina mb-2">{room.name}</h1>
      <p className="text-gray-600 mb-8">Hotel California</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <ImageGallery images={room.images} />
          <div className="mt-8">
            <RoomDetails description={room.description} amenities={room.amenities} />
          </div>
          <div className="mt-8">
            <RoomPolicies policies={room.policies} />
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0">
          <BookingWidget pricePerNight={room.price} roomId={room.id} />
        </div>
      </div>
    </div>
  );
}

// generateStaticParams остается без изменений
export async function generateStaticParams() {
  const rooms = await getAllRooms(); 
  if (!rooms) return [];
  return rooms.map((room) => ({ id: room.id }));
}
