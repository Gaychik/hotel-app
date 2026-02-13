# Спецификация API для бекенд-разработчика приложения Hotel California

## 1. Введение

Данный документ описывает требования к API для веб-приложения Hotel California. Он определяет конечные точки, форматы запросов/ответов и структуры данных, необходимые для поддержки функциональности фронтенда.

## 2. Базовый URL
Все конечные точки API должны быть доступны по базовому пути `/api`.

## 3. Аутентификация
Большинство конечных точек требуют аутентификации с использованием JWT-токенов. Заголовок аутентификации должен быть отформатирован как:
`Authorization: Bearer {token}`

## 4. Обработка ошибок
Все конечные точки API должны возвращать согласованные ответы об ошибках:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object" (optional)
  }
}
```

## 5. Конечные точки

### 5.1 Управление номерами

#### 5.1.1 Получить все номера
- **Конечная точка:** `GET /api/rooms`
- **Описание:** Возвращает все доступные номера отеля
- **Аутентификация:** Не требуется
- **Ответ:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "images": ["string"],
      "amenities": ["string"],
      "price": "number",
      "policies": {
        "checkIn": "string",
        "checkOut": "string",
        "cancellation": "string",
        "pets": "string"
      },
      "availability": {
        "bookedDates": [
          {
            "start": "YYYY-MM-DD",
            "end": "YYYY-MM-DD"
          }
        ],
        "partialDates": [
          {
            "start": "YYYY-MM-DD",
            "end": "YYYY-MM-DD"
          }
        ]
      }
    }
  ]
}
```

#### 5.1.2 Получить номер по ID
- **Конечная точка:** `GET /api/rooms/{id}`
- **Описание:** Возвращает конкретный номер по его ID
- **Аутентификация:** Не требуется
- **Ответ:**
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "images": ["string"],
    "amenities": ["string"],
    "price": "number",
    "policies": {
      "checkIn": "string",
      "checkOut": "string",
      "cancellation": "string",
      "pets": "string"
    },
    "availability": {
      "bookedDates": [
        {
          "start": "YYYY-MM-DD",
          "end": "YYYY-MM-DD"
        }
      ],
      "partialDates": [
        {
          "start": "YYYY-MM-DD",
          "end": "YYYY-MM-DD"
        }
      ]
    }
  }
}
```

#### 5.1.3 Получить доступные номера по датам
- **Конечная точка:** `GET /api/rooms/available`
- **Описание:** Возвращает номера, доступные для указанных дат заезда/выезда
- **Аутентификация:** Не требуется
- **Параметры запроса:**
  - `checkIn` (обязательно): Дата заезда в формате YYYY-MM-DD
  - `checkOut` (обязательно): Дата выезда в формате YYYY-MM-DD
- **Ответ:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "images": ["string"],
      "amenities": ["string"],
      "price": "number",
      "policies": {
        "checkIn": "string",
        "checkOut": "string",
        "cancellation": "string",
        "pets": "string"
      },
      "availability": {
        "bookedDates": [
          {
            "start": "YYYY-MM-DD",
            "end": "YYYY-MM-DD"
          }
        ],
        "partialDates": [
          {
            "start": "YYYY-MM-DD",
            "end": "YYYY-MM-DD"
          }
        ]
      }
    }
  ]
}
```

### 5.2 Управление бронированиями

#### 5.2.1 Создать бронирование
- **Конечная точка:** `POST /api/bookings`
- **Описание:** Создает новое бронирование
- **Аутентификация:** Требуется
- **Тело запроса:**
```json
{
  "roomId": "string",
  "checkIn": "string",
  "checkOut": "string",
  "guestName": "string",
  "totalPrice": "number"
}
```
- **Ответ:**
```json
{
  "data": {
    "id": "string",
    "room": {
      // Объект номера как определено выше
    },
    "checkIn": "string",
    "checkOut": "string",
    "guestName": "string",
    "totalPrice": "number",
    "status": "active"
  }
}
```

#### 5.2.2 Получить бронирование по ID
- **Конечная точка:** `GET /api/bookings/{bookingId}`
- **Описание:** Возвращает детали бронирования по ID
- **Аутентификация:** Требуется (пользователь должен владеть бронированием)
- **Ответ:**
```json
{
  "data": {
    "id": "string",
    "room": {
      // Объект номера как определено выше
    },
    "checkIn": "string",
    "checkOut": "string",
    "guestName": "string",
    "totalPrice": "number",
    "status": "string"
  }
}
```

