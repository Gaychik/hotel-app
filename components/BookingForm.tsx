// components/BookingForm.tsx
'use client';
import { useRouter } from 'next/navigation';
import { getRoomById } from '@/lib/data';
import { Room } from '@/data/rooms';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface BookingFormProps {
    roomId: string;
    checkIn: string;
    checkOut: string;
}

export const BookingForm = ({ roomId, checkIn, checkOut }: BookingFormProps) => {
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
     const router = useRouter();
    
    // Состояния для дополнительных услуг
    const [addBreakfast, setAddBreakfast] = useState(false);
    const [addTransfer, setAddTransfer] = useState(false);


 const handlePayment = () => {
        // --- В реальном приложении здесь будет:
        // 1. Сбор всех данных из формы (имя, телефон, доп. услуги).
        // 2. Отправка запроса на ваш backend API для создания брони.
        // 3. Обработка ответа от платежной системы.
        // 4. В случае успеха - получение bookingId от бэкенда.
        // ---

        // --- Сейчас мы это симулируем: ---
        alert("Оплата прошла успешно! Генерируем подтверждение...");

        // Генерируем случайный номер брони для примера
        const fakeBookingId = `HC-${Math.floor(Math.random() * 90000) + 10000}`;

        // Перенаправляем на страницу подтверждения с ID брони
        router.push(`/booking/success?bookingId=${fakeBookingId}`);
    }

    useEffect(() => {
        const fetchRoom = async () => {
            const roomData = await getRoomById(roomId);
            if (roomData) {
                setRoom(roomData);
            }
            setLoading(false);
        };
        fetchRoom();
    }, [roomId]);
    
    // --- Расчеты стоимости ---
    const totalNights = useMemo(() => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [checkIn, checkOut]);

    const roomTotalPrice = (room?.price ?? 0) * totalNights;
    const breakfastPrice = addBreakfast ? 1200 * totalNights : 0; // Пример: 1200р/ночь
    const transferPrice = addTransfer ? 3000 : 0; // Пример: 3000р
    const finalPrice = roomTotalPrice + breakfastPrice + transferPrice;

    if (loading) {
        return <div className="container mx-auto text-center py-20">Загружаем детали вашего номера...</div>;
    }

    if (!room) {
        return <div className="container mx-auto text-center py-20">Не удалось найти информацию о номере.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold font-karantina mb-8">Оформление брони</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* --- ЛЕВАЯ КОЛОНКА: ФОРМА --- */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Шаг 2: Данные гостя */}
                    <section>
                        <h2 className="text-2xl font-bold font-istok-web mb-4">Данные гостя</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" placeholder="Имя и фамилия" className="p-3 border rounded-md" />
                            <input type="tel" placeholder="Номер телефона" className="p-3 border rounded-md" />
                            <input type="email" placeholder="Email" className="p-3 border rounded-md md:col-span-2" />
                            <textarea placeholder="Комментарии и пожелания" className="p-3 border rounded-md md:col-span-2" rows={4}></textarea>
                        </div>
                    </section>

                    {/* Шаг 3: Доп. услуги */}
                    <section>
                         <h2 className="text-2xl font-bold font-istok-web mb-4">Дополнительные услуги</h2>
                         <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 border rounded-md cursor-pointer">
                                <div>
                                    <h3 className="font-semibold">Завтрак в номер</h3>
                                    <p className="text-sm text-gray-600">1200 ₽ / ночь</p>
                                </div>
                                <input type="checkbox" checked={addBreakfast} onChange={() => setAddBreakfast(!addBreakfast)} className="h-5 w-5 rounded"/>
                            </label>
                             <label className="flex items-center justify-between p-4 border rounded-md cursor-pointer">
                                <div>
                                    <h3 className="font-semibold">Трансфер из аэропорта</h3>
                                    <p className="text-sm text-gray-600">3000 ₽</p>
                                </div>
                                <input type="checkbox" checked={addTransfer} onChange={() => setAddTransfer(!addTransfer)} className="h-5 w-5 rounded"/>
                            </label>
                         </div>
                    </section>
                    
                    {/* Шаг 4: Оплата */}
                    <section>
                        <h2 className="text-2xl font-bold font-istok-web mb-4">Оплата</h2>
                        <div className="p-4 border rounded-md bg-gray-50">
                            {/* Здесь будет виджет оплаты, пока просто заглушка */}
                            <p className="font-semibold">Выберите способ оплаты</p>
                            <div className="flex gap-4 mt-2"><span>СБП</span> <span>Карта</span></div>
                            <label className="flex items-center mt-6">
                                <input type="checkbox" className="h-4 w-4 rounded mr-2" />
                                <span className="text-sm">Я согласен с <a href="#" className="underline">условиями бронирования</a></span>
                            </label>
                             <button 
                                onClick={handlePayment}
                                className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                                Оплатить {finalPrice.toLocaleString()} ₽
                            </button>
                        </div>
                    </section>
                </div>

                {/* --- ПРАВАЯ КОЛОНКА: ИТОГО --- */}
                <div className="lg:sticky top-24 h-fit">
                    <div className="border rounded-lg p-6">
                        {/* Шаг 1: Подтверждение */}
                        <div className="flex items-center pb-4 border-b">
                            <Image src={room.images[0]} alt={room.name} width={100} height={80} className="rounded-md object-cover"/>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Ваш выбор</p>
                                <h3 className="font-semibold">{room.name}</h3>
                            </div>
                        </div>
                        <div className="py-4 border-b space-y-2">
                             <div className="flex justify-between"><span>Заезд:</span><span className="font-semibold">{new Date(checkIn).toLocaleDateString()}</span></div>
                             <div className="flex justify-between"><span>Выезд:</span><span className="font-semibold">{new Date(checkOut).toLocaleDateString()}</span></div>
                        </div>
                        <div className="py-4 border-b space-y-2">
                             <div className="flex justify-between"><span>{room.price.toLocaleString()} ₽ x {totalNights} ночей</span><span>{roomTotalPrice.toLocaleString()} ₽</span></div>
                             {addBreakfast && <div className="flex justify-between"><span>Завтрак</span><span>{breakfastPrice.toLocaleString()} ₽</span></div>}
                             {addTransfer && <div className="flex justify-between"><span>Трансфер</span><span>{transferPrice.toLocaleString()} ₽</span></div>}
                        </div>
                        <div className="py-4">
                             <div className="flex justify-between text-xl font-bold"><span>Итого:</span><span>{finalPrice.toLocaleString()} ₽</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
