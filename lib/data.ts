// lib/data.ts

import { roomsData} from '@/data/rooms';
import type { Booking, Profile } from '@/types';
import { DayData } from '@/types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { Room } from '@/types';

// Функция для получения ВСЕХ номеров
// (будет заменена на fetch('/api/rooms'))
export const getAllRooms = async (): Promise<Room[]> => {
  // Имитируем задержку сети, чтобы было похоже на реальный API
  await new Promise(resolve => setTimeout(resolve, 100));
  return roomsData;
};

// Функция для получения ОДНОГО номера по ID
// (будет заменена на fetch(/api/rooms/\))
export const getRoomById = async (id: string): Promise<Room | undefined> => {
  // Имитируем задержку сети

  const room = roomsData.find(r => r.id === id);
  return room;
};



// Определяем, какие данные нам нужны для создания брони
interface CreateBookingPayload {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    totalPrice: number;
}

export const createBooking = async (payload: CreateBookingPayload) => {
    console.log("Создание бронирования с данными:", payload);
    
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500));

    // Находим номер, который бронируют, чтобы добавить его в ответ
    const room = await getRoomById(payload.roomId);
    if (!room) {
        throw new Error("Room not found for booking creation");
    }

    // В реальном приложении здесь будет INSERT-запрос в вашу базу данных.
    // Мы же просто создаем объект бронирования.

    const newBooking = {
        id: `HC-${uuidv4().slice(0, 8).toUpperCase()}`, // Генерируем уникальный ID брони
        room: room,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        guestName: payload.guestName,
        totalPrice: payload.totalPrice,
        status: 'active' as 'active' // Приводим тип
    };

    console.log("Новое бронирование создано:", newBooking);

    // В реальном приложении мы могли бы также обновить
    // `room.availability.bookedDates` для этого номера,
    // но для имитации это не обязательно.
    
    // Возвращаем созданное бронирование, чтобы на странице успеха мы могли его показать.
    return newBooking;
};

// ✅ НОВАЯ АСИНХРОННАЯ ФУНКЦИЯ
/**
 * Получает список номеров, имитируя запрос к API.
 * В будущем здесь будет fetch-запрос.
 * @param requiredCapacity - Опциональный параметр для фильтрации по вместимости.
 */
export const getRooms = async (requiredCapacity: number = 0): Promise<Room[]> => {
  console.log(`Запрашиваем номера с вместимостью >= ${requiredCapacity}...`);

  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));

  // --- В БУДУЩЕМ ЗДЕСЬ БУДЕТ ВАШ FETCH ---
  // const response = await fetch(`https://api.hotel-california.com/v1/rooms?capacity_gte=${requiredCapacity}`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch rooms');
  // }
  // const data = await response.json();
  // return data;
  // -----------------------------------------

  // --- А СЕЙЧАС - МОКОВАЯ ЛОГИКА ---
  if (requiredCapacity > 0) {
    const filteredRooms = roomsData.filter(room => room.capacity >= requiredCapacity);
    return filteredRooms;
  }
  
  return roomsData;
};


export const getBookingById = async (bookingId: string) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 100));

  // Возвращаем 'фейковые' данные, как будто получили их с сервера.
  // Для примера используем первый номер из нашего списка.
  const room = roomsData[0]; 
  
  return {
    id: bookingId,
    room: room,
    checkIn: '2026-10-15', // Пример даты
    checkOut: '2026-10-20', // Пример даты
    totalPrice: 68500, // Пример цены
    guestName: 'Роман Гайчиков' // Пример имени
  };
};


// lib/data.ts
// ... ваши существующие импорты и функции ...

// --- ДАННЫЕ ДЛЯ ЛИЧНОГО КАБИНЕТА ---

// В будущем: fetch('/api/profile')
export const getProfileData = async () : Promise<Profile> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Имитация сети
    return {
        name: 'Роман Гайчиков',
        email: 'roman.g@example.com',
        phone: '+7 (999) 123-45-67'
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

// Функция для отмены бронирования
export const cancelBooking = async (bookingId: string): Promise<Booking | null> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Имитация задержки
    
    // В реальном приложении здесь будет API вызов для отмены бронирования
    // Пока что просто возвращаем обновленное бронирование с новым статусом
    const allBookings = [...await getCurrentBookings(), ...await getPastBookings()];
    const bookingToCancel = allBookings.find(booking => booking.id === bookingId);
    
    if (!bookingToCancel) {
        return null;
    }
    
    // Обновляем статус бронирования
    const updatedBooking = {
        ...bookingToCancel,
        status: 'cancelled'
    };
    
    return updatedBooking as Booking;
};

