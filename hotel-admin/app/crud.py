from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models import Room, Booking, Discount, User
from datetime import date, datetime
from typing import Optional, List
import json

# ==================== ROOMS CRUD ====================

def get_rooms(db: Session, skip: int = 0, limit: int = 100, status_filter: Optional[str] = None, search: Optional[str] = None):
    query = db.query(Room)
    
    if status_filter:
        query = query.filter(Room.status == status_filter)
    
    if search:
        query = query.filter(Room.name.ilike(f"%{search}%"))
    
    return query.order_by(Room.created_at.desc()).offset(skip).limit(limit).all()

def get_room_by_id(db: Session, room_id: str):
    return db.query(Room).filter(Room.id == room_id).first()

def create_room(db: Session, room_data: dict):
    db_room = Room(
        id=room_data.get("id"),
        name=room_data["name"],
        description=room_data["description"],
        images=room_data.get("images", []),
        amenities=room_data.get("amenities", []),
        price=room_data["price"],
        capacity=room_data["capacity"],
        policies=room_data.get("policies", {}),
        status=room_data.get("status", "active"),
        discount_percent=room_data.get("discount_percent", 0)
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def update_room(db: Session, room_id: str, room_data: dict):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    if not db_room:
        return None
    
    for key, value in room_data.items():
        if hasattr(db_room, key):
            setattr(db_room, key, value)
    
    db.commit()
    db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: str):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    if not db_room:
        return False
    
    db.delete(db_room)
    db.commit()
    return True

def toggle_room_status(db: Session, room_id: str):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    if not db_room:
        return None
    
    status_map = {"active": "inactive", "inactive": "active", "maintenance": "active"}
    db_room.status = status_map.get(db_room.status, "active")
    
    db.commit()
    db.refresh(db_room)
    return db_room

def get_room_stats(db: Session):
    total_rooms = db.query(Room).count()
    active_rooms = db.query(Room).filter(Room.status == "active").count()
    inactive_rooms = db.query(Room).filter(Room.status == "inactive").count()
    maintenance_rooms = db.query(Room).filter(Room.status == "maintenance").count()
    
    return {
        "total": total_rooms,
        "active": active_rooms,
        "inactive": inactive_rooms,
        "maintenance": maintenance_rooms
    }

# ==================== BOOKINGS CRUD ====================

def get_bookings(db: Session, skip: int = 0, limit: int = 100, 
                 status_filter: Optional[str] = None, 
                 date_from: Optional[date] = None,
                 date_to: Optional[date] = None,
                 search: Optional[str] = None):
    query = db.query(Booking).join(Room)
    
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    
    if date_from:
        query = query.filter(Booking.check_in >= date_from)
    
    if date_to:
        query = query.filter(Booking.check_out <= date_to)
    
    if search:
        query = query.filter(
            (Booking.guest_name.ilike(f"%{search}%")) |
            (Booking.guest_email.ilike(f"%{search}%"))
        )
    
    return query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()

def get_booking_by_id(db: Session, booking_id: str):
    return db.query(Booking).join(Room).filter(Booking.id == booking_id).first()

def update_booking_status(db: Session, booking_id: str, status: str):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not db_booking:
        return None
    
    db_booking.status = status
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_booking_stats(db: Session):
    total_bookings = db.query(Booking).count()
    active_bookings = db.query(Booking).filter(Booking.status == "active").count()
    completed_bookings = db.query(Booking).filter(Booking.status == "completed").count()
    cancelled_bookings = db.query(Booking).filter(Booking.status == "cancelled").count()
    
    # Доход за текущий месяц
    today = date.today()
    month_start = today.replace(day=1)
    monthly_revenue = db.query(func.sum(Booking.total_price)).filter(
        Booking.status == "completed",
        Booking.created_at >= month_start
    ).scalar() or 0
    
    # Доход за все время
    total_revenue = db.query(func.sum(Booking.total_price)).filter(
        Booking.status == "completed"
    ).scalar() or 0
    
    return {
        "total": total_bookings,
        "active": active_bookings,
        "completed": completed_bookings,
        "cancelled": cancelled_bookings,
        "monthly_revenue": monthly_revenue,
        "total_revenue": total_revenue
    }

def get_recent_bookings(db: Session, limit: int = 10):
    return db.query(Booking).join(Room).order_by(Booking.created_at.desc()).limit(limit).all()

# ==================== DISCOUNTS CRUD ====================

def get_discounts(db: Session, active_only: bool = False):
    query = db.query(Discount).join(Room, isouter=True)
    
    if active_only:
        query = query.filter(Discount.is_active == True)
    
    return query.order_by(Discount.created_at.desc()).all()

def get_discount_by_id(db: Session, discount_id: str):
    return db.query(Discount).filter(Discount.id == discount_id).first()

def create_discount(db: Session, discount_data: dict):
    db_discount = Discount(
        title=discount_data["title"],
        description=discount_data["description"],
        discount_percent=discount_data["discount_percent"],
        room_id=discount_data.get("room_id"),  # None = для всех номеров
        start_date=discount_data["start_date"],
        end_date=discount_data["end_date"],
        is_active=discount_data.get("is_active", True)
    )
    db.add(db_discount)
    db.commit()
    db.refresh(db_discount)
    return db_discount

def update_discount(db: Session, discount_id: str, discount_data: dict):
    db_discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not db_discount:
        return None
    
    for key, value in discount_data.items():
        if hasattr(db_discount, key):
            setattr(db_discount, key, value)
    
    db.commit()
    db.refresh(db_discount)
    return db_discount

def delete_discount(db: Session, discount_id: str):
    db_discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not db_discount:
        return False
    
    db.delete(db_discount)
    db.commit()
    return True

def toggle_discount_active(db: Session, discount_id: str):
    db_discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not db_discount:
        return None
    
    db_discount.is_active = not db_discount.is_active
    db.commit()
    db.refresh(db_discount)
    return db_discount

# ==================== USERS CRUD ====================

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, username: str, hashed_password: str, is_superuser: bool = False):
    db_user = User(
        username=username,
        hashed_password=hashed_password,
        is_superuser=is_superuser
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_all_users(db: Session):
    return db.query(User).order_by(User.created_at.desc()).all()

def delete_user(db: Session, user_id: str):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True
