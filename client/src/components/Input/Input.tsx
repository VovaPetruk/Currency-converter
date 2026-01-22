// Імпортуємо стилі з модуля (CSS Modules)
// Це дозволяє використовувати локальні класи, які не конфліктують з іншими компонентами
import styles from "./Input.module.scss";
import React from "react";

// Розширюємо стандартні пропси HTML-інпуту своїми додатковими пропсами
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    placeholder: string;

    // Кастомний стиль, який передається напряму в інлайн-стилі інпуту
    style: React.CSSProperties;

    // id потрібен для зв'язування з <label>, доступності (accessibility) та тестів
    id: string;

    // Помилка — опціональне поле, яке показує повідомлення під інпутом
    error?: string;
}

// Компонент створений через forwardRef, щоб можна було передати ref на нативний <input>
// Це дуже важливо для:
// - фокусування програмно (inputRef.current?.focus())
// - роботи з бібліотеками (наприклад react-hook-form, formik тощо)
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    // Деструктуризуємо потрібні нам пропси + ...rest — всі інші стандартні пропси інпуту
    ({ type, error, placeholder, style, id, ...rest }, ref) => {
        return (
            <>
                {/* Основний елемент інпуту */}
                <input
                    // Тип інпуту (text, password, email, number тощо)
                    type={type}
                    // Текст-підказка всередині поля
                    placeholder={placeholder}
                    // Інлайн-стилі
                    style={style}
                    // Головний клас зі стилів
                    className={styles.input}
                    // id для label/htmlFor та доступності
                    id={id}
                    // Передаємо ref, який прийшов з батьківського компонента
                    ref={ref}
                    // Розгортаємо всі інші пропси: value, onChange, onBlur, disabled, name тощо
                    {...rest}
                />

                {/* Показуємо повідомлення про помилку тільки коли error не undefined/порожній */}
                {error && <p className={styles.errorMessage}>{error}</p>}
            </>
        );
    }
);

// Змінюємо displayName — дуже корисна річ при дебагінгу в React DevTools
// Без цього в дереві компонентів буде просто "ForwardRef"
Input.displayName = "Input";

export default Input;
