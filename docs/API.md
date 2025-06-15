# API документация — Auto Water Control

## Общая информация

REST API для системы автоматизации химического контроля. Позволяет принимать, хранить, экспортировать и получать данные с датчиков, а также управлять уведомлениями.

---

## Эндпоинты

### POST `/api/data`

**Описание:** Приём данных с датчиков.

**Тело запроса:**
```json
{
  "measurements": [
    {
      "sensor_id": "sensor-1",
      "parameter": "ph",
      "value": 7.2,
      "timestamp": "2024-06-01T12:00:00",
      "unit": "pH"
    }
  ]
}
```

**Ответ:**
```json
{
  "status": "success",
  "inserted_ids": ["665f2c1e5e7b4e2b8c8e4b1a"]
}
```

---

### GET `/api/data`

**Описание:** Получение данных с возможностью фильтрации.

**Параметры запроса:**
- `name_of_sensor` (string, optional)
- `start_date` (ISO datetime, optional)
- `end_date` (ISO datetime, optional)
- `limit` (int, default 100, max 1000)

**Пример запроса:**
```
/api/data?name_of_sensor=ph&start_date=2024-06-01T00:00:00&end_date=2024-06-02T00:00:00&limit=10
```

**Ответ:**
```json
[
  {
    "_id": "665f2c1e5e7b4e2b8c8e4b1a",
    "date": "2024-06-01T12:00:00",
    "name_of_sensor": "ph",
    "value": 7.2,
    "sensor_id": "sensor-1",
    "unit": "pH"
  }
]
```

---

### POST `/api/export`

**Описание:** Экспорт данных в CSV или Excel.

**Тело запроса:**
```json
{
  "start_date": "2024-06-01T00:00:00",
  "end_date": "2024-06-02T00:00:00",
  "parameters": ["ph", "temperature"],
  "format": "csv"
}
```

**Ответ:**
```json
{
  "content": "date,name_of_sensor,value,sensor_id,unit\n2024-06-01T12:00:00,ph,7.2,sensor-1,pH\n...",
  "format": "text/csv"
}
```
или для Excel:
```json
{
  "content": "<base64 или строка excel-файла>",
  "format": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
```

---

### GET `/api/notifications`

**Описание:** Получение уведомлений об отклонениях.

**Параметры запроса:**
- `resolved` (bool, optional)

**Ответ:**
```json
[
  {
    "id": "665f2c1e5e7b4e2b8c8e4b1b",
    "message": "ph выше допустимого уровня: 9.1 pH",
    "severity": "critical",
    "timestamp": "2024-06-01T12:01:00",
    "resolved": false
  }
]
```

---

### POST `/api/notifications/{notification_id}/resolve`

**Описание:** Пометить уведомление как решённое.

**Ответ:**
```json
{
  "id": "665f2c1e5e7b4e2b8c8e4b1b",
  "message": "ph выше допустимого уровня: 9.1 pH",
  "severity": "critical",
  "timestamp": "2024-06-01T12:01:00",
  "resolved": true
}
```

---

## Пример успешного ответа API

```json
{
  "message": "Auto Water Control API is running."
}
```

---

## Ошибки

- 400 — Некорректный формат запроса или параметров
- 404 — Данные не найдены
- 500 — Внутренняя ошибка сервера или БД

---

## Контакты

Вопросы по API: [maintainer@email.com](mailto:maintainer@email.com)
