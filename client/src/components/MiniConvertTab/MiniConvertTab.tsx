import { FC, useRef } from "react";
import styles from "./MiniConvertTab.module.scss";
import arrow from "../../assets/img/arrow.png";
import { useConvertTab } from "../../hooks/useConvertTab";

interface MiniConvertTabProps {
    inputValue: number; // Поточне значення в полі вводу
    onInputChange?: (value: number) => void; // Колбек при зміні значення (опціонально)
    dropdownValue: string; // Вибрана валюта
    onDropdownChange: (value: string) => void; // Колбек при зміні валюти
    currencies: Record<string, { name: string; symbol: string }>; // Список доступних валют
    isReadOnly?: boolean; // Чи тільки для читання (якщо потрібно)
}

const MiniConvertTab: FC<MiniConvertTabProps> = ({
    inputValue,
    onInputChange,
    dropdownValue,
    onDropdownChange,
    currencies,
    isReadOnly,
}) => {
    const selectRef = useRef<HTMLSelectElement>(null);

    // Хук, який готує пропси для input та select з урахуванням режиму read-only тощо
    const { inputProps, dropdownProps } = useConvertTab({
        inputValue,
        onInputChange,
        dropdownValue,
        onDropdownChange,
        isReadOnly,
    });

    // Клік по стрілці відкриває випадаючий список
    const handleArrowClick = () => {
        if (!selectRef.current) return;

        // Спробуємо використати сучасний метод showPicker (якщо підтримується)
        if ("showPicker" in HTMLSelectElement.prototype) {
            (selectRef.current as any).showPicker();
        } else {
            // Фолбек для старих браузерів — просто імітуємо клік
            selectRef.current.click();
        }
    };

    return (
        <div className={styles.wrapper}>
            {/* Поле для введення суми */}
            <input
                type="number"
                className={styles.input}
                {...inputProps} // value, onChange, readOnly тощо приходять з хука
            />

            {/* Блок з вибором валюти */}
            <div className={styles.dropdown}>
                <select
                    ref={selectRef}
                    className={styles.select}
                    {...dropdownProps} // value, onChange тощо
                >
                    {Object.keys(currencies).map((key) => (
                        <option key={key} value={key}>
                            {key} - {currencies[key].symbol}
                        </option>
                    ))}
                </select>

                {/* Кастомна стрілочка, яка відкриває селект при кліку */}
                <img
                    src={arrow}
                    alt="відкрити вибір валюти"
                    className={styles.img}
                    onClick={handleArrowClick}
                />
            </div>
        </div>
    );
};

export default MiniConvertTab;
