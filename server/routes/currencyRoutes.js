import { Router } from "express";
import Freecurrencyapi from "../services/freecurrencyapi.js";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

const router = Router();
const key = process.env.CURRENCY_API_KEY;

const currencyApi = new Freecurrencyapi(key);

router.get("/status", async (req, res) => {
    try {
        const data = await currencyApi.status();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/currencies", async (req, res) => {
    try {
        const data = await currencyApi.currencies(req.query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/latest", async (req, res) => {
    try {
        const data = await currencyApi.latest(req.query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/historical", async (req, res) => {
    try {
        const data = await currencyApi.historical(req.query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
