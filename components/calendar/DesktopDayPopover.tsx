// components/calendar/DesktopDayPopover.tsx

import type { DayData } from '@/types';

interface DesktopDayPopoverProps {
    dayData: DayData;
    date: Date;
}

export default function DesktopDayPopover({ dayData, date }: DesktopDayPopoverProps) {
    return (
        <div
            className="absolute bottom-full mb-2 w-52 bg-gray-800 text-white rounded-lg shadow-2xl p-4 z-30 transform -translate-x-1/2 left-1/2"
            onClick={(e) => e.stopPropagation()}
        >
            <h4 className="font-bold border-b border-gray-600 pb-1 mb-2">
                {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </h4>
            <div className="space-y-2">
                {/* ✅ Динамическое отображение цены */}
                {dayData.originalPrice ? (
                    <div>
                        <p className="text-sm text-gray-400 line-through">
                            {dayData.originalPrice.toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-xl font-bold text-emerald-400">
                            {dayData.price.toLocaleString('ru-RU')} ₽
                            <span className="text-sm font-normal text-gray-300"> / ночь</span>
                        </p>
                    </div>
                ) : (
                    <p className="text-lg">
                        {dayData.price.toLocaleString('ru-RU')} ₽
                        <span className="text-sm text-gray-400"> / ночь</span>
                    </p>
                )}

                {/* ✅ Динамический текст для скидки и статуса */}
                <div className="text-xs space-y-1">
                    {dayData.discount && (
                        <p className="font-semibold text-emerald-300">
                            Скидка {dayData.discount}%!
                        </p>
                    )}
                    {dayData.availability === 'partial' && (
                        <p className="text-yellow-400">Осталось мало номеров</p>
                    )}
                </div>
            </div>
            {/* "Хвостик" поповера */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0
                         border-l-8 border-l-transparent
                         border-r-8 border-r-transparent
                         border-t-8 border-t-gray-800">
            </div>
        </div>
    );
}
