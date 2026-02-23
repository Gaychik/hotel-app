// components/BookingForm.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Для автозаполнения
import { getRoomById, createBooking, updateBooking } from '@/lib/data';
import type { Room } from '@/types';
import { differenceInCalendarDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { SunIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'; // Иконки для услуг


interface BookingFormProps {
  roomId: string;
  checkIn: string;
  checkOut: string;
  currentBookingId?: string;
  mode?: 'new' | 'change';
}




export const BookingForm = ({ roomId, checkIn, checkOut, currentBookingId, mode = 'new' }: BookingFormProps) => {
    const TAX_RATE = 0.05; // 5%
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
    const [extraBreakfast, setExtraBreakfast] = useState(false);
    const [extraTransfer, setExtraTransfer] = useState(false);
    // ✅ Загружаем данные о номере и автозаполняем форму
  useEffect(() => {
        const loadInitialData = async () => {
            try {
                const roomData = await getRoomById(roomId);
                if (roomData) {
                    setRoom(roomData);
                    
                    // --- ✅ УМНОЕ АВТОЗАПОЛНЕНИЕ ---
                    if (session?.user) {
                        // 1. Обрабатываем имя
                        const nameParts = session.user.name?.split(' ') || [];
                        setFirstName(nameParts[0] || '');
                        setLastName(nameParts.slice(1).join(' ') || '');

                        // 2. Подставляем email, ТОЛЬКО ЕСЛИ ОН ЕСТЬ
                        if (session.user.email) {
                            setEmail(session.user.email);
                        }

                        // 3. Подставляем телефон, ТОЛЬКО ЕСЛИ ОН ЕСТЬ
                        // Мы используем 'as any', потому что наш d.ts файл уже применился,
                        // но иногда TypeScript может кэшировать старые типы.
                        const userPhone = (session.user as any).phone;
                        if (userPhone) {
                            setPhone(userPhone);
                        }
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
    const { totalNights, baseRoomPrice, breakfastCost, transferCost, taxes, totalPrice } = useMemo(() => {
        if (!room) return { totalNights: 0, baseRoomPrice: 0, breakfastCost: 0, transferCost: 0, taxes: 0, totalPrice: 0 };
        
        const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
        if (nights <= 0) return { totalNights: 0, baseRoomPrice: 0, breakfastCost: 0, transferCost: 0, taxes: 0, totalPrice: 0 };

        const BREAKFAST_PRICE_PER_NIGHT = 1500;
        const TRANSFER_PRICE = 3000;
      

        const roomPrice = nights * room.price;
        const breakfastTotal = extraBreakfast ? BREAKFAST_PRICE_PER_NIGHT * nights : 0;
        const transferTotal = extraTransfer ? TRANSFER_PRICE : 0;

        const subtotal = roomPrice + breakfastTotal + transferTotal;
        const taxAmount = subtotal * TAX_RATE;
        const finalPrice = subtotal + taxAmount;

        return {
            totalNights: nights,
            baseRoomPrice: roomPrice,
            breakfastCost: breakfastTotal,
            transferCost: transferTotal,
            taxes: taxAmount,
            totalPrice: finalPrice,
        };
    }, [checkIn, checkOut, room, extraBreakfast, extraTransfer]);

    // ✅ Валидация формы
 
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
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = phone.replace(/\D/g, '').length === 11; // Проверяем, что в номере ровно 11 цифр
    const isFormValid = firstName && lastName && isEmailValid && isPhoneValid;
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
        <main  className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold font-karantina mb-8 text-center">Подтверждение бронирования</h1>
            <form onSubmit={handleSubmit}>
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
                    <div className="p-6 bg-white rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Добавить к поездке</h2>
                            <div className="space-y-4">
                                <label htmlFor="extraBreakfast" className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                                    <div className="flex items-center">
                                        <SunIcon className="h-6 w-6 text-yellow-500 mr-4"/>
                                        <div>
                                            <span className="font-semibold">Завтрак "шведский стол"</span>
                                            <p className="text-sm text-gray-500">1,500 ₽ / ночь</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" id="extraBreakfast" checked={extraBreakfast} onChange={e => setExtraBreakfast(e.target.checked)} className="h-5 w-5 rounded text-black focus:ring-black"/>
                                </label>
                                <label htmlFor="extraTransfer" className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                                    <div className="flex items-center">
                                        <PaperAirplaneIcon className="h-6 w-6 text-blue-500 mr-4 -rotate-45"/>
                                        <div>
                                            <span className="font-semibold">Трансфер из аэропорта</span>
                                            <p className="text-sm text-gray-500">3,000 ₽</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" id="extraTransfer" checked={extraTransfer} onChange={e => setExtraTransfer(e.target.checked)} className="h-5 w-5 rounded text-black focus:ring-black"/>
                                </label>
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
                              <input 
                                    type="tel" 
                                    id="phone" 
                                    value={phone} 
                                    onChange={handlePhoneChange} // <-- ПРИМЕНЯЕМ МАСКУ
                                    required 
                                    placeholder="+7 (999) 123-45-67" 
                                    maxLength={18} // Ограничение для форматированного номера
                                    className="mt-1 block w-full p-2 border rounded-md shadow-sm"
                                />
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
                        {error && (
                            <p className="text-sm text-center text-red-600 my-4">{error}</p>
                        )}
                        
                            {/* ✅ NEW: Детализация дополнительных услуг */}
                            {extraBreakfast && (
                                <p className="flex justify-between text-gray-600 transition-opacity">
                                    <span>Завтрак</span>
                                    <span>+ {breakfastCost.toLocaleString('ru-RU')} ₽</span>
                                </p>
                            )}
                            {extraTransfer && (
                                <p className="flex justify-between text-gray-600 transition-opacity">
                                    <span>Трансфер</span>
                                    <span>+ {transferCost.toLocaleString('ru-RU')} ₽</span>
                                </p>
                            )}
                            <p className="flex justify-between text-gray-600">
                                <span>Налоги и сборы ({TAX_RATE * 100}%)</span> 
                                <span>+ {taxes.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span>
                            </p>
                     </div>
                     <hr className="my-4" />
                     <p className="flex justify-between font-bold text-lg">
                        <span>К оплате</span> 
                        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                     </p>
                   <button 
                        type="submit" 
                        disabled={!isFormValid || isSubmitting} 
                        className="mt-6 w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Обработка...' : 'Подтвердить и оплатить'}
                    </button>
                </div>
         </form>
        </main>
    );
};
