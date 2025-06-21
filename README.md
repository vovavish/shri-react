# Разработка интерфейса для Сервиса межгалактической аналитики

## Инструкция по запуску

1. Запустить бэкенд https://github.com/etozhenerk/shri2025-back
2. git clone git@github.com:vovavish/shri-react.git
3. cd ./shri-react
4. npm i
5. npm run dev

## Описание архитектуры

1. UI - components и pages.
2. Бизнес-логика - services/ReportService, методы для работы с отчетами
3. Данные - store. Содержит 1 slice для работы с отчетами
4. Работа с бэкендом - api/ReportAPI, содержит api контроллер бэкенда 
