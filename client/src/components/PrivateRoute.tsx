import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MessageContext } from "./MessageContext";

const PrivateRoute: React.FC = () => {
    const { showMessage } = useContext(MessageContext);
    const location = useLocation();

    // Простий спосіб перевірки авторизації через токен у localStorage
    // У реальних проєктах краще використовувати більш безпечний підхід
    const isAuthenticated = !!localStorage.getItem("token");

    // Якщо користувач НЕ авторизований
    if (!isAuthenticated) {
        // Показуємо повідомлення про помилку
        showMessage(
            "Доступ заборонено. Будь ласка, увійдіть в акаунт.",
            "error"
        );

        // Перенаправляємо на сторінку логіну
        // Зберігаємо поточний шлях у state, щоб після логіну повернути користувача назад
        return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }

    // Якщо користувач авторизований — рендеримо дочірні маршрути
    return <Outlet />;
};

export default PrivateRoute;
