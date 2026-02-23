// components/calendar/DayDetailPopover.tsx

import { XMarkIcon, TagIcon } from '@heroicons/react/24/solid';
import type { DayData } from '@/types';

interface DayDetailPopoverProps {
    dayData: DayData;
    date: Date;
    onClose: () => void;
}

export default function DayDetailPopover({ dayData, date, onClose }: DayDetailPopoverProps) {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                    <XMarkIcon className="h-6 w-6 text-gray-700" />
                </button>
                <h3 className="text-xl font-bold mb-1">{date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</h3>
                <p className="text-lg text-gray-500 mb-4">{date.toLocaleDateString('ru-RU', { weekday: 'long' })}</p>

                {/* ✅ Динамический бейдж для скидки */}
                {dayData.discount && (
                    <div className="mb-4 inline-flex items-center bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                        <TagIcon className="h-4 w-4 mr-1.5" />
                        Скидка {dayData.discount}%
                    </div>
                )}

                <div className="space-y-3">
                    {/* ✅ Динамическое отображение цены */}
                    {dayData.originalPrice ? (
                        <div className="flex items-baseline gap-3">
                             <p className="text-3xl font-bold text-emerald-600">
                                {dayData.price.toLocaleString('ru-RU')}₽
                            </p>
                            <p className="text-xl font-normal text-gray-400 line-through">
                                {dayData.originalPrice.toLocaleString('ru-RU')}₽
                            </p>
                        </div>
                    ) : (
                        <p className="text-2xl font-bold">
                            {dayData.price.toLocaleString('ru-RU')}₽
                            <span className="text-base font-normal text-gray-600"> / ночь</span>
                        </p>
                    )}
                    
                    {dayData.availability === 'partial' && (
                        <p className="text-yellow-600 font-semibold">Осталось мало номеров</p>
                    )}
                    
                    <p className="text-gray-700">
                        {dayData.event || 'Здесь может быть информация о дне.'}
                    </p>
                </div>
            </div>
            {/* CSS для анимации */}
            <style jsx global>{`
                @keyframes pop-in {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
