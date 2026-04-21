from sqlalchemy import Column, String, Integer, Text, Date, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    images = Column(JSON, default=list)  # Массив URL изображений
    amenities = Column(JSON, default=list)  # Массив удобств
    price = Column(Integer, nullable=False)  # Цена за ночь
    capacity = Column(Integer, nullable=False)  # Вместимость
    policies = Column(JSON, default=lambda: {
        "checkIn": "14:00",
        "checkOut": "12:00",
        "cancellation": "Бесплатная отмена за 24 часа",
        "pets": "Запросить у администратора"
    })
    status = Column(String, default="active")  # active, inactive, maintenance
    discount_percent = Column(Integer, default=0)  # Процент скидки
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    bookings = relationship("Booking", back_populates="room")
    discounts = relationship("Discount", back_populates="room")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=False)
    guest_phone = Column(String, nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    total_price = Column(Integer, nullable=False)
    status = Column(String, default="active")  # active, completed, cancelled
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    room = relationship("Room", back_populates="bookings")

class Discount(Base):
    __tablename__ = "discounts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    discount_percent = Column(Integer, nullable=False)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=True)  # NULL = для всех номеров
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    room = relationship("Room", back_populates="discounts")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
