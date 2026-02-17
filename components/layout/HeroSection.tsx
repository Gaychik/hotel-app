// components/layout/HeroSection.tsx
'use client'; // 0. Директива для использования хуков в компоненте
// components/layout/HeroSection.tsx

import React, { useState, useEffect, useRef} from 'react'; // 1. Импортируем useRef
import { CSSTransition, SwitchTransition } from 'react-transition-group';

// import { CalendarIcon, GuestsIcon, BedIcon } from '@/components/ui/Icons';
import SearchPill from '@/components/ui/SearchPill'; // 👇 2. Импортируем "таблетку"
import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/solid';

import { useRouter } from 'next/navigation';

const backgroundImages = [
    '/hero1.png',
    '/hero2.jpg',
    "/hero3.jpg",
    "/hero4.jpg"
];

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    // 2. Создаем ref. Он будет "указывать" на наш анимируемый div.
   const [guestCount, setGuestCount] = useState(2); // Состояние для гостей
    const nodeRef = useRef<HTMLDivElement>(null);
    const router = useRouter(); // Инициализируем роутер

    // Логика таймера остается без изменений
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) =>
                prevSlide === backgroundImages.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, []);

     // Навигация в календарь
    const goToCalendar = () => router.push(`/calendar?guests=${guestCount}`);
    // Навигация к списку номеров
     const goToRooms = () => router.push(`/rooms?guests=${guestCount}`);
    const guestText = (count: number) => {
        if (count === 1) return 'гость';
        if (count > 1 && count < 5) return 'гостя';
        return 'гостей';
    };
    return (
        <section className="relative h-[680px] flex items-end justify-center overflow-hidden">
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={currentSlide}
                    // 3. ПЕРЕДАЕМ REF В CSSTransition. Это главный фикс!
                    nodeRef={nodeRef}
                    // Указываем время анимации, оно должно совпадать с CSS (1500ms)
                    timeout={1500}
                    classNames="fade"
                    // addEndListener больше не нужен, когда мы используем nodeRef и timeout
                >
                    {/* 4. ПРИВЯЗЫВАЕМ REF к нашему div'у */}
                    <div ref={nodeRef} className="absolute inset-0 w-full h-full">
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[currentSlide]})` }}
                        >
                            <div className="absolute inset-0 bg-black/30"></div>
                        </div>
                    </div>
                </CSSTransition>
            </SwitchTransition>
            
            {/* Остальной контент без изменений */}
            <div className="relative z-10 w-full">
                {/* ... Прогресс-бар ... */}
                <div className="absolute bottom-[200px] sm:bottom-[150px] left-1/2 -translate-x-1/2 text-white text-sm w-full max-w-sm flex items-center gap-2 px-4">
                    <span>0{currentSlide + 1}</span>
                    <div className="flex-grow h-0.5 bg-white/50 relative">
                        <div 
                            className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
                            style={{ width: `${((currentSlide + 1) / backgroundImages.length) * 100}%` }}
                        ></div>
                    </div>
                    <span>0{backgroundImages.length}</span>
                </div>
               {/* --- НОВАЯ, СБАЛАНСИРОВАННАЯ ПАНЕЛЬ ПОИСКА --- */}
                <div className="relative w-full max-w-4xl mx-auto px-4 mb-8">
                     <div className="flex flex-col lg:flex-row rounded-2xl bg-white/80 p-2 backdrop-blur-lg shadow-2xl overflow-hidden">

                        {/* --- 1. Левая часть: Умный календарь --- */}
                        <div className="flex-grow">
                            <SearchPill onClick={goToCalendar}>
                                {/* 👇 Иконки теперь черные/темно-серые */}
                                <CalendarDaysIcon className="h-8 w-8 text-gray-800 flex-shrink-0" />
                                <div className="ml-4">
                                    <h3 className="font-bold text-gray-900">Умный календарь</h3>
                                    <p className="text-sm text-gray-600">Найти лучшие цены и даты</p>
                                </div>
                            </SearchPill>
                        </div>
                        
                        {/* Разделитель */}
                        <div className="my-1 lg:my-0 lg:mx-1 border-t lg:border-t-0 lg:border-l border-white/80"></div>

                        {/* --- 2. Центральная часть: Гости --- */}
                        <div className="flex-shrink-0">
                            <SearchPill>
                                <UserGroupIcon className="h-8 w-8 text-gray-800 flex-shrink-0" />
                                <div className="ml-3">
                                    <h3 className="font-bold text-gray-900">Гости</h3>
                                    {/* 👇 Текст теперь "гость/гостя/гостей" */}
                                    <p className="text-sm text-gray-600">{guestCount} {guestText(guestCount)}</p>
                                </div>
                                <div className="ml-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => setGuestCount(p => Math.max(1, p - 1))} className="h-7 w-7 rounded-full bg-gray-200 text-lg font-bold text-gray-700 hover:bg-gray-300 transition-colors">-</button>
                                    <button onClick={() => setGuestCount(p => p + 1)} className="h-7 w-7 rounded-full bg-gray-200 text-lg font-bold text-gray-700 hover:bg-gray-300 transition-colors">+</button>
                                </div>
                             </SearchPill>
                        </div>

                        {/* --- 3. Правая часть: Кнопка "Найти номер" --- */}
                        <div className="p-1 lg:p-0 lg:pl-1">
                             <button  onClick={goToRooms}
                                // 👇 Кнопка теперь стилизована: скругленная, с тенью и "эмоциональным" ховером
                                className="w-full h-full text-center font-semibold text-white bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-900 hover:shadow-gray-900/40 transform hover:-translate-y-0.5 px-6"
                             >
                                 Найти номер
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
