// components/calendar/SmartCalendar.tsx

'use client';

import { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ru } from 'date-fns/locale'; // NEW: Импорт русской локали

import CalendarDayContent from '@/components/calendar/CalendarDayContent';
import BookingDetailsPanel from '@/components/calendar/BookingDetailsPanel';
import { XMarkIcon } from '@heroicons/react/24/solid';

const useIsDesktop = () => {
    // ... (этот хук остается без изменений)
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleResize = () => setIsDesktop(mediaQuery.matches);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isDesktop;
};

export default function SmartCalendar() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const isDesktop = useIsDesktop();

  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
     if(showMobilePanel) {
        setShowMobilePanel(false); // Скрываем панель, если пользователь меняет даты
    }
  };
  
  const isRangeSelected = range?.from && range?.to;

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 p-4 w-full">
      {/* CHANGED: Обертка для увеличения календаря на ПК */}
      <div className="flex-grow lg:max-w-4xl lg:mx-auto">
        <h1 className="text-3xl font-bold mb-4 font-karantina">Выберите даты вашего отдыха</h1>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleDateSelect}
            numberOfMonths={isDesktop ? 2 : 1}
            pagedNavigation
            locale={ru} // NEW: Применяем русскую локализацию
            weekStartsOn={1} // NEW: Неделя начинается с понедельника
            components={{
              DayContent: CalendarDayContent,
            }}
            disabled={{ before: new Date() }} 
            className="w-full"
            
           classNames={{
              root: 'w-full',
              months: 'flex flex-col sm:flex-row w-full justify-center gap-x-16', // Увеличили разрыв между месяцами
              month: 'w-full', // Убрали лишний space-y-4
              caption: 'flex justify-center items-center relative text-xl font-bold h-12 capitalize',
              
              // Создаем grid-сетку, которая заставит ячейки быть большими
              head_row: 'grid grid-cols-7 mb-1',
              head_cell: 'text-gray-500 text-sm font-semibold text-center p-2',
              row: 'grid grid-cols-7', // Каждая неделя - это тоже grid
              cell: 'p-0', // Убираем все внутренние отступы
              day: 'w-full h-14 flex items-center justify-center', // Прижимаем ячейки друг к другу и задаем фиксированную высоту
              day_outside: 'opacity-20 pointer-events-none', // Делаем дни другого месяца некликабельными
            }}
          />

              {/* --- NEW: Легенда для Heatmap --- */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span>Дешевле</span>
                    <div className="w-4 h-4 rounded bg-green-100"></div>
                    <div className="w-4 h-4 rounded bg-green-200"></div>
                    <div className="w-4 h-4 rounded bg-green-300"></div>
                    <div className="w-4 h-4 rounded bg-green-400"></div>
                    <span>Дороже</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Мало номеров</span>
                </div>
              </div>
           </div>
            
         

        {/* --- Кнопка для мобильной версии --- */}
        {isRangeSelected && !isDesktop && !showMobilePanel && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t z-20">
            <button
              onClick={() => setShowMobilePanel(true)}
             className="
                w-full bg-black text-white font-bold py-3 px-4 rounded-lg shadow-lg 
                transition-all duration-300 ease-in-out 
                transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Посмотреть предложения
            </button>
          </div>
        )}
      </div>

      {/* --- Панель с предложениями (ПК) --- */}
      {isDesktop && (
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <BookingDetailsPanel selectedRange={range} />
        </div>
      )}

      {/* --- Панель с предложениями (Мобильная, всплывающая) --- */}
      {!isDesktop && showMobilePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-md h-4/5 overflow-y-auto relative">
                <button 
                    onClick={() => setShowMobilePanel(false)} 
                    className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-40"
                >
                    <XMarkIcon className="h-6 w-6 text-gray-700" />
                </button>
                <BookingDetailsPanel selectedRange={range} />
            </div>
        </div>
      )}
  </div>
  );
}
