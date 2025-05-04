import { useNavigate } from "react-router-dom";

export function useAuth() {
    const navigate = useNavigate();

    const signOut = () => {
        localStorage.clear();
        navigate("/LogIn");
    };

    return { signOut };
}
