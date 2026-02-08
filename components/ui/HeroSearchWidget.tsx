// components/ui/HeroSearchWidget.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDaysIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export const HeroSearchWidget = () => {
    const [guestCount, setGuestCount] = useState(2);
    const router = useRouter();

    // Функция, которая будет вызываться при клике на всю панель
    const handleNavigateToCalendar = () => {
        // Формируем URL с параметром количества гостей
        const queryParams = new URLSearchParams({
            guests: String(guestCount),
        });
        router.push(`/calendar?${queryParams.toString()}`);
    };

    return (
        // Вся панель - одна большая кнопка
        <div
            onClick={handleNavigateToCalendar}
            className="mt-10 grid grid-cols-1 md:grid-cols-3 w-full max-w-2xl rounded-full bg-white bg-opacity-90 backdrop-blur-md shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-105 group"
        >
            {/* --- Секция Календаря (главная приманка) --- */}
            <div className="col-span-1 md:col-span-2 flex items-center p-4 pl-8 rounded-full md:rounded-none md:rounded-l-full">
                <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-900">Даты вашего отдыха</h3>
                    <p className="text-sm text-gray-600">Подобрать идеальные дни</p>
                </div>
            </div>
            
            {/* --- Секция Гостей (интерактивная часть) --- */}
            <div className="flex items-center justify-between p-4 border-t md:border-t-0 md:border-l border-gray-200">
                <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                        <h3 className="font-bold text-lg text-gray-900">Гости</h3>
                        <p className="text-sm text-gray-600">{guestCount} взрослых</p>
                    </div>
                </div>
                {/* Элементы управления гостями. stopPropagation нужен, чтобы клик по ним не вызывал навигацию */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setGuestCount(p => Math.max(1, p - 1))} className="h-8 w-8 rounded-full bg-gray-200 text-lg font-bold text-gray-700 hover:bg-gray-300">-</button>
                    <button onClick={() => setGuestCount(p => p + 1)} className="h-8 w-8 rounded-full bg-gray-200 text-lg font-bold text-gray-700 hover:bg-gray-300">+</button>
                </div>
            </div>
        </div>
    );
};
