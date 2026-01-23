// components/layout/HeroSection.tsx
'use client'; // 0. Директива для использования хуков в компоненте
// components/layout/HeroSection.tsx

import React, { useState, useEffect, useRef } from 'react'; // 1. Импортируем useRef
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { CalendarIcon, GuestsIcon, BedIcon } from '@/components/ui/Icons';
import SearchButton from '@/components/ui/SearchButton';

const backgroundImages = [
    '/hero1.png',
    '/hero2.jpg',
    "/hero3.jpg",
    "/hero4.jpg"
];

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    // 2. Создаем ref. Он будет "указывать" на наш анимируемый div.
    const nodeRef = useRef<HTMLDivElement>(null);

    // Логика таймера остается без изменений
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) =>
                prevSlide === backgroundImages.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, []);

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
                {/* ... Форма поиска ... */}
                <div className="relative w-full max-w-7xl mx-auto px-4 mb-8">
                     <div className="grid grid-cols-1 gap-2 rounded-2xl bg-white/70 p-4 backdrop-blur-lg shadow-lg sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 lg:p-6">
                        <SearchButton icon={<CalendarIcon className="h-6 w-6" />} label="Заезд" value="Выберите дату" />
                        <SearchButton icon={<CalendarIcon className="h-6 w-6" />} label="Выезд" value="Выберите дату" />
                        <SearchButton icon={<GuestsIcon className="h-6 w-6" />} label="Гости" value="2 взрослых" />
                        <SearchButton icon={<BedIcon className="h-6 w-6" />} label="Номера" value="1 номер" />
                        <button className="w-full rounded-xl bg-gray-800 py-4 text-white font-semibold shadow-lg transition-colors hover:bg-gray-900 sm:col-span-2 lg:col-span-1">
                            Найти номер
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
