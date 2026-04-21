# Hotel California - Админ-панель

Полнофункциональная админ-панель для управления отелем, созданная на **FastAPI + Jinja2 + SQLite** с сохранением стилистики основного приложения.

## 🎯 Возможности

### Управление номерами
- ✅ Создание, редактирование и удаление номеров
- ✅ Управление статусами (активен, неактивен, на обслуживании)
- ✅ Настройка цен и скидок
- ✅ Управление удобствами и правилами проживания
- ✅ Загрузка изображений
- ✅ Фильтрация и поиск

### Управление бронированиями
- ✅ Просмотр всех бронирований
- ✅ Изменение статусов (активно, завершено, отменено)
- ✅ Фильтрация по статусу и датам
- ✅ Поиск по имени/email гостя
- ✅ Детальная информация о каждом бронировании

### Скидки и акции
- ✅ Создание скидок для всех номеров или конкретных
- ✅ Настройка процентных скидок
- ✅ Управление датами действия
- ✅ Активация/деактивация акций
- ✅ Визуальные карточки скидок

### Управление пользователями
- ✅ Создание администраторов
- ✅ Разделение ролей (админ, суперадмин)
- ✅ Управление правами доступа
- ✅ Безопасное хранение паролей (bcrypt)

### Аналитика (Dashboard)
- ✅ Общая статистика по номерам
- ✅ Количество активных бронирований
- ✅ Доход за месяц и за все время
- ✅ Процент загруженности отеля
- ✅ Таблица последних бронирований

## 🛠 Технологии

- **Backend**: FastAPI 0.109.0
- **Шаблоны**: Jinja2 (Server-Side Rendering)
- **База данных**: SQLite + SQLAlchemy 2.0.25
- **Аутентификация**: JWT + bcrypt
- **Стили**: TailwindCSS (CDN)
- **Шрифты**: Te же, что в основном приложении (Karantina, Inter, Source Serif 4)

## 📋 Требования

