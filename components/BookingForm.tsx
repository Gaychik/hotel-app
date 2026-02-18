// components/BookingForm.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Для автозаполнения
import { getRoomById, createBooking, updateBooking } from '@/lib/data';
import type { Room } from '@/types';
import { differenceInCalendarDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BookingFormProps {
  roomId: string;
  checkIn: string;
  checkOut: string;
  currentBookingId?: string;
  mode?: 'new' | 'change';
}

export const BookingForm = ({ roomId, checkIn, checkOut, currentBookingId, mode = 'new' }: BookingFormProps) => {
    const router = useRouter();
    const { data: session } = useSession(); // Получаем данные сессии

    // Состояние для данных о номере
    const [room, setRoom] = useState<Room | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ Состояния для полей формы
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Состояния для отправки формы
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Загружаем данные о номере и автозаполняем форму
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const roomData = await getRoomById(roomId);
                if (roomData) {
                    setRoom(roomData);
                    // Автозаполнение, если пользователь авторизован
                    if (session?.user) {
                        const nameParts = session.user.name?.split(' ') || ['',''];
                        setFirstName(nameParts[0] || '');
                        setLastName(nameParts.slice(1).join(' ') || '');
                        setEmail(session.user.email || '');
                        // Убедитесь, что в сессии есть телефон
                        // setPhone(session.user.phone || ''); 
                    }
                } else {
                    setError("Не удалось загрузить информацию о номере.");
                }
            } catch (err) {
                 setError("Произошла ошибка при загрузке данных.");
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [roomId, session]);

    // Расчет стоимости
    const { totalNights, totalPrice } = useMemo(() => {
        if (!room) return { totalNights: 0, totalPrice: 0 };
        const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
        return { totalNights: nights > 0 ? nights : 0, totalPrice: nights > 0 ? nights * room.price : 0 };
    }, [checkIn, checkOut, room]);

    // ✅ Валидация формы
    const isFormValid = firstName && lastName && email && phone.length > 10;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Пожалуйста, заполните все поля корректно.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
    
        try {
            if (mode === 'change' && currentBookingId) {
                const result = await updateBooking(currentBookingId, checkIn, checkOut);
                if (result) {
                    router.push(`/booking/success?type=change&bookingId=${currentBookingId}`);
                } else {
                    throw new Error("Не удалось изменить бронирование.");
                }
            } else {
                if (!room) throw new Error("Данные о номере отсутствуют.");
                const payload = {
                    roomId: room.id,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    guestName: `${firstName} ${lastName}`,
                    guestEmail: email,
                    guestPhone: phone,
                    totalPrice: totalPrice
                };
                const result = await createBooking(payload);
                if (result?.id) {
                    router.push(`/booking/success?bookingId=${result.id}`);
                } else {
                    throw new Error("Не удалось создать бронирование.");
                }
            }
        } catch (err: any) {
            setError(err.message || "Произошла неизвестная ошибка.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return <div className="text-center py-20">Загружаем детали номера...</div>;
    }

    if (!room) {
        return <div className="text-center py-20">Ошибка: номер не найден.</div>;
    }

    return (
        <main className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold font-karantina mb-8 text-center">Подтверждение бронирования</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Левая колонка: Детали */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Детали вашей поездки</h2>
                        <div className="space-y-2">
                           <p><strong>Номер:</strong> {room.name}</p>
                           <p><strong>Заезд:</strong> {format(new Date(checkIn), 'd MMMM yyyy', { locale: ru })}</p>
                           <p><strong>Выезд:</strong> {format(new Date(checkOut), 'd MMMM yyyy', { locale: ru })}</p>
                           <p><strong>Продолжительность:</strong> {totalNights} ночей</p>
                        </div>
                    </div>

                    {/* ✅ ПОЛНОЦЕННАЯ ФОРМА */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Информация о госте</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Имя</label>
                                <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Фамилия</label>
                                <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md shadow-sm"/>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md shadow-sm"/>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Телефон</label>
                                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+7 (999) 123-45-67" className="mt-1 block w-full p-2 border rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

                {/* Правая колонка: Итог и оплата */}
                <div className="p-6 bg-white rounded-lg shadow h-fit sticky top-24">
                     <h2 className="text-xl font-bold mb-4">Итог</h2>
                     <div className="space-y-2">
                        <p className="flex justify-between">
                            <span>{room.price.toLocaleString('ru-RU')}₽ x {totalNights} ночей</span> 
                            <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </p>
                        {/* Здесь могут быть налоги и сборы */}
                        <p className="flex justify-between text-sm text-gray-500">
                            <span>Налоги и сборы</span> 
                            <span>Включены</span>
                        </p>
                     </div>
                     <hr className="my-4" />
                     <p className="flex justify-between font-bold text-lg">
                        <span>К оплате</span> 
                        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                     </p>
                     <button type="submit" disabled={!isFormValid || isSubmitting} className="mt-6 w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Обработка...' : 'Подтвердить и оплатить'}
                    </button>
                </div>
        </main>
    );
};
