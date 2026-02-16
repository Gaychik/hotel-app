// components/profile/ProfileSettings.tsx
'use client';

import type { Profile } from '@/types';
import { useState, useEffect } from 'react';

export const ProfileSettings = ({ profile }: { profile: Profile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);

    // Обновляем состояние, если пропс profile изменился
    useEffect(() => {
        setName(profile.name);
        setPhone(profile.phone);
    }, [profile]);

    const handleSave = () => {
        console.log('Сохранение данных:', { name, phone });
        // Здесь будет логика отправки данных на сервер
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Возвращаем исходные значения
        setName(profile.name);
        setPhone(profile.phone);
        setIsEditing(false);
    };

    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-6 font-istok-web">Ваши данные</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Имя</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 block w-full p-3 border rounded-md bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Телефон</label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 (999) 999-99-99"
                        disabled={!isEditing}
                        className="mt-1 block w-full p-3 border rounded-md bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 transition"
                    />
                </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                            Сохранить
                        </button>
                        <button onClick={handleCancel} className="w-full sm:w-auto bg-gray-200 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">
                            Отмена
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors">
                        Редактировать
                    </button>
                )}
            </div>
        </div>
    );
};
