import { useState, useEffect } from "react";

const CURRENCIES_DATA_KEY = "currenciesData";
const EXCHANGE_RATES_KEY = "exchangeRatesData";
const TIMESTAMP_KEY = "currenciesTimestamp";
const CACHE_TTL = 3600000; // 1 година в мілісекундах

export interface Currency {
    symbol: string;
    name: string;
    exchangeRate?: number; // курс відносно базової валюти (зазвичай USD)
}

export interface CurrencyResponse {
    [key: string]: Currency; // приклад: { "USD": { symbol: "USD", name: "US Dollar", exchangeRate: 1 } }
}

/**
 * Хук для отримання та управління списком валют та їх курсами
 * Використовує кешування в localStorage з TTL = 1 година
 */
export const useCurrencyData = () => {
    // Основний стан — словник усіх валют з їх метаданими та (опціонально) курсами
    const [currencies, setCurrencies] = useState<CurrencyResponse>({});

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Допоміжна функція: додає/оновлює поле exchangeRate для валют
     * в поточному стані currencies
     */
    const addExchangeRate = (exchangeRates: Record<string, number>) => {
        setCurrencies((prevCurrencies) => {
            const updated = { ...prevCurrencies };

            Object.entries(exchangeRates).forEach(([code, rate]) => {
                if (updated[code]) {
                    updated[code] = {
                        ...updated[code],
                        exchangeRate: rate,
                    };
                }
            });

            return updated;
        });
    };

    /**
     * Основна функція завантаження даних про валюти та курси
     * @param forceRefresh — примусово ігнорувати кеш і завантажувати з сервера
     */
    const fetchData = async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);

        try {
            // Перевірка кешу
            const cachedCurrencies = localStorage.getItem(CURRENCIES_DATA_KEY);
            const cachedRates = localStorage.getItem(EXCHANGE_RATES_KEY);
            const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);

            const now = Date.now();
            const isCacheFresh =
                cachedTimestamp && now - Number(cachedTimestamp) < CACHE_TTL;

            // Якщо є свіжий кеш і не потрібне примусове оновлення
            if (
                cachedCurrencies &&
                cachedRates &&
                isCacheFresh &&
                !forceRefresh
            ) {
                const parsedCurrencies = JSON.parse(cachedCurrencies);
                setCurrencies(parsedCurrencies);

                const parsedRates = JSON.parse(cachedRates);
                addExchangeRate(parsedRates);
            }
            // Інакше — повне завантаження з API
            else {
                const [currenciesResponse, ratesResponse] = await Promise.all([
                    fetch("/api/currency/currencies"),
                    fetch("/api/currency/latest"),
                ]);

                if (!currenciesResponse.ok || !ratesResponse.ok) {
                    throw new Error("Не вдалося отримати дані з сервера");
                }

                const currenciesData = await currenciesResponse.json();
                const ratesData = await ratesResponse.json();

                // Зберігаємо сирі дані
                setCurrencies(currenciesData.data);
                addExchangeRate(ratesData.data);

                // Кешування на 1 годину
                localStorage.setItem(
                    CURRENCIES_DATA_KEY,
                    JSON.stringify(currenciesData.data)
                );
                localStorage.setItem(
                    EXCHANGE_RATES_KEY,
                    JSON.stringify(ratesData.data)
                );
                localStorage.setItem(TIMESTAMP_KEY, now.toString());
            }
        } catch (err) {
            console.error("Помилка завантаження даних валют:", err);

            setError(
                "Не вдалося завантажити дані про валюти. Спробуйте пізніше."
            );

            // Fallback на кеш навіть при помилці (найкраще, що ми можемо зробити)
            const cachedCurrencies = localStorage.getItem(CURRENCIES_DATA_KEY);
            const cachedRates = localStorage.getItem(EXCHANGE_RATES_KEY);

            if (cachedCurrencies && cachedRates) {
                const parsedCurrencies = JSON.parse(cachedCurrencies);
                setCurrencies(parsedCurrencies);

                const parsedRates = JSON.parse(cachedRates);
                addExchangeRate(parsedRates);
            }
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Примусове оновлення даних:
     * - видаляє весь кеш
     * - виконує завантаження з сервера
     */
    const refreshData = () => {
        localStorage.removeItem(CURRENCIES_DATA_KEY);
        localStorage.removeItem(EXCHANGE_RATES_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);

        fetchData(true);
    };

    // Початкове завантаження даних при монтуванні компонента
    useEffect(() => {
        fetchData();
    }, []);

    return {
        currencies, // об'єкт усіх валют з метаданими та курсами
        isLoading, // чи йде завантаження в даний момент
        error, // текст помилки (якщо є)
        refreshData, // метод для ручного оновлення даних
    };
};