// Функция для обновления бронирования (изменения дат)
export const updateBooking = async (bookingId: string, newCheckIn: string, newCheckOut: string): Promise<Booking | null> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Имитация задержки
    
    // В реальном приложении здесь будет API вызов для обновления бронирования
    // Пока что просто возвращаем обновленное бронирование с новыми датами
    const allBookings = [...await getCurrentBookings(), ...await getPastBookings()];
    const bookingToUpdate = allBookings.find(booking => booking.id === bookingId);
    
    if (!bookingToUpdate) {
        return null;
    }
    
    // Обновляем даты бронирования
    const updatedBooking = {
        ...bookingToUpdate,
        checkIn: newCheckIn,
        checkOut: newCheckOut
    };
    
    return updatedBooking as Booking;
};

// В будущем он будет выглядеть так:

// ts
// // lib/data.ts - В БУДУЩЕМ
// import { Room } from '@/data/rooms'; // Интерфейс можно оставить

// export const getRoomById = async (id: string): Promise<Room | undefined> => {
//   try {
//     const response = await fetch(\https://your-api.com/api/rooms/\\);
//     if (!response.ok) {
//         return undefined; // или обработать ошибку
//     }
//     const room: Room = await response.json();
//     return room;
//   } catch (error) {
//     console.error('Failed to fetch room:', error);
//     return undefined;
//   }
// };





// ...
// В будущем: fetch(\/api/calendar-data?month=\\)
export const getCalendarDataForMonth = async (month: Date): Promise<DayData[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // Генерируем 'фейковые' данные для каждого дня
    return daysInMonth.map(day => {
        const dayOfMonth = day.getDate();
        let price = 12000;
        let availability: DayData['availability'] = 'free';

        // Имитируем логику ценообразования и доступности
        if (dayOfMonth > 10 && dayOfMonth < 15) { // 'Занятые' даты
            price = 0;
            availability = 'busy';
        } else if (dayOfMonth % 7 === 0 || dayOfMonth % 7 === 1) { // Выходные дороже
            price = 18000;
        } else if (dayOfMonth > 20 && dayOfMonth < 25) { // 'Частично занято'
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

// В будущем: fetch(\/api/rooms/available?checkIn=\&checkOut=\\)
export const getAvailableRoomsByDates = async (checkIn: string, checkOut: string): Promise<Room[]> => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Получаем все номера
  const allRooms = await getAllRooms();
  
  // Преобразуем даты для сравнения
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  
  // Фильтруем доступные номера
  const availableRooms = allRooms.filter(room => {
    // Проверяем, есть ли у номера информация о доступности
    if (!room.availability || !room.availability.bookedDates) {
      return true; // Если нет информации о бронировании, считаем номер доступным
    }
    
    // Проверяем, не пересекается ли запрашиваемый период с забронированными датами
    for (const bookedPeriod of room.availability.bookedDates!) {
      const bookedStart = new Date(bookedPeriod.start);
      const bookedEnd = new Date(bookedPeriod.end);
      
      // Пересечение периодов: (начало1 < конец2) && (конец1 > начало2)
      if (startDate < bookedEnd && endDate > bookedStart) {
        return false; // Номер занят в запрашиваемый период
      }
    }
    
    return true; // Номер доступен
  });
  
  return availableRooms;
};

// Пример будущего кода для подключения к API
// В будущем он будет выглядеть так:

// ts
// // lib/data.ts - В БУДУЩЕМ
// import { Room } from '@/data/rooms'; // Интерфейс можно оставить

// export const getAvailableRoomsByDates = async (checkIn: string, checkOut: string): Promise<Room[]> => {
//   try {
//     const response = await fetch(\https://your-api.com/api/rooms/available?checkIn=\&checkOut=\\);
//     if (!response.ok) {
//         throw new Error(\HTTP error! status: \\);
//     }
//     const rooms: Room[] = await response.json();
//     return rooms;
//   } catch (error) {
//     console.error('Failed to fetch available rooms:', error);
//     throw error;
//   }
// };
