import { FC, useRef } from "react";
import styles from "./ConvertTab.module.scss";
import arrow from "../../assets/img/arrow.png";
import { useConvertTab } from "../../hooks/useConvertTab";

interface ConvertTabProps {
    inputValue: number;
    onInputChange?: (value: number) => void;
    dropdownValue: string;
    onDropdownChange: (value: string) => void;
    currencies: Record<string, { name: string; symbol: string }>;
    isReadOnly?: boolean;
}

const ConvertTab: FC<ConvertTabProps> = (props) => {
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
            <div className={styles.wrap}>
                <input type="number" className={styles.input} {...inputProps} />
                <div className={styles.dropdownContainer}>
                    <select
                        ref={selectRef}
                        className={styles.dropdownList}
                        {...dropdownProps}
                    >
                        {Object.keys(props.currencies).map((key) => (
                            <option key={key} value={key}>
                                {props.currencies[key].name} -{" "}
                                {props.currencies[key].symbol}
                            </option>
                        ))}
                    </select>
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
