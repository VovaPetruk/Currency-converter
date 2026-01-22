import { useState, useEffect } from "react";
import { useCurrencyData } from "./useCurrencyData";

const CONVERSION_RATES_CACHE_KEY = "conversion_rates_cache";
const CONVERSION_CACHE_TTL = 60 * 60 * 1000; // 1 година в мілісекундах

/**
 * Хук для повноцінного управління конвертацією валют
 *
 * Основні задачі:
 * - управління введеною сумою та вибраними валютами
 * - отримання та кешування актуальних курсів
 * - автоматичне оновлення при зміні валют
 * - надання методів для примусового оновлення даних
 */
export const useCurrencyConvert = (
    initialFromCurrency = "USD",
    initialToCurrency = "EUR"
) => {
    // Стан введеної суми користувачем (в базовій валюті)
    const [inputValue, setInputValue] = useState<number>(0);

    // Валюта "з якої" конвертуємо
    const [fromCurrency, setFromCurrency] =
        useState<string>(initialFromCurrency);

    // Валюта "в яку" конвертуємо
    const [toCurrency, setToCurrency] = useState<string>(initialToCurrency);

    // Поточний курс обміну (скільки одиниць toCurrency за 1 одиницю fromCurrency)
    const [conversionRate, setConversionRate] = useState<number>(1);

    // Дані про всі доступні валюти та їх стан завантаження
    const {
        currencies, // масив/об'єкт доступних валют
        isLoading: isLoadingCurrencies,
        refreshData, // метод для примусового оновлення списку валют
    } = useCurrencyData();

    /**
     * Генерує унікальний ключ для збереження курсу конкретної валютної пари
     */
    const getCacheKey = (from: string, to: string): string =>
        `${CONVERSION_RATES_CACHE_KEY}_${from}_${to}`;

    // Автоматичне завантаження курсу при зміні будь-якої з валют
    useEffect(() => {
        const fetchConversionRate = async () => {
            // захист від невалідного стану
            if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
                setConversionRate(1);
                return;
            }

            const cacheKey = getCacheKey(fromCurrency, toCurrency);
            const cachedRate = localStorage.getItem(cacheKey);
            const cachedTimestampStr = localStorage.getItem(
                `${cacheKey}_timestamp`
            );

            const now = Date.now();
            const cachedTimestamp = cachedTimestampStr
                ? Number(cachedTimestampStr)
                : 0;
            const isCacheValid =
                cachedRate !== null &&
                now - cachedTimestamp <= CONVERSION_CACHE_TTL;

            // Спочатку намагаємось використати кеш
            if (isCacheValid) {
                setConversionRate(Number(cachedRate));
                return;
            }

            try {
                const response = await fetch(
                    `/api/currency/latest?base_currency=${fromCurrency}&currencies=${toCurrency}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (!data?.data?.[toCurrency]) {
                    throw new Error("Відсутні дані курсу в відповіді API");
                }

                const rate = Number(data.data[toCurrency]);

                // Зберігаємо в localStorage з міткою часу
                localStorage.setItem(cacheKey, rate.toString());
                localStorage.setItem(`${cacheKey}_timestamp`, now.toString());

                setConversionRate(rate);
            } catch (error) {
                console.error("Не вдалося отримати свіжий курс:", error);

                // Fallback на кеш, навіть якщо він трохи прострочений
                if (cachedRate !== null) {
                    setConversionRate(Number(cachedRate));
                }
                // TODO: можна додати повідомлення користувачу про використання кешу
            }
        };

        fetchConversionRate();
    }, [fromCurrency, toCurrency]);

    // Розраховане значення після конвертації
    const convertedValue = inputValue * conversionRate;

    /**
     * Повністю очищає весь кеш курсів валют з localStorage
     */
    const clearConversionRatesCache = () => {
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(CONVERSION_RATES_CACHE_KEY)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach((key) => localStorage.removeItem(key));
    };

    /**
     * Примусово оновлює всі дані:
     * - очищає кеш курсів
     * - оновлює список доступних валют
     * (новий курс завантажиться автоматично через useEffect)
     */
    const refreshAllData = () => {
        clearConversionRatesCache();
        refreshData();
    };

    return {
        // Введена сума та її контроль
        inputValue,
        setInputValue,

        // Валюти та їх зміна
        fromCurrency,
        setFromCurrency,
        toCurrency,
        setToCurrency,

        // Результати
        convertedValue,
        conversionRate, // додано для зручності (наприклад, показати "1 USD = X EUR")

        // Допоміжні дані
        currencies,
        isLoadingCurrencies,

        // Управління оновленням
        refreshAllData,
    };
};
