import React, { createContext, useState, ReactNode } from "react";

export type MessageType = "error" | "success" | "info" | "warning";

export interface Message {
    text: string;
    type: MessageType;
}

interface MessageContextType {
    message: Message | null;
    showMessage: (text: string, type?: MessageType) => void;
}

interface MessageProviderProps {
    children: ReactNode;
}

export const MessageContext = createContext<MessageContextType>({
    message: null,
    showMessage: () => {},
});

export const MessageProvider: React.FC<MessageProviderProps> = ({
    children,
}) => {
    const [message, setMessage] = useState<Message | null>(null);

    const showMessage = (text: string, type: MessageType = "error") => {
        setMessage({ text, type });

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
