import { FC } from "react";
import styles from "./Converting.module.scss";
import arrows from "../../assets/img/2arrows.png";
import ConvertTab from "../../components/ConvertTab/ConvertTab";
import { useCurrencyConvert } from "../../hooks/useCurrencyConvert";

/**
 * Основний компонент сторінки конвертації валют
 * Відображає два поля для введення/відображення суми та вибору валют
 * Містить кнопку для обміну напрямку конвертації
 */
const Converting: FC = () => {
    // Отримуємо весь необхідний стан та функції з хука конвертації
    const {
        inputValue, // сума, яку ввів користувач
        setInputValue, // зміна введеної суми
        fromCurrency, // валюта "з якої" конвертуємо
        setFromCurrency, // зміна вихідної валюти
        toCurrency, // валюта "в яку" конвертуємо
        setToCurrency, // зміна цільової валюти
        convertedValue, // результат конвертації
        currencies, // список всіх доступних валют
    } = useCurrencyConvert();

    /**
     * Міняє місцями вихідну та цільову валюту
     * (USD → EUR стає EUR → USD і навпаки)
     */
    const swapCurrencies = () => {
        // Зберігаємо тимчасово одну з валют
        const tempCurrency = fromCurrency;

        // Міняємо місцями
        setFromCurrency(toCurrency);
        setToCurrency(tempCurrency);

        // Примітка: введена сума залишається без змін
        // (тобто якщо було 100 USD → 92 EUR, після свапу буде 100 EUR → ~108.7 USD)
    };

    return (
        <div className={styles.wrapper}>
            {/* Перше поле — для введення суми користувачем */}
            <ConvertTab
                inputValue={inputValue}
                dropdownValue={fromCurrency}
                onDropdownChange={setFromCurrency}
                currencies={currencies}
                // Це поле активне — користувач може вводити суму
                isReadOnly={false}
                onInputChange={setInputValue}
            />

            {/* Кнопка обміну валют (стрілки в обидва боки) */}
            <button
                className={styles.btn}
                onClick={swapCurrencies}
                type="button"
                aria-label="Обміняти валюти місцями"
            >
                <img
                    src={arrows}
                    className={styles.img}
                    alt="Обміняти напрямок конвертації"
                />
            </button>

            {/* Друге поле — результат конвертації (тільки для читання) */}
            <ConvertTab
                inputValue={convertedValue}
                dropdownValue={toCurrency}
                onDropdownChange={setToCurrency}
                currencies={currencies}
                // Поле лише для відображення — змінити значення напряму не можна
                isReadOnly={true}
                // Порожній обробник, щоб відповідати інтерфейсу компонента
                onInputChange={() => {}}
            />
        </div>
    );
};

export default Converting;
