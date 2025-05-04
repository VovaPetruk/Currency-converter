import { FC } from "react";
import styles from "./HistoricalExchangeRates.module.scss";
import arrows from "../../assets/img/2arrows.png";
import MiniConvertTab from "../../components/MiniConvertTab/MiniConvertTab";
import Chart from "../../components/Chart/Chart";
import { useCurrencyConvert } from "../../hooks/useCurrencyConvert";

const HistoricalExchangeRates: FC = () => {
    const {
        inputValue,
        setInputValue,
        fromCurrency,
        setFromCurrency,
        toCurrency,
        setToCurrency,
        convertedValue,
        currencies,
    } = useCurrencyConvert();

    const swapCurrencies = () => {
        const tempCurrency = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(tempCurrency);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.wrap}>
                <MiniConvertTab
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    dropdownValue={fromCurrency}
                    onDropdownChange={setFromCurrency}
                    currencies={currencies}
                    isReadOnly={false}
                />
                <button className={styles.btn} onClick={swapCurrencies}>
                    <img src={arrows} className={styles.img} alt="swap" />
                </button>
                <MiniConvertTab
                    inputValue={convertedValue}
                    dropdownValue={toCurrency}
                    onDropdownChange={setToCurrency}
                    currencies={currencies}
                    isReadOnly={true}
                />
            </div>
            <Chart fromCurrency={fromCurrency} toCurrency={toCurrency} />
        </div>
    );
};

export default HistoricalExchangeRates;
