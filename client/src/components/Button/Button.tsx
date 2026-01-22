import styles from "./Button.module.scss";

import { FC } from "react";

// Описуємо інтерфейс пропсів компонента Button
interface MyComponentProps {
    descr: string;
    disabled?: boolean;
}

const Button: FC<MyComponentProps> = ({ descr, disabled }) => {
    return (
        <button
            // Підключаємо CSS-клас із SCSS-модуля
            className={styles.btn}
            // Тип кнопки — submit (корисно для форм)
            type="submit"
            // Атрибут disabled приймає boolean
            // Якщо disabled === true — кнопка стає неактивною
            disabled={disabled}
        >
            {/* Відображаємо текст кнопки, переданий через проп descr */}
            {descr}
        </button>
    );
};

export default Button;
