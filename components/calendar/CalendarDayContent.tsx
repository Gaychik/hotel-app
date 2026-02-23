// components/calendar/CalendarDayContent.tsx
import { useRef, useState,useEffect} from 'react';
import { DayContentProps } from 'react-day-picker';
import { format, isSameDay } from 'date-fns';
import DayDetailPopover from './DayDetailPopover';
import DesktopDayPopover from './DesktopDayPopover';
import type { DayData } from '@/types';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { getCalendarDataForMonth } from '@/lib/data';
// В будущем эти данные будут приходить из API




// NEW: Функция для определения цвета Heatmap
const getPriceHeatmapClass = (price: number): string => {
    if (price < 5500) return 'bg-green-100';
    if (price < 7000) return 'bg-green-200';
    if (price < 8500) return 'bg-green-300';
    return 'bg-green-400';
};

interface CustomDayContentProps extends DayContentProps {
  // ✅ Пропс переименован для ясности
  disabledDatesForRender: Date[]; 
}
// Эта функция-заглушка используется для рендеринга на сервере.
// Клиентская логика в useEffect ее переопределит.
const initialDayData: DayData = {
    date: new Date(),
    price: 0,
    availability: 'free'
};
export default function CalendarDayContent(props: CustomDayContentProps) {
 const { date, activeModifiers, disabledDatesForRender } = props;
  // --- NEW: Главное исправление ошибки гидратации ---
  const isPhysicallyDisabled = disabledDatesForRender.some(d => isSameDay(d, date));
   const [dayData, setDayData] = useState<DayData>(initialDayData);

    useEffect(() => {
        // В реальном приложении данные бы приходили из пропсов,
        // но для моков мы их "загружаем" здесь
        getCalendarDataForMonth(date).then(monthData => {
            const currentDayData = monthData.find(d => isSameDay(d.date, date));
            if (currentDayData) {
                setDayData(currentDayData);
            }
        });
    }, [date]);

 // NEW: Состояние для поповера
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

 const handleTouchStart = () => {
   if (activeModifiers.disabled) return; 
    longPressTimer.current = setTimeout(() => {
        setPopoverVisible(true);
    }, 500); // 500ms для долгого нажатия
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
    }
  };

    if (dayData.price === 0 && !isPhysicallyDisabled) {
        return <div className="w-full h-full rounded-lg bg-gray-50 animate-pulse"></div>;
    }


  // --- Переработанная логика стилей ---
  
  // 1. Heatmap и доступность
  let heatmapClass = getPriceHeatmapClass(dayData?.price || 0);
  if (props.activeModifiers.disabled || dayData?.availability === 'busy') {
    heatmapClass = 'bg-gray-100 text-gray-400 line-through';
  }

  // 2. Стили для выделения
 const isSelected = activeModifiers.selected;
  const isRangeStartOrEnd = activeModifiers.start || activeModifiers.end;
 const isDisabled = activeModifiers.disabled || isPhysicallyDisabled || dayData.availability === 'busy';
  // Базовые стили для "материальности"
  const baseClasses = `
    group relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 transform
  `;

  // Стили для разных состояний
   let stateClasses = '';

    if (isSelected) {
        stateClasses = 'bg-black text-white z-20 shadow-lg rounded-lg';
    } else if (isRangeStartOrEnd) {
        stateClasses = 'bg-gradient-to-br from-gray-800 to-black text-white z-20 shadow-lg rounded-lg';
    }     
    else if (isDisabled) {
        stateClasses = 'bg-gray-100 text-gray-400 line-through opacity-70';
    } else {
    
       // ✅ Цвет для скидки остается, но теперь он не конфликтует с текстом
        if (dayData.discount) {
            stateClasses = 'bg-emerald-100 hover:bg-emerald-200'; 
        } else {
            stateClasses = getPriceHeatmapClass(dayData.price);
        }
        stateClasses += ' hover:shadow-lg hover:z-30 cursor-pointer rounded-lg';
    }


  return (
    <>
      <div
        className={`${baseClasses} ${stateClasses}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
      >
 {/* ✅ Иконка-бейдж для скидки */}
                {dayData.discount && !isSelected && !isDisabled && (
                    <div className="absolute top-1 left-1 z-10">
                        <SparklesIcon className="h-4 w-4 text-yellow-500" />
                    </div>
                )}
        {/* Индикатор доступности (виден, только если дата не выбрана) */}
            <div className="relative text-center w-full h-full flex flex-col items-center justify-center p-1">
                    {/* Индикатор "мало номеров" */}
                    {!isSelected && dayData.availability === 'partial' && (
                        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-500"></div>
                    )}
               {/* Дата */}
                    <span className="font-medium">{props.date.getDate()}</span>
                  
        </div>

     

        {/* Поповеры (без изменений) */}
                <div className="hidden lg:group-hover:block">
                    {!isSelected && !isDisabled && <DesktopDayPopover dayData={dayData} date={date} />}
                </div>
            </div>
            {isPopoverVisible && (
                <DayDetailPopover dayData={dayData} date={date} onClose={() => setPopoverVisible(false)} />
            )}
        </>
  );
}

