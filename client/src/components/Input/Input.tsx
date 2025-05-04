import styles from "./Input.module.scss";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    placeholder: string;
    style: {};
    id: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ type, error, placeholder, style, id, ...rest }, ref) => {
        return (
            <>
                <input
                    type={type}
                    placeholder={placeholder}
                    style={style}
                    className={styles.input}
                    id={id}
                    ref={ref}
                    {...rest}
                />
                {error && <p>{error}</p>}
            </>
        );
    }
);

export default Input;
