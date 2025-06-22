# Разработка интерфейса для Сервиса межгалактической аналитики

## Инструкция по запуску

1. Запустить бэкенд https://github.com/etozhenerk/shri2025-back
2. Клонировать репозиторий, установить зависимости и запустить фронтенд:

```bash
git clone git@github.com:vovavish/shri-react.git
cd ./shri-react
npm i
npm run dev
```

3. Открыть http://localhost:5173/

## Описание архитектуры

1. UI:
   - 1.1. `components/ui` - переиспользуемые ui компоненты
   - 1.2. `components` - компоненты, собранные из `components/ui`
   - 1.3. `pages` - страницы, собранные из components
3. Бизнес-логика - `services/ReportService`, методы для работы с отчетами
4. Данные - store. Содержит 1 slice для работы с отчетами
5. Работа с бэкендом:
   - 5.1. `api/ReportAPI`, содержит api контроллер бэкенда
   - 5.2. `api/ReportStorageAPI`, содержит api для истории загрузок
6. Типы - `types`, типы для работы с отчетами
