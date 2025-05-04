import React, { useContext } from "react";
import { MessageContext } from "./MessageContext";

const MessageDisplay: React.FC = () => {
    const { message } = useContext(MessageContext);

    if (!message) return null;

    const styles = {
        container: {
            position: "fixed" as const,
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            borderRadius: "4px",
            zIndex: 1000,
            backgroundColor: message.type === "error" ? "#f44336" : "#4caf50",
            color: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        },
    };

    return <div style={styles.container}>{message.text}</div>;
};

export default MessageDisplay;
