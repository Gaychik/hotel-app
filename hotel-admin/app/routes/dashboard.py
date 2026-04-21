from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud
from app.utils import require_auth_redirect
from datetime import date

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/")
async def dashboard_page(request: Request, db: Session = Depends(get_db)):
    # Проверяем аутентификацию
    auth_result = require_auth_redirect(request)
    if isinstance(auth_result, RedirectResponse):
        return auth_result
    
    user_id = auth_result
    
    # Получаем статистику
    room_stats = crud.get_room_stats(db)
    booking_stats = crud.get_booking_stats(db)
    recent_bookings = crud.get_recent_bookings(db, limit=10)
    
    # Общая загруженность
    total_rooms = room_stats["total"]
    active_bookings = booking_stats["active"]
    occupancy_rate = round((active_bookings / total_rooms * 100), 1) if total_rooms > 0 else 0
    
    return templates.TemplateResponse("dashboard/index.html", {
        "request": request,
        "room_stats": room_stats,
        "booking_stats": booking_stats,
        "recent_bookings": recent_bookings,
        "occupancy_rate": occupancy_rate,
        "current_user": user_id
    })
