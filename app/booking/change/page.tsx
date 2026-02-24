// app/booking/change/page.tsx
import { Suspense } from 'react';
import ChangeBookingForm from '@/components/ChangeBookingForm'; // Импортируем новый компонент

export default function ChangeBookingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 text-center">Загрузка...</div>}>
      <ChangeBookingForm />
    </Suspense>
  );
}