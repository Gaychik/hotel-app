// types.ts

// Тип для одного номера, который мы уже использовали

export interface Room {
  id: string;
  name: string;
  description: string;
  images: string[];
  amenities: string[];
  price: number;
  capacity: number; 
  // НОВОЕ ПОЛЕ
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    pets: string;
  };
  // Добавляем поля для отслеживания доступности по датам
  availability?: {
    // Массив забронированных периодов
    bookedDates?: {
      start: string; // формат 'YYYY-MM-DD'
      end: string;   // формат 'YYYY-MM-DD'
    }[];
    // Массив частично забронированных периодов (например, когда частично забронированы удобства)
    partialDates?: {
      start: string; // формат 'YYYY-MM-DD'
      end: string;   // формат 'YYYY-MM-DD'
    }[];
  };
}

// Тип для данных профиля пользователя
export interface Profile {
  name: string;
  email: string;
  phone: string;
}

// Универсальный тип для бронирования (и текущего, и прошлого)
export interface Booking {
  id: string;
  room: Room; // Включаем полную информацию о номере
  checkIn: string;
  checkOut: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Тип для данных, которые описывают один день в календаре
export interface DayData {
  date: Date;
  price: number;
  availability: 'free' | 'partial' | 'busy';
  discount?: number; // Процент скидки
  event?: string; // Название события, например "Фестиваль"
}