- Python 3.8+
- pip (Python package manager)

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd hotel-admin
pip install -r requirements.txt
```

### 2. Инициализация базы данных

```bash
python scripts/init_db.py
```

Этот скрипт:
- Создаст SQLite базу данных
- Создаст таблицы (rooms, bookings, discounts, users)
- Добавит начальные номера из основного проекта
- Создаст тестовые бронирования и скидки
- Создаст администратора (логин: `admin`, пароль: `admin123`)

### 3. Запуск приложения

```bash
python -m uvicorn app.main:app --reload --port 8001
```

### 4. Открыть админ-панель

Перейдите в браузере: **http://localhost:8001**

Войдите с учетными данными:
- **Логин**: `admin`
- **Пароль**: `admin123`

## 📁 Структура проекта

```
hotel-admin/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI приложение
│   ├── database.py             # Настройка SQLAlchemy
│   ├── models.py               # Модели БД (Room, Booking, Discount, User)
│   ├── crud.py                 # CRUD операции
│   ├── auth.py                 # Аутентификация
│   └── routes/
│       ├── dashboard.py        # Дашборд с аналитикой
│       ├── rooms.py            # Управление номерами
│       ├── bookings.py         # Управление бронированиями
│       ├── discounts.py        # Скидки и акции
│       └── users.py            # Управление пользователями
├── templates/
│   ├── base.html               # Базовый шаблон
│   ├── login.html              # Страница входа
│   ├── dashboard/
│   │   └── index.html          # Главная страница
│   ├── rooms/
│   │   ├── list.html           # Список номеров
│   │   ├── create.html         # Создание номера
│   │   └── edit.html           # Редактирование номера
│   ├── bookings/
│   │   └── list.html           # Список бронирований
│   ├── discounts/
│   │   └── list.html           # Скидки
│   └── users/
│       └── list.html           # Пользователи
├── static/
│   ├── css/
│   │   └── style.css           # Кастомные стили
│   └── js/
│       └── main.js             # JavaScript
├── scripts/
│   └── init_db.py              # Скрипт инициализации БД
├── data/
│   └── hotel.db                # SQLite база (создается автоматически)
├── requirements.txt
├── .env                        # Переменные окружения
└── README.md
```

## ⚙️ Настройка

### Переменные окружения (.env)

```env
SECRET_KEY=your-secret-key-here-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
DATABASE_URL=sqlite:///./data/hotel.db
```

**Важно**: В продакшене обязательно измените `SECRET_KEY` и пароли!

## 🎨 Стилистика

Админ-панель использует те же визуальные элементы, что и основное приложение:

- **Шрифты**:
  - Karantina - для заголовков
  - Inter - для основного текста
  - Source Serif 4 - для подзаголовков
  - Istok Web - для вспомогательного текста

- **Цвета**: Белые карточки, серые фоны, синие акценты
- **Элементы**: rounded-2xl, shadow-xl, hover-эффекты
- **Иконки**: Heroicons (SVG)

## 🔐 Безопасность

- Пароли хешируются через bcrypt
- Сессии хранятся в cookie с шифрованием
- Все админские страницы защищены аутентификацией
- CSRF защита через формы

## 📊 API Endpoints

### Аутентификация
- `GET /admin/login` - страница входа
- `POST /admin/login` - обработка входа
- `GET /admin/logout` - выход

### Дашборд
- `GET /admin/dashboard` - главная страница с аналитикой

### Номера
- `GET /admin/rooms` - список номеров
- `GET /admin/rooms/create` - форма создания
- `POST /admin/rooms/create` - создание номера
- `GET /admin/rooms/edit/{id}` - форма редактирования
- `POST /admin/rooms/edit/{id}` - обновление номера
- `POST /admin/rooms/delete/{id}` - удаление
- `POST /admin/rooms/toggle-status/{id}` - переключение статуса

### Бронирования
- `GET /admin/bookings` - список бронирований
- `POST /admin/bookings/update-status/{id}` - обновление статуса

### Скидки
- `GET /admin/discounts` - список скидок
- `POST /admin/discounts/create` - создание скидки
- `POST /admin/discounts/update/{id}` - обновление
- `POST /admin/discounts/delete/{id}` - удаление
- `POST /admin/discounts/toggle/{id}` - активация/деактивация

### Пользователи
- `GET /admin/users` - список пользователей
- `POST /admin/users/create` - создание пользователя
- `POST /admin/users/delete/{id}` - удаление

## 🔗 Интеграция с основным приложением

Оба приложения могут использовать одну базу данных:

1. Настройте `DATABASE_URL` в `.env` обоих приложений на один файл
2. Основное приложение может читать номера из БД вместо `data/rooms.ts`
3. Админка становится единственным источником правды для контента

## 🐛 Решение проблем

### Ошибка при запуске
Убедитесь, что все зависимости установлены:
```bash
pip install -r requirements.txt
```

### Ошибка базы данных
Удалите файл `data/hotel.db` и запустите инициализацию заново:
```bash
python scripts/init_db.py
```

### Не работает аутентификация
Проверьте `.env` файл и убедитесь, что `SECRET_KEY` установлен.

## 🚀 Деплой

### Production запуск

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
```

### С Gunicorn

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

### Docker (опционально)

Создайте `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

## 📝 Дальнейшие улучшения

- [ ] Экспорт данных в CSV/Excel
- [ ] Email уведомления о новых бронях
- [ ] Загрузка изображений с drag-and-drop
- [ ] Rich text editor для описаний
- [ ] Календарь доступности номеров
- [ ] Графики аналитики (Chart.js)
- [ ] Многоязычность (i18n)
- [ ] Резервное копирование БД
- [ ] Логирование действий админов

## 📄 Лицензия

MIT

## 👤 Автор

Создано для Hotel California

---

**Версия**: 1.0.0  
**Дата**: Апрель 2026
