import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Імпорт роутерів (ендпоінтів) додатка
import loginRoutes from "./routes/login.js"; // Роут для авторизації (/login)
import signUpRoutes from "./routes/signUp.js"; // Роут для реєстрації (/signUp)
import currencyRoutes from "./routes/currencyRoutes.js"; // Роут для роботи з курсами валют (/api/currency/*)

// Завантаження змінних середовища з файлу .env
dotenv.config({ path: "./server/.env" });

// Створення основного екземпляра Express-додатка
const app = express();

// Middleware ==============================================

// Дозволяємо крос-доменні запити (CORS) з фронтенду
app.use(cors());

// Парсинг JSON-тіла в запитах
app.use(express.json());

// Підключення до MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB успішно підключено"))
    .catch((err) => console.error("Помилка підключення до MongoDB:", err));

// Базовий маршрут для перевірки працездатності сервера
app.get("/", (req, res) => {
    res.send("Сервер працює");
});

// Підключення роутерів =====================================

// Публічні маршрути авторизації
app.use(loginRoutes); // POST /login
app.use(signUpRoutes); // POST /signUp

// Захищені та публічні маршрути для роботи з валютами
app.use("/api/currency", currencyRoutes); // /api/currency/status, /latest, /historical тощо

// Запуск сервера ===========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});
