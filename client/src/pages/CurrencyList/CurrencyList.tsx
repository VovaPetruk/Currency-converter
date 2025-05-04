import styles from "./CurrencyList.module.scss";
import { FC } from "react";
import { useCurrencyData } from "../../hooks/useCurrencyData";

const CurrencyList: FC = () => {
    const { currencies, isLoading, error, refreshData } = useCurrencyData();

    if (isLoading) {
        return <div className={styles.loading}>Loading currencies...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button onClick={refreshData} className={styles.refreshButton}>
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <h2>Currency Exchange Rates</h2>
                <button onClick={refreshData} className={styles.refreshButton}>
                    Update data
                </button>
            </div>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Exchange rate to the Dollar</th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {Object.keys(currencies).map((key) => (
                        <tr key={key}>
                            <td>{currencies[key].name}</td>
                            <td>{currencies[key].symbol}</td>
                            <td>{currencies[key].exchangeRate || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CurrencyList;
