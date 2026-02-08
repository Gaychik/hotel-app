// components/profile/ProfileSettings.tsx
import type { Profile } from '@/types';
import { useState } from 'react';

export const ProfileSettings = ({ profile }: { profile: Profile }) => {
    const [isEditing, setIsEditing] = useState(false);
    // В реальном приложении здесь будут состояния для каждого поля
    
    return (
        <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Ваши данные</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Имя</label>
                    <input type="text" defaultValue={profile.name} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md bg-gray-50 disabled:bg-gray-200"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" defaultValue={profile.email} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md bg-gray-50 disabled:bg-gray-200"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Телефон</label>
                    <input type="tel" defaultValue={profile.phone} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md bg-gray-50 disabled:bg-gray-200"/>
                </div>
            </div>
            <div className="mt-6">
                {isEditing ? (
                    <button onClick={() => setIsEditing(false)} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700">
                        Сохранить
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-gray-200 font-semibold py-2 px-5 rounded-md hover:bg-gray-300">
                        Редактировать
                    </button>
                )}
            </div>
        </div>
    )
}
