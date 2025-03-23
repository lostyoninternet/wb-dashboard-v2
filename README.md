# Wildberries Dashboard v2

Обновленная версия панели управления для работы с API Wildberries.

## Особенности

- Хранение данных в SQLite для упрощения локальной разработки
- Визуализация статистики продаж с помощью Recharts
- Обработка ошибок и мониторинг
- Простая настройка и запуск

## Требования

- Node.js 18+
- NPM или Yarn

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/wb-dashboard-v2.git
cd wb-dashboard-v2
```

2. Установите зависимости для бэкенда и фронтенда:
```bash
# Установка зависимостей бэкенда
cd backend
npm install

# Установка зависимостей фронтенда
cd ../frontend
npm install
```

3. Создайте файл .env в директории backend (или используйте существующий):
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Wildberries API Configuration
WB_API_BASE_URL=https://suppliers-api.wb.ru
WB_STATISTICS_API_URL=https://statistics-api.wb.ru

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Запустите приложение:
```bash
# Запуск бэкенда
cd backend
npm run dev

# Запуск фронтенда (в отдельном терминале)
cd frontend
npm start
```

## Использование

1. Откройте приложение в браузере: http://localhost:3000
2. Введите API ключ Wildberries в верхней панели
3. Введите артикул товара для получения информации и статистики

## API Endpoints

### Продукты

- `GET /api/products/:articleNumber` - Получение информации о товаре
  - Требует заголовок `x-api-key`
  - Возвращает основную информацию о товаре

### Статистика

- `GET /api/statistics/:articleNumber` - Получение статистики по товару
  - Требует заголовок `x-api-key`
  - Параметры запроса:
    - `dateFrom` - Начальная дата (YYYY-MM-DD)
    - `dateTo` - Конечная дата (YYYY-MM-DD)

## Структура проекта

### Бэкенд

- `/src/config` - Конфигурация приложения
- `/src/database` - Настройка SQLite и миграции
- `/src/models` - Модели данных
- `/src/routes` - API маршруты
- `/src/services` - Бизнес-логика и взаимодействие с API Wildberries

### Фронтенд

- `/src/components` - React компоненты
- `/src/services` - Сервисы для работы с API
- `/src/types` - TypeScript типы
- `/src/utils` - Вспомогательные функции

## Решение проблем

### Ошибка 401 Unauthorized

Если вы получаете ошибку 401, проверьте:
1. Правильно ли введен API ключ
2. Срок действия API ключа не истек
3. У API ключа есть необходимые права доступа

### Ошибка 500 Internal Server Error

Если вы получаете ошибку 500:
1. Проверьте логи сервера для получения подробной информации
2. Убедитесь, что API Wildberries доступно
3. Проверьте правильность URL API в файле .env

## Лицензия

MIT
