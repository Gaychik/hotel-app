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
async def bookings_list_page(
    request: Request,
    db: Session = Depends(get_db),
    status_filter: str = None,
    search: str = None
):
    auth_result = require_auth_redirect(request)
    if isinstance(auth_result, RedirectResponse):
        return auth_result
    bookings = crud.get_bookings(db, status_filter=status_filter, search=search)
    return templates.TemplateResponse("bookings/list.html", {
        "request": request,
        "bookings": bookings,
        "status_filter": status_filter,
        "search": search,
        "current_user": request.session.get("user_id")
    })

@router.post("/update-status/{booking_id}")
async def update_booking_status(
    request: Request,
    booking_id: str,
    db: Session = Depends(get_db),
    status: str = Form(...)
):
    crud.update_booking_status(db, booking_id, status)
    return RedirectResponse(url="/admin/bookings", status_code=302)
