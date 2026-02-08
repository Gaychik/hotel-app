// app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentBookings, getPastBookings, getProfileData } from '@/lib/data';

// Импортируем компоненты вкладок, которые создадим ниже
import { CurrentBookingCard } from '@/components/profile/CurrentBookingCard';
import { HistoryBookingCard } from '@/components/profile/HistoryBookingCard';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

// Типы для наших данных
type Profile = Awaited<ReturnType<typeof getProfileData>>;
type Booking = Awaited<ReturnType<typeof getCurrentBookings>>[0];

// Определяем наши вкладки
const tabs = [
    { id: 'current', label: 'Текущее бронирование' },
    { id: 'history', label: 'История' },
    { id: 'profile', label: 'Профиль' },
    { id: 'notifications', label: 'Уведомления' },
    { id: 'support', label: 'Поддержка' },
];

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('current');
    
    // Состояния для хранения загруженных данных
    const [profile, setProfile] = useState<Profile | null>(null);
    const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
    const [pastBookings, setPastBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Загружаем все данные при монтировании компонента
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [profileData, currentData, pastData] = await Promise.all([
                getProfileData(),
                getCurrentBookings(),
                getPastBookings(),
            ]);
            setProfile(profileData);
            setCurrentBookings(currentData);
            setPastBookings(pastData);
            setLoading(false);
        };
        loadData();
    }, []);

    // Функция для рендеринга контента активной вкладки
    const renderContent = () => {
        if (loading) return <div>Загрузка данных личного кабинета...</div>;

        switch (activeTab) {
            case 'current':
                return currentBookings.length > 0
                    ? currentBookings.map(booking => <CurrentBookingCard key={booking.id} booking={booking} />)
                    : <p>У вас нет активных бронирований.</p>;
            case 'history':
                return pastBookings.length > 0
                    ? pastBookings.map(booking => <HistoryBookingCard key={booking.id} booking={booking} />)
                    : <p>Ваша история бронирований пуста.</p>;
            case 'profile':
                return profile ? <ProfileSettings profile={profile} /> : null;
            case 'notifications':
                return <p>Здесь будут ваши уведомления.</p>;
            case 'support':
                return <p>Здесь будет форма связи с поддержкой.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold font-karantina mb-8">Личный кабинет</h1>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Навигация по вкладкам (слева) */}
                <aside className="md:w-1/4">
                    <nav className="flex flex-row md:flex-col gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left p-3 rounded-md text-sm md:text-base font-semibold transition-colors ${
                                    activeTab === tab.id 
                                    ? 'bg-blue-600 text-white' 
                                    : 'hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Контент активной вкладки (справа) */}
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
