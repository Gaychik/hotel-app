// components/layout/Header.tsx
"use client"; // 0. Добавляем директиву "use client" для использования хуков
import React, { useState } from 'react'; // 1. Импортируем useState
import Link from 'next/link';
// 2. Импортируем нашу новую иконку CloseIcon
import { MenuIcon, HeartIcon, CalendarIcon, UserIcon, CloseIcon } from '@/components/ui/Icons'; 

const Header: React.FC = () => {
    // 3. Создаем состояние, которое будет хранить информацию, открыто меню или нет.
    // По умолчанию оно закрыто (false).
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        // Для правильной работы выпадающего меню, позиция шапки должна быть relative
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Основная панель шапки */}
            <div className="container mx-auto px-4 lg:px-20 h-20 grid grid-cols-3 items-center">
                
                {/* --- Левая колонка (Кнопка меню) --- */}
                <div className="justify-self-start">
                    {/* Эта кнопка видна только на мобильных (класс lg:hidden) */}
                    <button 
                        className="lg:hidden p-2 z-20 relative" // z-20, чтобы кнопка была поверх меню
                        onClick={
                            
                            (e) => {e.stopPropagation(); // Предотвращаем всплытие события клика
                                 setIsMenuOpen(!isMenuOpen)
                                } }// При клике меняем состояние на противоположное
                    >
                        {/* 4. Показываем нужную иконку в зависимости от состояния */}
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>

                {/* --- Центральная колонка (Логотип) --- */}
                <div className="text-center justify-self-center">
                    <div className="font-karantina text-2xl font-bold">HC</div>
                    <div className="font-istok-web text-xs text-gray-500 hidden sm:block">Hotel California</div>
                </div>

                {/* --- Правая колонка (Иконки для десктопа) --- */}
                <div className="justify-self-end">
                    <div className="hidden lg:flex items-center space-x-6">
                        <button className="transition-transform hover:scale-110"><HeartIcon /></button>
                        <button className="transition-transform hover:scale-110"><CalendarIcon className="w-6 h-6" /></button>
                        <Link href="/login" className="cursor-pointer transition-transform hover:scale-110">
                            <UserIcon />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 5. ПАНЕЛЬ МОБИЛЬНОГО МЕНЮ */}
            <div 
                className={`
                    absolute top-0 left-0 w-full pt-20 bg-white shadow-lg lg:hidden
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'}
                `}
                // При клике на ссылку внутри меню, оно закроется
                onClick={() => setIsMenuOpen(false)}
            >
                <div className="flex flex-col items-start space-y-6 p-6">
                    {/* Дублируем иконки с рабочего стола, но уже как полноценные ссылки с текстом */}
                    <Link href="/favorites" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600 w-full">
                        <HeartIcon />
                        <span>Избранное</span>
                    </Link>
                    <Link href="/bookings" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600 w-full">
                        <CalendarIcon className="w-6 h-6" />
                        <span>Мои бронирования</span>
                    </Link>
                    <Link href="/login" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600 w-full">
                        <UserIcon />
                        <span>Войти в профиль</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
