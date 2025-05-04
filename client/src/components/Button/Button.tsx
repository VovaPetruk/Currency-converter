import styles from "./Button.module.scss";
import { FC } from "react";
interface MyComponentProps {
    descr: string;
    disabled?: boolean;
}

const Button: FC<MyComponentProps> = ({ descr, disabled }) => {
    return (
        <button className={styles.btn} type={"submit"} disabled={disabled}>
            {descr}
        </button>
    );
};

export default Button;
