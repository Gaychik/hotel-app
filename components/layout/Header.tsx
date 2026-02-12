// components/layout/Header.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuIcon, HeartIcon, CalendarIcon, UserIcon, CloseIcon } from '@/components/ui/Icons';
// 👇 1. Импортируем хуки и функции NextAuth
import { useSession, signOut } from 'next-auth/react';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // 👇 2. Получаем данные сессии
    const { data: session, status } = useSession();
    
    // `status` может быть 'loading', 'authenticated', 'unauthenticated'
    const isLoggedIn = status === 'authenticated';
    const userName = session?.user?.name?.split(' ')[0] || 'Гость'; // Берем первое слово из имени

    // 👇 3. Показываем "пустую" шапку, пока идет проверка статуса аутентификации
    if (status === 'loading') {
        return <header className="h-20 bg-white shadow-sm"></header>;
    }
    
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-20 h-20 grid grid-cols-3 items-center">
                
                {/* --- Левая колонка (Кнопка меню) --- */}
                <div className="justify-self-start">
                    <button 
                        className="lg:hidden p-2 z-20 relative"
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen) }}
                    >
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>

                {/* --- Центральная колонка (Логотип) --- */}
                <div className="text-center justify-self-center">
                    <Link href="/" className="font-karantina text-2xl font-bold">HC</Link>
                    <div className="font-istok-web text-xs text-gray-500 hidden sm:block">Hotel California</div>
                </div>

                {/* --- Правая колонка (Иконки для десктопа) --- */}
                <div className="justify-self-end">
                    <div className="hidden lg:flex items-center space-x-6">
                        {/* <button className="transition-transform hover:scale-110"><HeartIcon /></button> */}
                        {/* <button className="transition-transform hover:scale-110"><CalendarIcon className="w-6 h-6" /></button> */}
                        
                        {/* 👇 4. "Умная" ссылка на профиль */}
                        <Link href={isLoggedIn ? "/profile" : "/login"} className="cursor-pointer transition-transform hover:scale-110">
                            <UserIcon />
                        </Link>

                        {/* 👇 5. Показываем кнопку выхода, если пользователь вошел */}
                        {isLoggedIn && (
                            <button 
                                onClick={() => signOut({ callbackUrl: '/' })} 
                                title="Выйти"
                                className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ПАНЕЛЬ МОБИЛЬНОГО МЕНЮ */}
            <div 
                className={`
                    absolute top-0 left-0 w-full pt-20 bg-white shadow-lg lg:hidden
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'}
                `}
                onClick={() => setIsMenuOpen(false)}
            >
                <div className="flex flex-col items-start space-y-6 p-6">
                    <Link href="/favorites" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600 w-full">
                        <HeartIcon />
                        <span>Избранное</span>
                    </Link>
                    <Link href="/bookings" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600 w-full">
                        <CalendarIcon className="w-6 h-6" />
                        <span>Мои бронирования</span>
                    </Link>
                    
                    {/* 👇 6. "Умная" ссылка для мобильного меню */}
                    <Link href={isLoggedIn ? "/profile" : "/login"} className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600 w-full">
                        <UserIcon />
                        <span>{isLoggedIn ? `Привет, ${userName}` : "Войти в профиль"}</span>
                    </Link>

                    {/* 👇 7. Показываем кнопку выхода в мобильном меню */}
                    {isLoggedIn && (
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })} 
                            className="flex items-center gap-3 text-lg font-medium text-red-600 hover:text-red-800 w-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            <span>Выйти</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
