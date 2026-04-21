"""
Скрипт инициализации базы данных начальными данными
Запускать: python scripts/init_db.py
"""

import sys
import os
from datetime import date, datetime

# Добавляем parent directory в path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import engine, SessionLocal, init_db, Base
from app.models import Room, Booking, Discount, User
from app.auth import get_password_hash
from dotenv import load_dotenv

load_dotenv()

def create_initial_admin():
    """Создание начального администратора"""
    db = SessionLocal()
    try:
        username = os.getenv("ADMIN_USERNAME", "admin")
        password = os.getenv("ADMIN_PASSWORD", "admin123")
        
        # Проверяем, существует ли уже админ
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"✓ Администратор '{username}' уже существует")
            return
        
        # Создаем админа
        admin = User(
            username=username,
            hashed_password=get_password_hash(password),
            is_superuser=True
        )
        db.add(admin)
        db.commit()
        print(f"✓ Администратор '{username}' создан")
    finally:
        db.close()

def create_initial_rooms():
    """Создание начальных номеров (из основного проекта)"""
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже номера
        existing_rooms = db.query(Room).count()
        if existing_rooms > 0:
            print(f"✓ Номера уже существуют ({existing_rooms} шт)")
            return
        
        rooms_data = [
            {
                "id": "deluxe-1",
                "name": "Номер Делюкс с видом на море",
                "description": "Просторный и светлый номер с панорамным видом на море и собственной террасой.",
                "images": ["/images/deluxe-1.avif", "/images/deluxe-2.avif"],
                "amenities": ["Wi-Fi", "Кондиционер", "Телевизор", "Мини-бар"],
                "price": 12500,
                "capacity": 2,
                "policies": {
                    "checkIn": "После 14:00",
                    "checkOut": "До 12:00",
                    "cancellation": "Бесплатная отмена за 48 часов до заезда",
                    "pets": "Проживание с животными запрещено"
                },
                "status": "active",
                "discount_percent": 0
            },
            {
                "id": "standart-2",
                "name": "Стандартный двухместный номер",
                "description": "Уютный номер со всем необходимым для комфортного отдыха после долгого дня.",
                "images": ["/images/deluxe-1.avif"],
                "amenities": ["Wi-Fi", "Кондиционер", "Сейф"],
                "price": 7800,
                "capacity": 2,
                "policies": {
                    "checkIn": "После 14:00",
                    "checkOut": "До 12:00",
                    "cancellation": "Бесплатная отмена за 24 часа до заезда",
                    "pets": "Возможно по запросу"
                },
                "status": "active",
                "discount_percent": 0
            },
            {
                "id": "suite-3",
                "name": "Семейный люкс",
                "description": "Идеальный выбор для семейного путешествия. Две спальни и общая гостиная.",
                "images": ["/images/deluxe-1.avif"],
                "amenities": ["Wi-Fi", "Кондиционер", "Телевизор", "Кухня", "Сейф"],
                "price": 18000,
                "capacity": 4,
                "policies": {
                    "checkIn": "После 15:00",
                    "checkOut": "До 12:00",
                    "cancellation": "Отмена невозможна",
                    "pets": "Проживание с животными запрещено"
                },
                "status": "active",
                "discount_percent": 0
            }
        ]
        
        for room_data in rooms_data:
            room = Room(**room_data)
            db.add(room)
        
        db.commit()
        print(f"✓ Создано {len(rooms_data)} номера")
    finally:
        db.close()

def create_sample_bookings():
    """Создание тестовых бронирований"""
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже брони
        existing_bookings = db.query(Booking).count()
        if existing_bookings > 0:
            print(f"✓ Бронирования уже существуют ({existing_bookings} шт)")
            return
        
        bookings_data = [
            {
                "id": "booking-1",
                "room_id": "deluxe-1",
                "guest_name": "Иван Петров",
                "guest_email": "ivan@example.com",
                "guest_phone": "+7 (999) 123-45-67",
                "check_in": date(2026, 4, 25),
                "check_out": date(2026, 4, 30),
                "total_price": 62500,
                "status": "active"
            },
            {
                "id": "booking-2",
                "room_id": "suite-3",
                "guest_name": "Мария Сидорова",
                "guest_email": "maria@example.com",
                "guest_phone": "+7 (999) 765-43-21",
                "check_in": date(2026, 5, 1),
                "check_out": date(2026, 5, 7),
                "total_price": 108000,
                "status": "active"
            }
        ]
        
        for booking_data in bookings_data:
            booking = Booking(**booking_data)
            db.add(booking)
        
        db.commit()
        print(f"✓ Создано {len(bookings_data)} тестовых бронирования")
    finally:
        db.close()

def create_sample_discounts():
    """Создание тестовых скидок"""
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже скидки
        existing_discounts = db.query(Discount).count()
        if existing_discounts > 0:
            print(f"✓ Скидки уже существуют ({existing_discounts} шт)")
            return
        
        discounts_data = [
            {
                "id": "discount-1",
                "title": "Раннее бронирование",
                "description": "Скидка при бронировании за 30 дней до заезда",
                "discount_percent": 15,
                "room_id": None,  # Для всех номеров
                "start_date": date(2026, 4, 1),
                "end_date": date(2026, 12, 31),
                "is_active": True
            },
            {
                "id": "discount-2",
                "title": "Летняя акция",
                "description": "Специальное предложение на летние месяцы",
                "discount_percent": 20,
                "room_id": None,
                "start_date": date(2026, 6, 1),
                "end_date": date(2026, 8, 31),
                "is_active": True
            }
        ]
        
        for discount_data in discounts_data:
            discount = Discount(**discount_data)
            db.add(discount)
        
        db.commit()
        print(f"✓ Создано {len(discounts_data)} скидки")
    finally:
        db.close()

if __name__ == "__main__":
    print("🏨 Инициализация базы данных Hotel California Admin...")
    print()
    
    # Создаем таблицы
    print("📊 Создание таблиц...")
    init_db()
    print("✓ Таблицы созданы")
    print()
    
    # Создаем начальные данные
    create_initial_admin()
    create_initial_rooms()
    create_sample_bookings()
    create_sample_discounts()
    
    print()
    print("🎉 Инициализация завершена!")
    print()
    print("Данные для входа:")
    print(f"  Логин: {os.getenv('ADMIN_USERNAME', 'admin')}")
    print(f"  Пароль: {os.getenv('ADMIN_PASSWORD', 'admin123')}")
    print()
    print("Запуск приложения:")
    print("  python -m uvicorn app.main:app --reload --port 8001")
