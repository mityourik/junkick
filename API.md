# JSON Server API Documentation

## Базовая информация

JSON Server запущен на порту **3001**: http://localhost:3001

## Доступные эндпоинты

### 👥 Пользователи (`/users`)

- **GET** `/users` - получить всех пользователей
- **GET** `/users/:id` - получить пользователя по ID
- **POST** `/users` - создать нового пользователя
- **PATCH** `/users/:id` - обновить пользователя
- **DELETE** `/users/:id` - удалить пользователя

### 🚀 Проекты (`/projects`)

- **GET** `/projects` - получить все проекты
- **GET** `/projects/:id` - получить проект по ID
- **POST** `/projects` - создать новый проект
- **PATCH** `/projects/:id` - обновить проект
- **DELETE** `/projects/:id` - удалить проект

#### Фильтрация проектов:

- `/projects?category=E-commerce` - по категории
- `/projects?status=В разработке` - по статусу
- `/projects?q=React` - поиск по тексту

### 🎯 Роли (`/roles`)

- **GET** `/roles` - получить все роли
- **GET** `/roles/:id` - получить роль по ID

### 💻 Технологии (`/technologies`)

- **GET** `/technologies` - получить все технологии
- **GET** `/technologies?category=Frontend` - по категории

### 📂 Категории (`/categories`)

- **GET** `/categories` - получить все категории
- **GET** `/categories/:id` - получить категорию по ID

## Как запустить

### Только API:

```bash
npm run db
```

### API + Dev сервер одновременно:

```bash
npm run dev:all
```

## Примеры использования

### Получить все проекты:

```javascript
import { api } from './src/api';

// Все проекты
const projects = await api.projects.getAll();

// Проект по ID
const project = await api.projects.getById(1);

// Поиск проектов
const searchResults = await api.projects.search('React');
```

### Создать новый проект:

```javascript
const newProject = {
  name: 'Мой проект',
  description: 'Описание проекта',
  status: 'В разработке',
  // ... остальные поля
};

const created = await api.projects.create(newProject);
```

## Структура данных

В `db.json` содержатся:

- **3 пользователя** (разработчки, тимлид, заказчик)
- **3 проекта** (Bronfood, CRM, фитнес-приложение)
- **5 ролей** (джун, мидл, синьор, тимлид, заказчик)
- **6 технологий** (React, TypeScript, Node.js, etc.)
- **5 категорий** (E-commerce, Business, Mobile, etc.)

## Полезные ссылки

- Браузер API: http://localhost:3001
- Проекты: http://localhost:3001/projects
- Пользователи: http://localhost:3001/users
- Роли: http://localhost:3001/roles
