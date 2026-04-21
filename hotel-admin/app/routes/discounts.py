from fastapi import APIRouter, Request, Depends, Form
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
async def discounts_list_page(request: Request, db: Session = Depends(get_db)):
    auth_result = require_auth_redirect(request)
    if isinstance(auth_result, RedirectResponse):
        return auth_result
    discounts = crud.get_discounts(db)
    rooms = crud.get_rooms(db)
    
    return templates.TemplateResponse("discounts/list.html", {
        "request": request,
        "discounts": discounts,
        "rooms": rooms,
        "current_user": request.session.get("user_id")
    })

@router.post("/create")
async def create_discount(
    request: Request,
    db: Session = Depends(get_db),
    title: str = Form(...),
    description: str = Form(...),
    discount_percent: int = Form(...),
    room_id: str = Form(None),
    start_date: str = Form(...),
    end_date: str = Form(...),
    is_active: bool = Form(True)
):
    discount_data = {
        "title": title,
        "description": description,
        "discount_percent": discount_percent,
        "room_id": room_id if room_id else None,
        "start_date": date.fromisoformat(start_date),
        "end_date": date.fromisoformat(end_date),
        "is_active": is_active
    }
    
    crud.create_discount(db, discount_data)
    return RedirectResponse(url="/admin/discounts", status_code=302)

@router.post("/update/{discount_id}")
async def update_discount(
    request: Request,
    discount_id: str,
    db: Session = Depends(get_db),
    title: str = Form(...),
    description: str = Form(...),
    discount_percent: int = Form(...),
    room_id: str = Form(None),
    start_date: str = Form(...),
    end_date: str = Form(...),
    is_active: bool = Form(True)
):
    discount_data = {
        "title": title,
        "description": description,
        "discount_percent": discount_percent,
        "room_id": room_id if room_id else None,
        "start_date": date.fromisoformat(start_date),
        "end_date": date.fromisoformat(end_date),
        "is_active": is_active
    }
    
    crud.update_discount(db, discount_id, discount_data)
    return RedirectResponse(url="/admin/discounts", status_code=302)

@router.post("/delete/{discount_id}")
async def delete_discount(request: Request, discount_id: str, db: Session = Depends(get_db)):
    crud.delete_discount(db, discount_id)
    return RedirectResponse(url="/admin/discounts", status_code=302)

@router.post("/toggle/{discount_id}")
async def toggle_discount(request: Request, discount_id: str, db: Session = Depends(get_db)):
    crud.toggle_discount_active(db, discount_id)
    return RedirectResponse(url="/admin/discounts", status_code=302)
