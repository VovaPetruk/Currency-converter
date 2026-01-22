# Currency Converter & Exchange Rates App

> Веб-додаток для перегляду актуальних та історичних курсів валют, конвертації та управління власним профілем.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

![Демонстрація додатка](demo.gif)  
_(або скріншот головної сторінки / gif з конвертацією)_

## Опис проєкту

Повностековий додаток, який дозволяє:

- Переглядати список валют та їх метаданих
- Отримувати актуальні курси валют
- Конвертувати суми між валютами
- Переглядати історичні курси за датою
- Реєструватися / авторизуватися
- Захищати приватні сторінки через JWT

Використовується безкоштовний API: https://freecurrencyapi.com

## Технологічний стек

**Frontend:**

- React 18 + React Router v6
- Context API
- SCSS modules

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT авторизація
- bcrypt для хешування паролів

**Інше:**

- freecurrencyapi.js (власний клієнт до зовнішнього API)
- dotenv для змінних середовища
- CORS

## Вимоги для запуску

- Node.js ≥ 18
- MongoDB (локальний або Atlas)
- API ключ від https://freecurrencyapi.com

Структура проєкту

project-root/
├── client/ # React-додаток (frontend)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── App.js
│ └── package.json
│
├── server/ # Node.js + Express (backend)
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── middleware/
│ └── index.js / server.js
│
├── .gitignore
└── README.md
