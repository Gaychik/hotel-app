// components/profile/ProfileView.tsx
'use client'; // <-- Указываем, что это Клиентский компонент

import { useState } from 'react';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { CurrentBookingCard } from '@/components/profile/CurrentBookingCard';
import { HistoryBookingCard } from '@/components/profile/HistoryBookingCard';
import { UserIcon, CalendarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import type { Profile, Booking } from '@/types';


type Tab = 'current' | 'history' | 'profile';

// Принимаем данные, полученные на сервере, через props
interface ProfileViewProps {
    profile: Profile;
    initialCurrentBookings: Booking[]; // Переименовали для ясности
    initialPastBookings: Booking[]; 
}

export function ProfileView({ profile, initialCurrentBookings, initialPastBookings }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState<Tab>('current');
    

    // Управляем состоянием списков прямо здесь
    const [currentBookings, setCurrentBookings] = useState(initialCurrentBookings);
    const [pastBookings, setPastBookings] = useState(initialPastBookings);

    // Функция для отмены бронирования
    const handleCancelBooking = (bookingId: string) => {
        const bookingToCancel = currentBookings.find(b => b.id === bookingId);
        if (!bookingToCancel) return;

        // 1. Удаляем из текущих
        setCurrentBookings(currentBookings.filter(b => b.id !== bookingId));
        
        // 2. Добавляем в историю с новым статусом
        setPastBookings(prev => [{ ...bookingToCancel, status: 'cancelled' }, ...prev]);
    };

    const tabs = [
        { id: 'current', label: 'Текущее', icon: CalendarIcon },
        { id: 'history', label: 'История', icon: BookOpenIcon },
        { id: 'profile', label: 'Профиль', icon: UserIcon },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'current':
                return (
                    <div className="space-y-6">
                        {currentBookings.length > 0 ? (
                            currentBookings.map(booking => (
                                <CurrentBookingCard 
                                    key={booking.id} 
                                    booking={booking}
                                    onBookingCancel={handleCancelBooking} // <-- Передаем функцию
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-10">У вас нет активных бронирований.</p>
                        )}
                    </div>
                );
            case 'history':
                return (
                     <div className="space-y-4">
                        {pastBookings.length > 0 ? (
                             pastBookings.sort((a,b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()).map(booking => (
                                <HistoryBookingCard key={booking.id} booking={booking} />
                            ))
                        ) : (
                             <p className="text-center text-gray-500 py-10">Ваша история бронирований пуста.</p>
                        )}
                    </div>
                );
            case 'profile':
                return <ProfileSettings profile={profile} />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold font-karantina mb-8 text-center md:text-left">Личный кабинет</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Навигация */}
                <aside className="md:w-1/4 lg:w-1/5">
                    <nav className="flex flex-row md:flex-col gap-2">
                        {tabs.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700 font-bold'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <tab.icon className="h-6 w-6 shrink-0" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                
                {/* Контент */}
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

