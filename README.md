# Auto Water Control

Система автоматизации химического контроля для мониторинга параметров воды с помощью датчиков, хранения данных и отображения их во фронтенде.

## Документация

- [Концепция проекта](./docs/КОНЦЕПЦИЯ_ПРОЕКТА.md)
- [Техническое задание](./docs/ТЕХНИЧЕСКОЕ_ЗАДАНИЕ.md)
- [Пользовательская проблема](./docs/ПОЛЬЗОВАТЕЛЬСКАЯ_ПРОБЛЕМА.md)
- [Функциональные и нефункциональные требования](./docs/ТРЕБОВАНИЯ.md)
- [Календарный план проекта](./docs/КАЛЕНДАРНЫЙ_ПЛАН.md)
- [Описание REST API, примеры запросов и ответов](./docs/API.md)

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
