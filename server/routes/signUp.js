import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /signUp
 * Реєстрація нового користувача
 *
 * Очікувані дані в body:
 * - email: string (має бути унікальним)
 * - password: string
 */
router.post("/signUp", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Перевіряємо, чи вже існує користувач з таким email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Користувач з таким email вже існує",
            });
        }

        // Хешуємо пароль перед збереженням (10 раундів — стандартний рівень безпеки)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Створюємо нового користувача
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Зберігаємо користувача в базу даних
        await newUser.save();

        // Успішна реєстрація
        res.status(201).json({
            message: "Користувача успішно зареєстровано",
        });
    } catch (error) {
        // Логуємо помилку для дебагу
        console.error("Помилка реєстрації:", error);

        // Клієнту повертаємо загальну помилку сервера
        res.status(500).json({
            message: "Внутрішня помилка сервера",
        });
    }
});

export default router;
