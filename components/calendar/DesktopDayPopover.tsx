// components/calendar/DesktopDayPopover.tsx
interface DayData {
    price: number;
    status: 'free' | 'partial' | 'busy';
}

interface DesktopDayPopoverProps {
    dayData: DayData;
    date: Date;
}

export default function DesktopDayPopover({ dayData, date }: DesktopDayPopoverProps) {
    return (
        <div 
            className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white rounded-lg shadow-2xl p-4 z-30
                       transform -translate-x-1/2 left-1/2"
            onClick={(e) => e.stopPropagation()}
        >
            <h4 className="font-bold border-b border-gray-600 pb-1 mb-2">
                {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </h4>
            <div className="space-y-1">
                <p className="text-lg">{dayData.price}₽ <span className="text-sm text-gray-400">/ ночь</span></p>
                {dayData.status === 'partial' && <p className="text-xs text-yellow-400">Мало номеров</p>}
                <p className="text-xs text-gray-300">Скидка 20% при бронировании от 3-х ночей.</p>
            </div>
            {/* "Хвостик" для поповера */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0
                        border-l-8 border-l-transparent
                        border-r-8 border-r-transparent
                        border-t-8 border-t-gray-800">
            </div>
        </div>
    );
}
