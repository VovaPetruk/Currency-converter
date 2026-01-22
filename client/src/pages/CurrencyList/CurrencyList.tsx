import styles from "./CurrencyList.module.scss";
import { FC } from "react";
import { useCurrencyData } from "../../hooks/useCurrencyData";

/**
 * Компонент списку всіх валют з курсами відносно долара США
 * Відображає таблицю з даними, станами завантаження та помилок
 */
const CurrencyList: FC = () => {
    // Отримуємо дані та стани з хука управління валютами
    const {
        currencies, // об'єкт валют з назвами, символами та курсами
        isLoading, // чи триває завантаження даних
        error, // текст помилки (якщо є)
        refreshData, // функція примусового оновлення даних
    } = useCurrencyData();

    // Стан завантаження — показуємо лоадер
    if (isLoading) {
        return <div className={styles.loading}>Завантаження валют...</div>;
    }

    // Стан помилки — показуємо повідомлення та кнопку повторної спроби
    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button
                    onClick={refreshData}
                    className={styles.refreshButton}
                    type="button"
                >
                    Спробувати ще раз
                </button>
            </div>
        );
    }

    // Успішний стан — відображаємо таблицю з даними
    return (
        <div className={styles.tableContainer}>
            {/* Заголовок таблиці + кнопка оновлення */}
            <div className={styles.tableHeader}>
                <h2>Курси валют</h2>
                <button
                    onClick={refreshData}
                    className={styles.refreshButton}
                    type="button"
                    aria-label="Оновити курси валют"
                >
                    Оновити дані
                </button>
            </div>

            {/* Таблиця валют */}
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th>Назва</th>
                        <th>Символ</th>
                        <th>Курс до долара США</th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {Object.keys(currencies).map((key) => {
                        const currency = currencies[key];
                        return (
                            <tr key={key}>
                                <td>{currency.name}</td>
                                <td>{currency.symbol}</td>
                                <td>
                                    {currency.exchangeRate !== undefined
                                        ? currency.exchangeRate.toFixed(4)
                                        : "N/A"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CurrencyList;
