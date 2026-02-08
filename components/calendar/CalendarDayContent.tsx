// components/calendar/CalendarDayContent.tsx
import { useRef, useState,useEffect} from 'react';
import { DayContentProps } from 'react-day-picker';
import { format } from 'date-fns';
import DayDetailPopover from './DayDetailPopover';
import DesktopDayPopover from './DesktopDayPopover';

// В будущем эти данные будут приходить из API
const getMockDayData = (date: Date) => {
  const day = format(date, 'yyyy-MM-dd');
  const prices: { [key: string]: { price: number; status: 'free' | 'partial' | 'busy' } } = {
    '2026-03-17': { price: 7500, status: 'partial' },
    '2026-03-18': { price: 9500, status: 'busy' },
  };
  return prices[day] || { price: 5000 + Math.floor(Math.random() * 1000), status: 'free' };
};
interface DayInfo {
    price: number;
    status: 'free' | 'partial' | 'busy';
}


// NEW: Функция для определения цвета Heatmap
const getPriceHeatmapClass = (price: number): string => {
    if (price < 5500) return 'bg-green-100';
    if (price < 7000) return 'bg-green-200';
    if (price < 8500) return 'bg-green-300';
    return 'bg-green-400';
};

export default function CalendarDayContent(props: DayContentProps) {
  const { date, activeModifiers } = props;
 
  // --- NEW: Главное исправление ошибки гидратации ---
  const [dayData, setDayData] = useState<DayInfo | null>(null);

  useEffect(() => {
      // Этот код выполнится ТОЛЬКО на клиенте, ПОСЛЕ гидратации
      setDayData(getMockDayData(date));
  }, [date]); // Пересчитываем, если дат

 // NEW: Состояние для поповера
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
 const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
        setPopoverVisible(true);
    }, 500); // 500ms для долгого нажатия
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
    }
  };

 if (!dayData) {
      return (
          <div className="w-full h-20 rounded-lg m-px bg-gray-50 animate-pulse"></div>
      );
  }

  // --- Переработанная логика стилей ---
  
  // 1. Heatmap и доступность
  let heatmapClass = getPriceHeatmapClass(dayData?.price || 0);
  if (props.activeModifiers.disabled || dayData?.status === 'busy') {
    heatmapClass = 'bg-gray-100 text-gray-400 line-through';
  }

  // 2. Стили для выделения
  const isSelected = activeModifiers.selected;
  let finalClasses = '';
  let textClass = 'text-gray-800';

  
  if (isSelected) {
    finalClasses = 'bg-black scale-110 z-10'; // Увеличиваем масштаб для акцента
    textClass = 'text-white';
  } else {
    // Применяем Heatmap только для невыбранных дат
    finalClasses = getPriceHeatmapClass(dayData.price);
    if (props.activeModifiers.disabled || dayData.status === 'busy') {
        finalClasses = 'bg-gray-100 text-gray-400 line-through';
    }
  }

 
  return (
    <>
      <div
        className={`
            group relative flex items-center justify-center 
            w-full h-20 rounded-lg m-px /* NEW: m-px вместо margin, чтобы не было щелей */
            transition-all duration-300 ease-in-out
            transform /* NEW: Включаем transform для анимаций */
            
            /* NEW: Hover-эффект (масштабирование) только для невыбранных дат */
            ${!isSelected && !props.activeModifiers.disabled ? 'hover:scale-110 hover:z-20' : ''}
            
            ${finalClasses} /* Применяем наши вычисленные классы */
            ${!props.activeModifiers.disabled && 'cursor-pointer'}
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
      >
        {/* Индикатор доступности (виден, только если дата не выбрана) */}
        {!isSelected && dayData.status === 'partial' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-500"></div>}

        <span className={`text-lg font-semibold ${textClass}`}>{date.getDate()}</span>

        {/* --- NEW: Поповер для ПК --- */}
        <div className="hidden lg:group-hover:block">
           {!isSelected && <DesktopDayPopover dayData={dayData} date={date} />}
        </div>
      </div>

      {/* NEW: Показываем поповер, если сработало долгое нажатие */}
      {isPopoverVisible && (
        <DayDetailPopover 
            dayData={dayData} 
            date={date}
            onClose={() => setPopoverVisible(false)} 
        />
      )}
    </>
  );
}

