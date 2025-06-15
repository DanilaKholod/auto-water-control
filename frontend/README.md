# Auto Water Control

Система автоматизации химического контроля для мониторинга параметров воды с помощью датчиков, хранения данных и отображения их во фронтенде.

## Документация

- [КОНЦЕПЦИЯ_ПРОЕКТА.md](../docs/КОНЦЕПЦИЯ_ПРОЕКТА.md) — Концепция проекта.
- [КАЛЕНДАРНЫЙ_ПЛАН.md](../docs/КАЛЕНДАРНЫЙ_ПЛАН.md) — Календарный план проекта.
- [ПОЛЬЗОВАТЕЛЬСКАЯ_ПРОБЛЕМА.md](../docs/ПОЛЬЗОВАТЕЛЬСКАЯ_ПРОБЛЕМА.md) — Пользовательская проблема и требования.
- [API.md](./docs/API.md) — Описание REST API, примеры запросов и ответов.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Архитектура проекта, описание компонентов и их взаимодействия.
- [DEPLOY.md](./docs/DEPLOY.md) — Инструкция по развертыванию и запуску проекта.
- [FRONTEND.md](./docs/FRONTEND.md) — Описание структуры и особенностей фронтенда.
- [BACKEND.md](./docs/BACKEND.md) — Описание backend-части, моделей и бизнес-логики.

## Возможности

- Приём и хранение данных с датчиков (температура, pH, нитриты, нитраты, кислород, мутность и др.)
- Экспорт данных в CSV/Excel
- Уведомления об отклонениях от нормы (warning/critical)
- API для интеграции и фронтенда

## Стек

- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Frontend:** Next.js (TypeScript, React)
- **Docker** и **docker-compose** для контейнеризации

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/auto-water-control.git
cd auto-water-control
```

### 2. Настройка переменных окружения

Создайте файл `.env` (пример уже есть):

```
MONGO_URI=mongodb://mongo:27017/
MONGO_DB=sensors_db
```

### 3. Запуск через Docker Compose

```bash
docker-compose up --build
```

- Backend будет доступен на `http://localhost:8000`
- MongoDB — на `localhost:27017`

### 4. Локальный запуск backend (без Docker)

```bash
pip install -r requirements.txt
uvicorn API:app --reload
```

## Структура проекта

```
.
├── API.py                 
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env
├── src/                   
├── ...
```

## Переменные окружения

- `MONGO_URI` — строка подключения к MongoDB
- `MONGO_DB` — имя базы данных

## API

### POST `/api/data`

Приём данных с датчиков.

**Пример запроса:**
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

### GET `/api/data`

Получение данных (фильтры: name_of_sensor, start_date, end_date, limit).

### POST `/api/export`

Экспорт данных в CSV/Excel.

**Пример запроса:**
```json
{
  "start_date": "2024-06-01T00:00:00",
  "end_date": "2024-06-02T00:00:00",
  "parameters": ["ph", "temperature"],
  "format": "csv"
}
```

### GET `/api/notifications`

Получение уведомлений (фильтр: resolved).

### POST `/api/notifications/{notification_id}/resolve`

Пометить уведомление как решённое.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
