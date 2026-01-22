import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * POST /login
 * Обробка запиту на авторизацію користувача
 *
 * Очікувані дані в body:
 * - email: string
 * - password: string
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Шукаємо користувача за email (поле email унікальне в моделі)
        const user = await User.findOne({ email });

        // Якщо користувача не знайдено — повертаємо помилку (умисно однакове повідомлення для безпеки)
        if (!user) {
            return res.status(400).json({
                message: "Неправильний email або пароль",
            });
        }

        // Перевіряємо відповідність введеного пароля захешованому в базі
        const isMatch = await bcrypt.compare(password, user.password);

        // Якщо пароль не співпадає — та сама помилка
        if (!isMatch) {
            return res.status(400).json({
                message: "Неправильний email або пароль",
            });
        }

        // Генеруємо JWT-токен, що містить ID користувача
        // Термін дії токена — 1 година
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Успішна авторизація
        res.status(200).json({
            message: "Успішний вхід",
            token,
        });
    } catch (error) {
        // Логуємо помилку для дебагу на сервері
        console.error("Помилка авторизації:", error);

        // Клієнту повертаємо загальну помилку сервера
        res.status(500).json({
            message: "Внутрішня помилка сервера",
        });
    }
});

export default router;
