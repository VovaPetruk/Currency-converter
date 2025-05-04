import { FC, useRef } from "react";
import styles from "./MiniConvertTab.module.scss";
import arrow from "../../assets/img/arrow.png";
import { useConvertTab } from "../../hooks/useConvertTab";

interface MiniConvertTabProps {
    inputValue: number;
    onInputChange?: (value: number) => void;
    dropdownValue: string;
    onDropdownChange: (value: string) => void;
    currencies: Record<string, { name: string; symbol: string }>;
    isReadOnly?: boolean;
}

const MiniConvertTab: FC<MiniConvertTabProps> = (props) => {
    const selectRef = useRef<HTMLSelectElement>(null);
    const { inputProps, dropdownProps } = useConvertTab(props);

    const handleArrowClick = () => {
        if (selectRef.current) {
            if ("showPicker" in HTMLSelectElement.prototype) {
                (selectRef.current as any).showPicker();
            } else {
                selectRef.current.click();
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <input type="number" className={styles.input} {...inputProps} />
            <div className={styles.dropdown}>
                <select
                    ref={selectRef}
                    className={styles.select}
                    {...dropdownProps}
                >
                    {Object.keys(props.currencies).map((key) => (
                        <option key={key} value={key}>
                            {key} - {props.currencies[key].symbol}
                        </option>
                    ))}
                </select>
                <img
                    src={arrow}
                    alt="arrow"
                    className={`${styles.img} `}
                    onClick={handleArrowClick}
                />
            </div>
        </div>
    );
};

export default MiniConvertTab;
