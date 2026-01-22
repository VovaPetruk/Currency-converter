import React, { useContext } from "react";
import { MessageContext } from "./MessageContext";

const MessageDisplay: React.FC = () => {
    // Отримуємо поточне сповіщення з контексту
    const { message } = useContext(MessageContext);

    // Якщо немає активного повідомлення — нічого не рендеримо
    if (!message) return null;

    // Інлайн-стилі залежно від типу повідомлення
    const styles = {
        container: {
            position: "fixed" as const, // Фіксоване позиціонування відносно вікна
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            borderRadius: "4px",
            zIndex: 1000, // Вище більшості елементів
            backgroundColor: message.type === "error" ? "#f44336" : "#4caf50",
            color: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        },
    };

    return <div style={styles.container}>{message.text}</div>;
};

export default MessageDisplay;
