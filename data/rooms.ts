// data/rooms.ts

import { Room } from "@/types";


export const roomsData: Room[] = [
  {
    id: 'deluxe-1',
    name: 'Номер Делюкс с видом на море',
    description: 'Просторный и светлый номер с панорамным видом на море и собственной террасой.',
    images: [
      '/images/deluxe-1.avif',
      '/images/deluxe-2.avif'
    ],
    amenities: ['Wi-Fi', 'Кондиционер', 'Телевизор', 'Мини-бар'],
    price: 12500,
    policies: {
      checkIn: 'После 14:00',
      checkOut: 'До 12:00',
      cancellation: 'Бесплатная отмена за 48 часов до заезда',
      pets: 'Проживание с животными запрещено'
    },
    capacity: 2,
    // Добавляем информацию о доступности
    availability: {
      bookedDates: [
        { start: '2026-03-15', end: '2026-03-20' },
        { start: '2026-03-25', end: '2026-03-30' }
      ]
    }
  },
  {
    id: 'standart-2',
    name: 'Стандартный двухместный номер',
    description: 'Уютный номер со всем необходимым для комфортного отдыха после долгого дня.',
    images: ['/images/deluxe-1.avif'],
    amenities: ['Wi-Fi', 'Кондиционер', 'Сейф'],
    price: 7800,
     capacity: 2,
    policies: {
      checkIn: 'После 14:00',
      checkOut: 'До 12:00',
      cancellation: 'Бесплатная отмена за 24 часа до заезда',
      pets: 'Возможно по запросу'
    },
    // Добавляем информацию о доступности
    availability: {
      bookedDates: [
        { start: '2026-03-10', end: '2026-03-12' }
      ]
    }
  },
  {
    id: 'suite-3',
    name: 'Семейный люкс',
    description: 'Идеальный выбор для семейного путешествия. Две спальни и общая гостиная.',
    images: ['/images/deluxe-1.avif'],
    amenities: ['Wi-Fi', 'Кондиционер', 'Телевизор', 'Кухня', 'Сейф'],
    price: 18000,
    capacity: 4,
    policies: {
      checkIn: 'После 15:00',
      checkOut: 'До 12:00',
      cancellation: 'Отмена невозможна',
      pets: 'Проживание с животными запрещено'
    },
    // Добавляем информацию о доступности
    availability: {
      bookedDates: [
        { start: '2026-03-05', end: '2026-03-25' }
      ]
    }
  }
];

