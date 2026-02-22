// components/calendar/SmartCalendar.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ru } from 'date-fns/locale'; // NEW: Импорт русской локали
import { useSearchParams, useRouter } from 'next/navigation';
import CalendarDayContent from '@/components/calendar/CalendarDayContent';
import BookingDetailsPanel from '@/components/calendar/BookingDetailPanel';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { format, parseISO, isValid } from 'date-fns'; 
import { getDisabledDates } from '@/lib/data'; // <-- 1. Импортируем нашу новую функцию
import toast from 'react-hot-toast'; // <-- 2. Импортируем toast

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

  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookingMode, setBookingMode] = useState(false);

  const [range, setRange] = useState<DateRange | undefined>();
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const isDesktop = useIsDesktop();
 // ✅ 3. НОВОЕ СОСТОЯНИЕ ДЛЯ ЗАБЛОКИРОВАННЫХ ДАТ
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);

    // ✅ 4. ЗАГРУЖАЕМ ЗАБЛОКИРОВАННЫЕ ДАТЫ ПРИ МОНТИРОВАНИИ
    useEffect(() => {
        getDisabledDates().then(dates => {
            setDisabledDates(dates);
        });
    }, []);


    const initialRange = useMemo(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    const from = checkIn && isValid(parseISO(checkIn)) ? parseISO(checkIn) : undefined;
    const to = checkOut && isValid(parseISO(checkOut)) ? parseISO(checkOut) : undefined;
    
    if(from || to) {
        return { from, to };
    }
    return undefined;
  }, [searchParams]);





 useEffect(() => {
        const roomId = searchParams.get('roomId');
        const currentBookingId = searchParams.get('currentBookingId');

        // Логика стала проще и надежнее: если мы знаем, КАКОЙ номер бронировать (roomId)
        // или КАКОЕ бронирование изменять (currentBookingId),
        // то это всегда "режим бронирования".
        if (roomId || currentBookingId) {
            setBookingMode(true);
        } else {
            setBookingMode(false);
        }
        
        // Мы больше не зависим от параметра `mode=booking`,
        // что делает компонент более устойчивым.

    }, [searchParams]); // Зависимость только от searchParams


  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);

    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

    if (selectedRange?.from) {
        currentParams.set('checkIn', format(selectedRange.from, 'yyyy-MM-dd'));
    } else {
        currentParams.delete('checkIn');
    }

    if (selectedRange?.to) {
        currentParams.set('checkOut', format(selectedRange.to, 'yyyy-MM-dd'));
    } 
    
    else {
        currentParams.delete('checkOut');
    }

    if(showMobilePanel) {
        setShowMobilePanel(false); // Скрываем панель, если пользователь меняет даты
    } 
    // "Мелкая" маршрутизация: меняем URL без перезагрузки страницы
    router.push(`/calendar?${currentParams.toString()}`, { scroll: false });
  };


  
  const handleConfirmBooking = () => {
        if (!range?.from || !range?.to) return;
    
        const roomId = searchParams.get('roomId');
        const currentBookingId = searchParams.get('currentBookingId');

        const queryParams = new URLSearchParams({
            roomId: roomId || '',
            checkIn: format(range.from, 'yyyy-MM-dd'),
            checkOut: format(range.to, 'yyyy-MM-dd'),
        });

        if (currentBookingId) {
            queryParams.set('currentBookingId', currentBookingId);
            router.push(`/booking/change?${queryParams.toString()}`);
        } else {
            router.push(`/booking?${queryParams.toString()}`);
        }
    };

  const isRangeSelected = range?.from && range?.to;
