import { FC } from "react";
import styles from "./HistoricalExchangeRates.module.scss";
import arrows from "../../assets/img/2arrows.png";
import MiniConvertTab from "../../components/MiniConvertTab/MiniConvertTab";
import Chart from "../../components/Chart/Chart";
import { useCurrencyConvert } from "../../hooks/useCurrencyConvert";

/**
 * Компонент історичних курсів валют
 * Показує два поля для вибору валют та суми + графік історичної динаміки курсу
 */
const HistoricalExchangeRates: FC = () => {
    // Отримуємо стан та методи управління конвертацією з основного хука
    const {
        inputValue, // сума введена користувачем
        setInputValue, // зміна введеної суми
        fromCurrency, // валюта "з якої" дивимось історію
        setFromCurrency, // зміна базової валюти
        toCurrency, // валюта "в яку" дивимось історію
        setToCurrency, // зміна цільової валюти
        convertedValue, // поточне сконвертоване значення
        currencies, // список всіх доступних валют
    } = useCurrencyConvert();

    /**
     * Міняє місцями базову та цільову валюту
     * Впливає як на поля конвертації, так і на графік історичних курсів
     */
    const swapCurrencies = () => {
        const tempCurrency = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(tempCurrency);
        // Примітка: введена сума залишається без змін
        // після свапу буде показана нова конвертація в зворотному напрямку
    };

    return (
        <div className={styles.wrapper}>
            {/* Блок з міні-конвертером (аналогічний Converting, але компактніший) */}
            <div className={styles.wrap}>
                {/* Перше поле — введення суми та вибір вихідної валюти */}
                <MiniConvertTab
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    dropdownValue={fromCurrency}
                    onDropdownChange={setFromCurrency}
                    currencies={currencies}
                    isReadOnly={false}
                />

                {/* Кнопка обміну напрямку валют */}
                <button
                    className={styles.btn}
                    onClick={swapCurrencies}
                    type="button"
                    aria-label="Обміняти валюти місцями"
                >
                    <img
                        src={arrows}
                        className={styles.img}
                        alt="Обміняти напрямок"
                    />
                </button>

                {/* Друге поле — результат конвертації (тільки для перегляду) */}
                <MiniConvertTab
                    inputValue={convertedValue}
                    dropdownValue={toCurrency}
                    onDropdownChange={setToCurrency}
                    currencies={currencies}
                    isReadOnly={true}
                    // Порожній обробник для відповідності інтерфейсу компонента
                    onInputChange={() => {}}
                />
            </div>

            {/* Графік історичних курсів обраної валютної пари */}
            <Chart
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                // Примітка: компонент Chart сам відповідає за
                // завантаження історичних даних та їх відображення
            />
        </div>
    );
};

export default HistoricalExchangeRates;
