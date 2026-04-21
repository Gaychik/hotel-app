from fastapi import APIRouter, Request, Depends, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud
from app.utils import require_auth_redirect
import json

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/")
async def rooms_list_page(
    request: Request,
    db: Session = Depends(get_db),
    status_filter: str = None,
    search: str = None
):
    auth_result = require_auth_redirect(request)
    if isinstance(auth_result, RedirectResponse):
        return auth_result
    rooms = crud.get_rooms(db, status_filter=status_filter, search=search)
    return templates.TemplateResponse("rooms/list.html", {
        "request": request,
        "rooms": rooms,
        "status_filter": status_filter,
        "search": search,
        "current_user": request.session.get("user_id")
    })

@router.get("/create")
async def create_room_page(request: Request, db: Session = Depends(get_db)):
    auth_result = require_auth_redirect(request)
    if isinstance(auth_result, RedirectResponse):
        return auth_result
    return templates.TemplateResponse("rooms/create.html", {
        "request": request,
        "current_user": request.session.get("user_id")
    })

@router.post("/create")
async def create_room(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    description: str = Form(...),
    price: int = Form(...),
    capacity: int = Form(...),
    status: str = Form("active"),
    discount_percent: int = Form(0),
    amenities: str = Form(""),
    checkIn: str = Form("14:00"),
    checkOut: str = Form("12:00"),
    cancellation: str = Form("Бесплатная отмена за 24 часа"),
    pets: str = Form("Запросить у администратора"),
    images: str = Form("")
):
    # Парсим amenities из строки в список
    amenities_list = [a.strip() for a in amenities.split(",") if a.strip()]
    
    # Парсим images из строки (поддержка обоих форматов: новая строка или запятая)
    if '\n' in images:
        images_list = [img.strip() for img in images.split('\n') if img.strip()]
    else:
        images_list = [img.strip() for img in images.split(',') if img.strip()]

    room_data = {
        "name": name,
        "description": description,
        "price": price,
        "capacity": capacity,
        "status": status,
        "discount_percent": discount_percent,
        "amenities": amenities_list,
        "images": images_list,
        "policies": {
            "checkIn": checkIn,
            "checkOut": checkOut,
            "cancellation": cancellation,
            "pets": pets
        }
    }
    
    room = crud.create_room(db, room_data)
    return RedirectResponse(url="/admin/rooms", status_code=302)

@router.get("/edit/{room_id}")
async def edit_room_page(request: Request, room_id: str, db: Session = Depends(get_db)):
    auth_result = require_auth_redirect(request)
    if isinstance(auth_result, RedirectResponse):
        return auth_result
    
    room = crud.get_room_by_id(db, room_id)
    if not room:
        return RedirectResponse(url="/admin/rooms", status_code=302)
    
    return templates.TemplateResponse("rooms/edit.html", {
        "request": request,
        "room": room,
        "current_user": request.session.get("user_id")
    })

@router.post("/edit/{room_id}")
async def update_room(
    request: Request,
    room_id: str,
    db: Session = Depends(get_db),
    name: str = Form(...),
    description: str = Form(...),
    price: int = Form(...),
    capacity: int = Form(...),
    status: str = Form(...),
    discount_percent: int = Form(0),
    amenities: str = Form(""),
    checkIn: str = Form(...),
    checkOut: str = Form(...),
    cancellation: str = Form(...),
    pets: str = Form(...),
    images: str = Form("")
):
    amenities_list = [a.strip() for a in amenities.split(",") if a.strip()]
    
    # Парсим images из строки (поддержка обоих форматов: новая строка или запятая)
    if '\n' in images:
        images_list = [img.strip() for img in images.split('\n') if img.strip()]
    else:
        images_list = [img.strip() for img in images.split(',') if img.strip()]

    room_data = {
        "name": name,
        "description": description,
        "price": price,
        "capacity": capacity,
        "status": status,
        "discount_percent": discount_percent,
        "amenities": amenities_list,
        "images": images_list,
        "policies": {
            "checkIn": checkIn,
            "checkOut": checkOut,
            "cancellation": cancellation,
            "pets": pets
        }
    }
    
    crud.update_room(db, room_id, room_data)
    return RedirectResponse(url="/admin/rooms", status_code=302)

@router.post("/delete/{room_id}")
async def delete_room(request: Request, room_id: str, db: Session = Depends(get_db)):
    crud.delete_room(db, room_id)
    return RedirectResponse(url="/admin/rooms", status_code=302)

@router.post("/toggle-status/{room_id}")
async def toggle_status(request: Request, room_id: str, db: Session = Depends(get_db)):
    crud.toggle_room_status(db, room_id)
    return RedirectResponse(url="/admin/rooms", status_code=302)
