import React, { createContext, useState, ReactNode } from "react";

// Можливі типи сповіщень
export type MessageType = "error" | "success" | "info" | "warning";

// Структура одного сповіщення
export interface Message {
    text: string;
    type: MessageType;
}

// Тип значення, яке буде доступне через контекст
interface MessageContextType {
    message: Message | null; // Поточне активне сповіщення (або null)
    showMessage: (text: string, type?: MessageType) => void; // Функція для показу сповіщення
}

// Пропси для провайдера
interface MessageProviderProps {
    children: ReactNode;
}

// Створюємо контекст з початковими (порожніми) значеннями
export const MessageContext = createContext<MessageContextType>({
    message: null,
    showMessage: () => {}, // заглушка, щоб TypeScript не сварився
});

/**
 * Провайдер контексту для управління сповіщеннями в додатку
 * Автоматично прибирає сповіщення через 5 секунд
 */
export const MessageProvider: React.FC<MessageProviderProps> = ({
    children,
}) => {
    const [message, setMessage] = useState<Message | null>(null);

    // Функція для показу сповіщення
    const showMessage = (text: string, type: MessageType = "error") => {
        // Показуємо нове сповіщення
        setMessage({ text, type });

        // Автоматично прибираємо через 5 секунд
        setTimeout(() => {
            setMessage(null);
        }, 5000);
    };

    return (
        <MessageContext.Provider value={{ message, showMessage }}>
            {children}
        </MessageContext.Provider>
    );
};
