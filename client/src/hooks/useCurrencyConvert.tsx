import { useState, useEffect } from "react";
import { useCurrencyData } from "./useCurrencyData";

const CONVERSION_RATES_CACHE_KEY = "conversion_rates_cache";
const CONVERSION_CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour

export const useCurrencyConvert = (
    initialFromCurrency = "USD",
    initialToCurrency = "EUR"
) => {
    const [inputValue, setInputValue] = useState<number>(0);
    const [fromCurrency, setFromCurrency] =
        useState<string>(initialFromCurrency);
    const [toCurrency, setToCurrency] = useState<string>(initialToCurrency);
    const [conversionRate, setConversionRate] = useState<number>(1);

    const {
        currencies,
        isLoading: isLoadingCurrencies,
        refreshData,
    } = useCurrencyData();

    const getCacheKey = (from: string, to: string) =>
        `${CONVERSION_RATES_CACHE_KEY}_${from}_${to}`;

    useEffect(() => {
        const fetchConversionRate = async () => {
            if (!fromCurrency || !toCurrency) return;

            const cacheKey = getCacheKey(fromCurrency, toCurrency);
            const cachedRate = localStorage.getItem(cacheKey);
            const cachedTimestamp = localStorage.getItem(
                `${cacheKey}_timestamp`
            );

            const now = new Date().getTime();
            const isExpired =
                !cachedTimestamp ||
                parseInt(cachedTimestamp) < now - CONVERSION_CACHE_TTL;

            if (cachedRate && !isExpired) {
                setConversionRate(parseFloat(cachedRate));
                return;
            }

            try {
                const response = await fetch(
                    `/api/currency/latest?base_currency=${fromCurrency}&currencies=${toCurrency}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Error when requesting to the server"
                    );
                }

                const rate = data.data[toCurrency];

                localStorage.setItem(cacheKey, rate.toString());
                localStorage.setItem(`${cacheKey}_timestamp`, now.toString());

                setConversionRate(rate);
            } catch (error) {
                console.error("Error when receiving the exchange rate:", error);
                if (cachedRate) {
                    setConversionRate(parseFloat(cachedRate));
                }
            }
        };

        fetchConversionRate();
    }, [fromCurrency, toCurrency]);

    const convertedValue = inputValue * conversionRate;

    const clearConversionRatesCache = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CONVERSION_RATES_CACHE_KEY)) {
                localStorage.removeItem(key);
            }
        }
    };

    const refreshAllData = () => {
        clearConversionRatesCache();
        refreshData();
    };

    return {
        inputValue,
        setInputValue,
        fromCurrency,
        setFromCurrency,
        toCurrency,
        setToCurrency,
        convertedValue,
        currencies,
        isLoadingCurrencies,
        refreshAllData,
    };
};
