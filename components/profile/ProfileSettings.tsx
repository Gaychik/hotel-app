// components/profile/ProfileSettings.tsx
'use client';

import type { Profile } from '@/types';
import { useState, useEffect } from 'react';

export const ProfileSettings = ({ profile }: { profile: Profile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Состояния для каждого поля
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email ?? ''); // Добавляем email
    const [phone, setPhone] = useState(profile.phone);

    // Функция-маска для номера телефона
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, ''); // Удаляем все не-цифры
        let formatted = '+7';

        if (input.length > 1) {
            formatted += ` (${input.substring(1, 4)}`;
        }
        if (input.length >= 5) {
            formatted += `) ${input.substring(4, 7)}`;
        }
        if (input.length >= 8) {
            formatted += `-${input.substring(7, 9)}`;
        }
        if (input.length >= 10) {
            formatted += `-${input.substring(9, 11)}`;
        }
        
        setPhone(formatted);
    };

    // Сброс полей при отмене
    const handleCancel = () => {
        setName(profile.name);
        setEmail(profile.email ?? '');
        setPhone(profile.phone);
        setIsEditing(false);
    };

    const handleSave = () => {
        setIsSaving(true);
        console.log('Сохранение данных:', { name, email, phone });
        // Имитация задержки сети
        setTimeout(() => {
            setIsSaving(false);
            setIsEditing(false);
            // В реальном приложении здесь бы обновились пропсы
        }, 1000);
    };

    // Обновляем состояние, если пропсы изменились (например, после "сохранения")
    useEffect(() => {
        setName(profile.name);
        setEmail(profile.email ?? '');
        setPhone(profile.phone);
    }, [profile]);

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
                        disabled={!isEditing || isSaving}
                        className="mt-1 block w-full p-3 border rounded-md bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 transition"
                    />
                </div>
                 <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="example@mail.com"
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing || isSaving}
                        className="mt-1 block w-full p-3 border rounded-md bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Телефон</label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={18} // +7 (999) 999-99-99
                        disabled={!isEditing || isSaving}
                        className="mt-1 block w-full p-3 border rounded-md bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 transition"
                    />
                </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                 {isEditing ? (
                    <>
                        <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {isSaving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button onClick={handleCancel} disabled={isSaving} className="w-full sm:w-auto bg-gray-200 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">
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
