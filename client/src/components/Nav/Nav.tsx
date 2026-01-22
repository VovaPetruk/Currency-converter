import { FC, useState, useEffect } from "react";
import styles from "./Nav.module.scss";
import converting from "../../assets/img/converting.png";
import currencyList from "../../assets/img/currencyList.png";
import grafic from "../../assets/img/grafic.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Nav: FC = () => {
    const { signOut } = useAuth();

    // Поточна активна вкладка (визначається за шляхом URL)
    const [activeButton, setActiveButton] = useState("CurrencyList");

    const location = useLocation();

    // Синхронізуємо стан активної кнопки з поточним маршрутом
    useEffect(() => {
        // Якщо шлях "/", то вважаємо це CurrencyList
        const currentPath = location.pathname.substring(1) || "CurrencyList";
        setActiveButton(currentPath);
    }, [location.pathname]);

    // Обробник кліку по іконці (змінює активну вкладку)
    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <div className={styles.container}>
            {/* Бічна/верхня панель навігації */}
            <div className={styles.nav}>
                {/* Кнопка виходу з акаунту */}
                <button className={styles.signOutButton} onClick={signOut}>
                    <b>SIGN OUT</b>
                </button>

                {/* Посилання на список валют */}
                <Link
                    to="/CurrencyList"
                    onClick={() => handleButtonClick("CurrencyList")}
                >
                    <img
                        className={
                            activeButton === "CurrencyList"
                                ? `${styles.img} ${styles.active}`
                                : styles.img
                        }
                        src={currencyList}
                        title="Currency List"
                        alt="Список валют"
                    />
                </Link>

                {/* Посилання на конвертер */}
                <Link
                    to="/Converting"
                    onClick={() => handleButtonClick("Converting")}
                >
                    <img
                        className={
                            activeButton === "Converting"
                                ? `${styles.img} ${styles.active}`
                                : styles.img
                        }
                        src={converting}
                        title="Converting"
                        alt="Конвертер валют"
                    />
                </Link>

                {/* Посилання на історичні курси */}
                <Link
                    to="/HistoricalExchangeRates"
                    onClick={() => handleButtonClick("HistoricalExchangeRates")}
                >
                    <img
                        className={
                            activeButton === "HistoricalExchangeRates"
                                ? `${styles.img} ${styles.active}`
                                : styles.img
                        }
                        src={grafic}
                        title="Historical Exchange Rates"
                        alt="Графік історичних курсів"
                    />
                </Link>
            </div>

            {/* Місце для рендеру вмісту дочірніх маршрутів */}
            <Outlet />
        </div>
    );
};

export default Nav;
