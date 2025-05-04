import { useState, useEffect } from "react";

const CURRENCIES_DATA_KEY = "currenciesData";
const EXCHANGE_RATES_KEY = "exchangeRatesData";
const TIMESTAMP_KEY = "currenciesTimestamp";
const CACHE_TTL = 3600000; // 1 hour

export interface Currency {
    symbol: string;
    name: string;
    exchangeRate?: number;
}

export interface CurrencyResponse {
    [key: string]: Currency;
}

export const useCurrencyData = () => {
    const [currencies, setCurrencies] = useState<CurrencyResponse>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const addExchangeRate = (exchangeRates: Record<string, number>) => {
        setCurrencies((prevCurrencies) => {
            const updatedCurrencies = { ...prevCurrencies };

            Object.keys(exchangeRates).forEach((key) => {
                if (updatedCurrencies[key]) {
                    updatedCurrencies[key].exchangeRate = exchangeRates[key];
                }
            });

            return updatedCurrencies;
        });
    };

    const fetchData = async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);

        try {
            const cachedCurrenciesData =
                localStorage.getItem(CURRENCIES_DATA_KEY);
            const cachedExchangeRatesData =
                localStorage.getItem(EXCHANGE_RATES_KEY);
            const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);

            const isDataFresh =
                cachedTimestamp &&
                Date.now() - parseInt(cachedTimestamp) < CACHE_TTL;

            if (
                cachedCurrenciesData &&
                cachedExchangeRatesData &&
                isDataFresh &&
                !forceRefresh
            ) {
                const parsedCurrencies = JSON.parse(cachedCurrenciesData);
                setCurrencies(parsedCurrencies);

                const parsedExchangeRates = JSON.parse(cachedExchangeRatesData);
                addExchangeRate(parsedExchangeRates);
            } else {
                const [currenciesRes, ratesRes] = await Promise.all([
                    fetch("/api/currency/currencies"),
                    fetch("/api/currency/latest"),
                ]);

                if (!currenciesRes.ok || !ratesRes.ok) {
                    throw new Error(
                        "Error when receiving data from the server"
                    );
                }

                const currenciesData = await currenciesRes.json();
                const ratesData = await ratesRes.json();

                setCurrencies(currenciesData.data);
                addExchangeRate(ratesData.data);

                localStorage.setItem(
                    CURRENCIES_DATA_KEY,
                    JSON.stringify(currenciesData.data)
                );
                localStorage.setItem(
                    EXCHANGE_RATES_KEY,
                    JSON.stringify(ratesData.data)
                );
                localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
            }
        } catch (err) {
            console.error("Error loading currency data:", err);
            setError(
                "Currency data could not be loaded. Please try again later."
            );

            const cachedCurrenciesData =
                localStorage.getItem(CURRENCIES_DATA_KEY);
            const cachedExchangeRatesData =
                localStorage.getItem(EXCHANGE_RATES_KEY);

            if (cachedCurrenciesData && cachedExchangeRatesData) {
                const parsedCurrencies = JSON.parse(cachedCurrenciesData);
                setCurrencies(parsedCurrencies);

                const parsedExchangeRates = JSON.parse(cachedExchangeRatesData);
                addExchangeRate(parsedExchangeRates);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = () => {
        localStorage.removeItem(CURRENCIES_DATA_KEY);
        localStorage.removeItem(EXCHANGE_RATES_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);
        fetchData(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        currencies,
        isLoading,
        error,
        refreshData,
    };
};
