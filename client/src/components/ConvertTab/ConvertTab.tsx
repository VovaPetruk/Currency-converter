// Імпортуємо тип FC та хук useRef з React
import { FC, useRef } from "react";

// Імпортуємо CSS-модуль для стилів компонента
import styles from "./ConvertTab.module.scss";

// Імпортуємо зображення стрілки для кастомного dropdown
import arrow from "../../assets/img/arrow.png";

// Кастомний хук, який інкапсулює логіку input + select
import { useConvertTab } from "../../hooks/useConvertTab";

// ====== ПРОПСИ КОМПОНЕНТА ======
interface ConvertTabProps {
    // Поточне значення input
    inputValue: number;

    // Колбек при зміні значення input (необовʼязковий)
    onInputChange?: (value: number) => void;

    // Поточне значення dropdown (валюта)
    dropdownValue: string;

    // Колбек при зміні валюти
    onDropdownChange: (value: string) => void;

    // Список валют у вигляді обʼєкта
    currencies: Record<string, { name: string; symbol: string }>;

    // Чи input тільки для читання (наприклад, друга вкладка конвертера)
    isReadOnly?: boolean;
}

// ====== КОМПОНЕНТ ======
const ConvertTab: FC<ConvertTabProps> = (props) => {
    // ref на <select>, щоб програмно відкривати dropdown
    const selectRef = useRef<HTMLSelectElement>(null);

    // Отримуємо готові props для input та select з кастомного хука
    // Це дозволяє винести бізнес-логіку з UI-компонента
    const { inputProps, dropdownProps } = useConvertTab(props);

    // ====== ОБРОБНИК КЛІКУ ПО СТРІЛЦІ ======
    const handleArrowClick = () => {
        if (selectRef.current) {
            // Перевірка підтримки showPicker (Chrome, Edge)
            if ("showPicker" in HTMLSelectElement.prototype) {
                // showPicker — нативне відкриття select
                (selectRef.current as any).showPicker();
            } else {
                // Фолбек для інших браузерів
                selectRef.current.click();
            }
        }
    };

    // ====== РЕНДЕР ======
    return (
        <div className={styles.wrapper}>
            <div className={styles.wrap}>
                {/* Поле введення суми */}
                <input
                    type="number"
                    className={styles.input}
                    {...inputProps} // value, onChange, readOnly і т.д.
                />

                {/* Контейнер для dropdown + кастомної стрілки */}
                <div className={styles.dropdownContainer}>
                    {/* Нативний select */}
                    <select
                        ref={selectRef}
                        className={styles.dropdownList}
                        {...dropdownProps} // value + onChange
                    >
                        {Object.keys(props.currencies).map((key) => (
                            <option key={key} value={key}>
                                {props.currencies[key].name} -{" "}
                                {props.currencies[key].symbol}
                            </option>
                        ))}
                    </select>

                    {/* Кастомна стрілка для відкриття select */}
                    <img
                        src={arrow}
                        alt="arrow"
                        className={styles.img}
                        onClick={handleArrowClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConvertTab;
