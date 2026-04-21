from fastapi import Request
from fastapi.responses import RedirectResponse

async def check_auth(request: Request):
    """Проверка аутентификации пользователя"""
    user_id = request.session.get("user_id")
    if not user_id:
        return None
    return user_id

def require_auth_redirect(request: Request):
    """Если не аутентифицирован - возвращаем редирект"""
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/admin/login", status_code=302)
    return user_id