#### 5.2.3 Получить текущие бронирования
- **Конечная точка:** `GET /api/bookings/current`
- **Описание:** Возвращает текущие бронирования для аутентифицированного пользователя
- **Аутентификация:** Требуется
- **Ответ:**
```json
{
  "data": [
    {
      "id": "string",
      "room": {
        // Объект номера как определено выше
      },
      "checkIn": "string",
      "checkOut": "string",
      "status": "active"
    }
  ]
}
```

#### 5.2.4 Получить историю бронирований
- **Конечная точка:** `GET /api/bookings/history`
- **Описание:** Возвращает историю бронирований для аутентифицированного пользователя
- **Аутентификация:** Требуется
- **Ответ:**
```json
{
  "data": [
    {
      "id": "string",
      "room": {
        // Объект номера как определено выше
      },
      "checkIn": "string",
      "checkOut": "string",
      "status": "completed"
    }
  ]
}
```

### 5.3 Профиль пользователя

#### 5.3.1 Получить профиль пользователя
- **Конечная точка:** `GET /api/profile`
- **Описание:** Возвращает данные профиля для аутентифицированного пользователя
- **Аутентификация:** Требуется
- **Ответ:**
```json
{
  "data": {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

#### 5.3.2 Обновить профиль пользователя
- **Конечная точка:** `PUT /api/profile`
- **Описание:** Обновляет данные профиля для аутентифицированного пользователя
- **Аутентификация:** Требуется
- **Тело запроса:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```
- **Ответ:**
```json
{
  "data": {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### 5.4 Данные календаря

#### 5.4.1 Получить данные календаря за месяц
- **Конечная точка:** `GET /api/calendar-data`
- **Описание:** Возвращает данные календаря за конкретный месяц
- **Аутентификация:** Не требуется
- **Параметры запроса:**
  - `month` (необязательно): Месяц в формате YYYY-MM (по умолчанию текущий месяц)
- **Ответ:**
```json
{
  "data": [
    {
      "date": "YYYY-MM-DD",
      "price": "number",
      "availability": "free | partial | busy",
      "discount": "number",
      "event": "string"
    }
  ]
}
```

### 5.5 Аутентификация

#### 5.5.1 Запросить SMS-код
- **Конечная точка:** `POST /api/auth/sms-request`
- **Описание:** Запрашивает отправку SMS-кода подтверждения на указанный номер телефона
- **Аутентификация:** Не требуется
- **Тело запроса:**
```json
{
  "phone": "string"
}
```
- **Ответ:**
```json
{
  "success": "boolean"
}
```

#### 5.5.2 Проверить SMS-код
- **Конечная точка:** `POST /api/auth/sms-verify`
- **Описание:** Проверяет SMS-код и аутентифицирует пользователя
- **Аутентификация:** Не требуется
- **Тело запроса:**
```json
{
  "phone": "string",
  "code": "string"
}
```
- **Ответ:**
```json
{
  "success": "boolean",
  "token": "string"
}
```

## 6. Модели данных

### 6.1 Модель номера
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "images": ["string"],
  "amenities": ["string"],
  "price": "number",
  "policies": {
    "checkIn": "string",
    "checkOut": "string",
    "cancellation": "string",
    "pets": "string"
  },
  "availability": {
    "bookedDates": [
      {
        "start": "YYYY-MM-DD",
        "end": "YYYY-MM-DD"
      }
    ],
    "partialDates": [
      {
        "start": "YYYY-MM-DD",
        "end": "YYYY-MM-DD"
      }
    ]
  }
}
```

### 6.2 Модель бронирования
```json
{
  "id": "string",
  "room": {
    // Объект номера как определено выше
  },
  "checkIn": "string",
  "checkOut": "string",
  "guestName": "string",
  "totalPrice": "number",
  "status": "active | completed | cancelled"
}
```

### 6.3 Модель профиля
```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```

### 6.4 Модель данных дня
```json
{
  "date": "YYYY-MM-DD",
  "price": "number",
  "availability": "free | partial | busy",
  "discount": "number",
  "event": "string"
}
```

## 7. Примечания по реализации

1. Все поля дат должны храниться в формате UTC и преобразовываться в местное время пользователя при отображении
2. Значения цен должны храниться в наименьших единицах валюты (копейки для рублей)
3. Проверка доступности должна учитывать пересекающиеся диапазоны дат
4. Должна быть реализована надлежащая проверка всех входных полей
5. Ограничение по скорости должно применяться к конечным точкам аутентификации
6. Все конфиденциальные данные должны быть зашифрованы при хранении
7. Ответы API должны включать соответствующие коды состояния HTTP
8. Должна быть реализована постраничная навигация для конечных точек, возвращающих списки элементов