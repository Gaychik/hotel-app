import SmartCalendar from '@/components/calendar/SmartCalendar';
import { Suspense } from 'react';

export default function CalendarPage() {
  return (
    <main className="container mx-auto py-8">
      {/* 
        Suspense - это хорошая практика. 
        Он покажет "Загрузка...", пока основной компонент SmartCalendar (который является клиентским) подгружается.
      */}
      <Suspense fallback={<div className="text-center text-lg">Загрузка календаря...</div>}>
        <SmartCalendar />
      </Suspense>
    </main>
  );
}
