// lib/data.ts

import { roomsData, Room } from '@/data/rooms';
import type { Booking, Profile } from '@/types';
import { DayData } from '@/types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
// Функция для получения ВСЕХ номеров
// (будет заменена на fetch('/api/rooms'))
export const getAllRooms = async (): Promise<Room[]> => {
  // Имитируем задержку сети, чтобы было похоже на реальный API
  await new Promise(resolve => setTimeout(resolve, 100));
  return roomsData;
};

// Функция для получения ОДНОГО номера по ID
// (будет заменена на fetch(`/api/rooms/${id}`))
export const getRoomById = async (id: string): Promise<Room | undefined> => {
  // Имитируем задержку сети

  const room = roomsData.find(r => r.id === id);
  return room;
};

export const getBookingById = async (bookingId: string) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 100));

  // Возвращаем "фейковые" данные, как будто получили их с сервера.
  // Для примера используем первый номер из нашего списка.
  const room = roomsData[0]; 
  
  return {
    id: bookingId,
    room: room,
    checkIn: "2026-10-15", // Пример даты
    checkOut: "2026-10-20", // Пример даты
    totalPrice: 68500, // Пример цены
    guestName: "Роман Гайчиков" // Пример имени
  };
};


// lib/data.ts
// ... ваши существующие импорты и функции ...

// --- ДАННЫЕ ДЛЯ ЛИЧНОГО КАБИНЕТА ---

// В будущем: fetch('/api/profile')
export const getProfileData = async () : Promise<Profile> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Имитация сети
    return {
        name: "Роман Гайчиков",
        email: "roman.g@example.com",
        phone: "+7 (999) 123-45-67"
    };
};

// В будущем: fetch('/api/bookings/current')
export const getCurrentBookings = async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
        {
            id: 'HC-11223',
            room: roomsData[1], // Стандартный двухместный
            checkIn: '2026-02-10',
            checkOut: '2026-02-15',
            status: 'active'
        }
    ];
};

// В будущем: fetch('/api/bookings/history')
export const getPastBookings = async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
        {
            id: 'HC-09876',
            room: roomsData[0], // Делюкс
            checkIn: '2025-12-20',
            checkOut: '2025-12-25',
            status: 'completed'
        },
        {
            id: 'HC-05432',
            room: roomsData[2], // Семейный люкс
            checkIn: '2025-08-01',
            checkOut: '2025-08-10',
            status: 'completed'
        }
    ];
};

// В будущем он будет выглядеть так:

// ts
// // lib/data.ts - В БУДУЩЕМ
// import { Room } from '@/data/rooms'; // Интерфейс можно оставить

// export const getRoomById = async (id: string): Promise<Room | undefined> => {
//   try {
//     const response = await fetch(`https://your-api.com/api/rooms/${id}`);
//     if (!response.ok) {
//         return undefined; // или обработать ошибку
//     }
//     const room: Room = await response.json();
//     return room;
//   } catch (error) {
//     console.error("Failed to fetch room:", error);
//     return undefined;
//   }
// };





// ...

// В будущем: fetch(`/api/calendar-data?month=${...}`)
export const getCalendarDataForMonth = async (month: Date): Promise<DayData[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // Генерируем "фейковые" данные для каждого дня
    return daysInMonth.map(day => {
        const dayOfMonth = day.getDate();
        let price = 12000;
        let availability: DayData['availability'] = 'free';

        // Имитируем логику ценообразования и доступности
        if (dayOfMonth > 10 && dayOfMonth < 15) { // "Занятые" даты
            price = 0;
            availability = 'busy';
        } else if (dayOfMonth % 7 === 0 || dayOfMonth % 7 === 1) { // Выходные дороже
            price = 18000;
        } else if (dayOfMonth > 20 && dayOfMonth < 25) { // "Частично занято"
            price = 15000;
            availability = 'partial';
        }

        return {
            date: day,
            price,
            availability,
        };
    });
};