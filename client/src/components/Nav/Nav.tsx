import { FC, useState, useEffect } from "react";
import styles from "./Nav.module.scss";
import converting from "../../assets/img/converting.png";
import currencyList from "../../assets/img/currencyList.png";
import grafic from "../../assets/img/grafic.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Nav: FC = () => {
    const { signOut } = useAuth();
    const [activeButton, setActiveButton] = useState("CurrencyList");
    const location = useLocation();

    // Effect to update the active button when changing the route
    useEffect(() => {
        const currentPath = location.pathname.substring(1) || "CurrencyList";
        setActiveButton(currentPath);
    }, [location.pathname]);

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <button className={styles.signOutButton} onClick={signOut}>
                    <b>SIGN OUT</b>
                </button>

                <Link
                    to="/CurrencyList"
                    onClick={() => handleButtonClick("CurrencyList")}
                >
                    <img
                        className={`${
                            activeButton === "CurrencyList"
                                ? `${styles.img} ${styles.active} `
                                : `${styles.img}`
                        }`}
                        src={currencyList}
                        title="Currency List"
                    ></img>
                </Link>
                <Link
                    to="/Converting"
                    onClick={() => handleButtonClick("Converting")}
                >
                    <img
                        className={`${
                            activeButton === "Converting"
                                ? `${styles.img} ${styles.active} `
                                : `${styles.img}`
                        }`}
                        src={converting}
                        title="Converting"
                    ></img>
                </Link>
                <Link
                    to="/HistoricalExchangeRates"
                    onClick={() => handleButtonClick("HistoricalExchangeRates")}
                >
                    <img
                        className={`${
                            activeButton === "HistoricalExchangeRates"
                                ? `${styles.img} ${styles.active} `
                                : `${styles.img}`
                        }`}
                        src={grafic}
                        title="Historical Exchange Rates"
                    ></img>
                </Link>
            </div>
            <Outlet />
        </div>
    );
};

export default Nav;
