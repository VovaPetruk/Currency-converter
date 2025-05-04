import { FC, ReactNode } from "react";
import styles from "./Wrapper.module.scss";

interface MyComponentProps {
    children: ReactNode;
}

const Wrapper: FC<MyComponentProps> = ({ children }) => {
    return <div className={styles.wrapper}>{children}</div>;
};

export default Wrapper;
