import { FC } from "react";
import styles from "./Converting.module.scss";
import arrows from "../../assets/img/2arrows.png";
import ConvertTab from "../../components/ConvertTab/ConvertTab";
import { useCurrencyConvert } from "../../hooks/useCurrencyConvert";

const Converting: FC = () => {
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
            {/* First ConvertTab (entering the amount and choosing the initial currency) */}
            <ConvertTab
                inputValue={inputValue}
                dropdownValue={fromCurrency}
                onDropdownChange={setFromCurrency}
                currencies={currencies}
                isReadOnly={false}
                onInputChange={setInputValue}
            />

            <button className={styles.btn} onClick={swapCurrencies}>
                <img src={arrows} className={styles.img} alt="convert" />
            </button>

            {/* The second ConvertTab (displaying the conversion result) */}
            <ConvertTab
                inputValue={convertedValue}
                dropdownValue={toCurrency}
                onDropdownChange={setToCurrency}
                currencies={currencies}
                isReadOnly={true}
                onInputChange={() => {}}
            />
        </div>
    );
};

export default Converting;
