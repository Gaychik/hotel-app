// components/calendar/SmartCalendar.tsx

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { DayPicker, DateRange, DayContentProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ru } from 'date-fns/locale'; // NEW: Импорт русской локали
import { useSearchParams, useRouter } from 'next/navigation';
import CalendarDayContent from '@/components/calendar/CalendarDayContent';
import BookingDetailsPanel from '@/components/calendar/BookingDetailPanel';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { format, parseISO, isValid, isSameDay } from 'date-fns'; 
import toast from 'react-hot-toast';
import { GiftIcon, CalendarDaysIcon, BackspaceIcon } from '@heroicons/react/24/outline'; // Иконки для предложений
import { Modal } from '../ui/Modal';
import { getDisabledDates, findSmartSuggestions, isRangeValid } from '@/lib/data'; 

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

  

  // ✅ НОВЫЕ СОСТОЯНИЯ ДЛЯ "УМНОГО" МОДАЛЬНОГО ОКНА
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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
   
    const handleClearSelection = () => {
        setRange(undefined); // Очищаем состояние
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.delete('checkIn');
        currentParams.delete('checkOut');
        router.push(`/calendar?${currentParams.toString()}`, { scroll: false }); // Обновляем URL
        toast('Выбор дат очищен.', { icon: '🗑️' });
    };

const handleOpenSuggestionModal = async () => {
        setIsLoadingSuggestions(true);
        setIsSuggestionModalOpen(true);
        // Ищем предложения от сегодняшнего дня, чтобы показать самые релевантные
        const smartSuggestions = await findSmartSuggestions(new Date());
        setSuggestions(smartSuggestions);
        setIsLoadingSuggestions(false);
    };
    

 const handleSuggestionSelect = (range: { from: Date, to: Date }) => {
    handleDateSelect(range); // Выбираем предложенный диапазон
    setIsSuggestionModalOpen(false); // Закрываем модалку
    toast.success('Даты успешно выбраны!');
  };

    // ✅ ГЛАВНАЯ ИЗМЕНЕННАЯ ФУНКЦИЯ
  const handleDateSelect = async (selectedRange: DateRange | undefined) => {
    // Если пользователь сбросил выбор, просто обновляем состояние
    if (!selectedRange || !selectedRange.from) {
      setRange(undefined);
      return;
    }
    
    // Если выбрана только начальная дата, сохраняем ее
    if (!selectedRange.to) {
      setRange(selectedRange);
      return;
    }

    // --- КОГДА ВЫБРАН ПОЛНЫЙ ДИАПАЗОН ---
    if (isRangeValid(selectedRange as { from: Date, to: Date }, disabledDates)) {
      // 1. Диапазон ВАЛИДЕН: работаем как раньше
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
      setRange(selectedRange);
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
    } else {
      // 2. Диапазон НЕВАЛИДЕН:
      toast.error('Выбранный диапазон захватывает забронированные дни!');
      // Открываем модальное окно с предложениями
      setIsLoadingSuggestions(true);
      setIsSuggestionModalOpen(true);
      const smartSuggestions = await findSmartSuggestions(selectedRange.from); // Ищем от начала невалидного диапазона
      setSuggestions(smartSuggestions);
      setIsLoadingSuggestions(false);
      // НЕ обновляем `range`, оставляя старый выбор или пустые даты
    }
  };

  // ✅ ОПТИМИЗАЦИЯ: Передаем disabledDates в компонент дня через useCallback
  const DayContentWithData = useCallback(
    (props: DayContentProps) => (
      <CalendarDayContent
        {...props}
        // Передаем весь массив, чтобы дочерний компонент сам решал, как выглядеть
        disabledDatesForRender={disabledDates} 
      />
    ),
    [disabledDates] // Пересоздаем функцию только при загрузке заблокированных дат
  );

 


  
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
  const isSelectionStarted = range?.from;
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
            disabled={{ before: new Date() }}
          
          // ✅ Передаем кастомный компонент дня
          components={{ DayContent: DayContentWithData }}
            
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
             footer={
                            isSelectionStarted && (
                                <div className="text-center pt-4 mt-2 border-t border-gray-200">
                                    <button
                                        onClick={handleClearSelection}
                                        className="flex items-center gap-2 mx-auto text-sm text-gray-500 hover:text-black transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        aria-label="Очистить выбор дат"
                                    >
                                        <BackspaceIcon className="h-5 w-5" />
                                        <span>Очистить выбор</span>
                                    </button>
                                </div>
                            )
                        }
          />
  {/* ✅ НАШЕ НОВОЕ "УМНОЕ" МОДАЛЬНОЕ ОКНО */}
      <Modal isOpen={isSuggestionModalOpen} onClose={() => setIsSuggestionModalOpen(false)}>
        {isLoadingSuggestions ? (
          <div className="text-center p-8">
            <p className="animate-pulse">Ищем лучшие варианты...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold">Мы нашли кое-что для вас!</h2>
         
            <div className="mt-6 space-y-4">
              
              {/* Предложение №1: Ближайшие свободные даты */}
              {suggestions?.nextAvailableSlot && (
                <button
                  onClick={() => handleSuggestionSelect(suggestions.nextAvailableSlot)}
                  className="w-full p-4 bg-blue-50 rounded-lg text-left transition-transform hover:scale-102"
                >
                  <div className="flex items-center gap-4">
                    <CalendarDaysIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-800">Ближайшие свободные даты</strong>
                      <p className="text-sm text-blue-700">
                        {format(suggestions.nextAvailableSlot.from, 'd MMMM')} - {format(suggestions.nextAvailableSlot.to, 'd MMMM')}
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {/* Предложение №2: Даты со скидкой */}
              {suggestions?.discountDates && suggestions.discountDates.length > 0 && (
                 <button
                  onClick={() => handleSuggestionSelect({ from: suggestions.discountDates[0], to: suggestions.discountDates[2] })}
                  className="w-full p-4 bg-green-50 rounded-lg text-left transition-transform hover:scale-102"
                >
                  <div className="flex items-center gap-4">
                    <GiftIcon className="h-8 w-8 text-green-500 flex-shrink-0" />
                    <div>
                      <strong className="text-green-800">"Горящие" даты со скидкой!</strong>
                      <p className="text-sm text-green-700">
                        {format(suggestions.discountDates[0], 'd MMMM')} - {format(suggestions.discountDates[2], 'd MMMM')}
                      </p>
                    </div>
                  </div>
                </button>
              )}

            </div>
          </div>
        )}
      </Modal>
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

   {/* ✅ NEW: Плавающая кнопка для вызова спецпредложений */}
            {!bookingMode && (
                 <button
                    onClick={handleOpenSuggestionModal}
                    className="fixed bottom-28 right-4 lg:bottom-8 lg:right-8 z-30 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-100"
                    aria-label="Посмотреть спецпредложения"
                 >
                    <GiftIcon className="h-8 w-8" />
                 </button>
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
