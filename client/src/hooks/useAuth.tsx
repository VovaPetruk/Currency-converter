import { useNavigate } from "react-router-dom";

/**
 * Хук для управління автентифікацією
 */
export function useAuth() {
    const navigate = useNavigate();

    /**
     * Виконує вихід користувача з системи
     */
    const signOut = () => {
        localStorage.clear();
        navigate("/LogIn", { replace: true });
    };

    return { signOut };
}