// ✅ 5. ОБРАБОТЧИК КЛИКА ПО КОНКРЕТНОМУ ДНЮ
    const handleDayClick = (day: Date, modifiers: { disabled?: boolean }) => {
        if (modifiers.disabled) {
            toast.error('Эта дата недоступна для бронирования');
        }
    };
  return (
    <div className="relative flex flex-col lg:flex-row lg:space-x-8 p-4 pt-20 w-full pb-24"> 
      {/* CHANGED: Обертка для увеличения календаря на ПК */}
      <div className="flex-grow lg:max-w-4xl lg:mx-auto">
         <h1 className="text-3xl font-bold mb-4 font-karantina text-center lg:text-left">
          {bookingMode && searchParams.get('currentBookingId') ? 'Измените даты бронирования' : bookingMode ? 'Выберите даты для номера' : 'Выберите даты вашего отдыха'}
        </h1>
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
            
            className="w-full"
            
           classNames={{
              root: 'w-full',
              months: 'flex flex-col sm:flex-row w-full justify-center gap-x-16', // РЈРІРµР»РёС‡РёР»Рё СЂР°Р·СЂС‹РІ РјРµР¶РґСѓ РјРµСЃСЏС†Р°РјРё
              month: 'w-full', // РЈР±СЂР°Р»Рё Р»РёС€РЅРёР№ space-y-4
              caption: 'flex justify-center items-center relative text-xl font-bold h-12 capitalize',
              
              // Создаем grid-сетку, которая заставит ячейки быть большими
              head_row: 'grid grid-cols-7 mb-1',
              head_cell: 'text-gray-500 text-sm font-semibold text-center p-2',
              row: 'grid grid-cols-7', // РљР°Р¶РґР°СЏ РЅРµРґРµР»СЏ - СЌС‚Рѕ С‚РѕР¶Рµ grid
              cell: 'p-0', // Убираем все внутренние отступы
              day: 'w-full h-14 flex items-center justify-center', // РџСЂРёР¶РёРјР°РµРј СЏС‡РµР№РєРё РґСЂСѓРі Рє РґСЂСѓРіСѓ Рё Р·Р°РґР°РµРј С„РёРєСЃРёСЂРѕРІР°РЅРЅСѓСЋ РІС‹СЃРѕС‚Сѓ
              day_outside: 'opacity-20 pointer-events-none', // Делаем дни другого месяца некликабельными
            }}
               // ✅ 6. ПЕРЕДАЕМ ЗАБЛОКИРОВАННЫЕ ДАТЫ В КАЛЕНДАРЬ
                    // DayPicker теперь не позволит выбрать диапазон, пересекающий эти даты
              disabled={[
                        { before: new Date() }, // Отключаем прошлые даты
                        ...disabledDates       // Отключаем забронированные даты
                    ]}
                    
                    // ✅ 7. ИСПОЛЬЗУЕМ НАШ ОБРАБОТЧИК КЛИКА
                    onDayClick={handleDayClick}
          />

              {/* --- NEW: Р›РµРіРµРЅРґР° РґР»СЏ Heatmap --- */}
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
          
      </div>
            
       {/* --- Панель с предложениями (ПК) --- */}
      {isDesktop && !bookingMode && (
                <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
                    <BookingDetailsPanel selectedRange={range} />
                </div>
            )}

   
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t z-20">
                <div className="max-w-4xl mx-auto">

                    {/* КНОПКА "ПОДТВЕРДИТЬ" ДЛЯ ЦЕЛЕВОГО РЕЖИМА (РАБОТАЕТ ВЕЗДЕ) */}
                    {bookingMode && isRangeSelected && (
                        <button onClick={handleConfirmBooking} className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95">
                            Подтвердить даты
                        </button>
                    )}

                    {/* КНОПКА "ПОСМОТРЕТЬ" ДЛЯ СВОБОДНОГО ПОИСКА (ТОЛЬКО МОБИЛЬНЫЕ) */}
                    {!bookingMode && !isDesktop && isRangeSelected && (
                        <button onClick={() => setShowMobilePanel(true)} className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95">
                            Посмотреть предложения
                        </button>
                    )}
                </div>
            </div>

      {/* --- Панель с предложениями (Мобильная, всплывающая) --- */}
      {!bookingMode && !isDesktop && showMobilePanel && (
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
