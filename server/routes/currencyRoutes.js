import { Router } from "express";
import Freecurrencyapi from "../services/freecurrencyapi.js";
import dotenv from "dotenv";

// Завантажуємо змінні середовища з файлу .env, що знаходиться в директорії server/
dotenv.config({ path: "./server/.env" });

const router = Router();

// Отримуємо API-ключ для сервісу freecurrencyapi з змінних середовища
const key = process.env.CURRENCY_API_KEY;

// Створюємо екземпляр сервісу для роботи з API курсів валют
const currencyApi = new Freecurrencyapi(key);

/**
 * GET /status
 * Перевірка статусу API-ключа та доступних лімітів
 */
router.get("/status", async (req, res) => {
    try {
        const data = await currencyApi.status();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /currencies
 * Отримання списку всіх доступних валют та їх метаданих
 * Підтримує query-параметри (наприклад: ?currencies=USD,EUR)
 */
router.get("/currencies", async (req, res) => {
    try {
        const data = await currencyApi.currencies(req.query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /latest
 * Отримання найсвіжіших курсів валют
 * Підтримує параметри:
 * - base_currency (валюта бази)
 * - currencies (список потрібних валют)
 */
router.get("/latest", async (req, res) => {
    try {
        const data = await currencyApi.latest(req.query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /historical
 * Отримання історичних курсів валют на конкретну дату
 * Обов'язковий параметр: date=YYYY-MM-DD
 * Додаткові: base_currency, currencies
 */
router.get("/historical", async (req, res) => {
    try {
        const data = await currencyApi.historical(req.query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
