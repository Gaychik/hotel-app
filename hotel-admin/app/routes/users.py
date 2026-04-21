from fastapi import APIRouter, Request, Depends, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud
from app.auth import get_password_hash
from app.utils import require_auth_redirect

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/")
async def users_list_page(request: Request, db: Session = Depends(get_db)):
    auth_result = require_auth_redirect(request)
    if isinstance(auth_result, RedirectResponse):
        return auth_result
    users = crud.get_all_users(db)
    return templates.TemplateResponse("users/list.html", {
        "request": request,
        "users": users,
        "current_user": request.session.get("user_id")
    })

@router.post("/create")
async def create_user(
    request: Request,
    db: Session = Depends(get_db),
    username: str = Form(...),
    password: str = Form(...),
    is_superuser: bool = Form(False)
):
    hashed_password = get_password_hash(password)
    crud.create_user(db, username, hashed_password, is_superuser)
    return RedirectResponse(url="/admin/users", status_code=302)

@router.post("/delete/{user_id}")
async def delete_user(request: Request, user_id: str, db: Session = Depends(get_db)):
    crud.delete_user(db, user_id)
    return RedirectResponse(url="/admin/users", status_code=302)
