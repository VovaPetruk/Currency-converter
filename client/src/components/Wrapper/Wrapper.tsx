import { FC, ReactNode } from "react";
import styles from "./Wrapper.module.scss";

// =============================================
// Простий обгортковий компонент
// =============================================
interface WrapperProps {
    children: ReactNode; // Вміст, який потрібно обгорнути
}

/**
 * Базовий контейнер-обгортка для компонентів
 * Використовується для:
 * - застосування загальних стилів (відступи, фон, позиціонування тощо)
 * - логічного групування вмісту
 * - спрощення рефакторингу в майбутньому
 */
const Wrapper: FC<WrapperProps> = ({ children }) => {
    return <div className={styles.wrapper}>{children}</div>;
};

export default Wrapper;
