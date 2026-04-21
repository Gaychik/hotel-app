from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse, HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from app.database import engine, get_db, init_db
from app.routes import dashboard, rooms, bookings, discounts, users, auth as auth_router
from app import crud
from app.auth import verify_password
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Hotel California Admin Panel")

# Session middleware для cookie-based сессий
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "secret"),
    session_cookie="admin_session",
    max_age=60 * 60 * 24  # 24 часа
)

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Initialize database
init_db()

# Root redirect
@app.get("/")
async def root():
    return RedirectResponse(url="/admin/login", status_code=302)

# Login routes
@app.get("/admin/login")
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/admin/login")
async def login(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    username = form.get("username")
    password = form.get("password")
    
    user = crud.get_user_by_username(db, username)
    if user and verify_password(password, user.hashed_password):
        request.session["user_id"] = user.id
        return RedirectResponse(url="/admin/dashboard", status_code=302)
    
    return templates.TemplateResponse("login.html", {
        "request": request,
        "error": "Неверный логин или пароль"
    })

@app.get("/admin/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/admin/login", status_code=302)

# Include routers
app.include_router(dashboard.router, prefix="/admin/dashboard", tags=["dashboard"])
app.include_router(rooms.router, prefix="/admin/rooms", tags=["rooms"])
app.include_router(bookings.router, prefix="/admin/bookings", tags=["bookings"])
app.include_router(discounts.router, prefix="/admin/discounts", tags=["discounts"])
app.include_router(users.router, prefix="/admin/users", tags=["users"])

# Dependency для проверки аутентификации
async def require_auth(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/admin/login", status_code=302)
    
    db = next(get_db())
    try:
        user = crud.get_user_by_id(db, user_id)
        if not user:
            request.session.clear()
            return RedirectResponse(url="/admin/login", status_code=302)
    finally:
        db.close()
    
    return user_id

# Защищенные роуты через dependency
@app.get("/admin/dashboard/protected")
async def dashboard_protected(request: Request, user_id=Depends(require_auth)):
    from app.routes.dashboard import dashboard_page
    return await dashboard_page(request)
