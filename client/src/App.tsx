// Імпорт необхідних компонентів та функцій з react-router-dom для створення маршрутизації
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

// Імпорт компонентів сторінок та обгорток
import Wrapper from "./components/Wrapper/Wrapper"; // Основна обгортка для стилів/структури додатка
import Nav from "./components/Nav/Nav"; // Компонент навігаційної панелі (використовується як layout для захищених сторінок)
import LogIn from "./pages/LogIn/LogIn"; // Сторінка входу
import SignUp from "./pages/SignUp/SignUp"; // Сторінка реєстрації
import CurrencyList from "./pages/CurrencyList/CurrencyList"; // Список валют
import Converting from "./pages/Converting/Converting"; // Сторінка конвертації валют
import HistoricalExchangeRates from "./pages/HistoricalExchangeRates/HistoricalExchangeRates"; // Сторінка історичних курсів
import PrivateRoute from "./components/PrivateRoute"; // Компонент-захист для приватних маршрутів (перевіряє авторизацію)
import { MessageProvider } from "./components/MessageContext"; // Контекст для глобального відображення повідомлень (наприклад, помилок/успіхів)
import MessageDisplay from "./components/MessageDisplay"; // Компонент, що відображає повідомлення з контексту

// Створення об'єкта маршрутизатора з використанням createBrowserRouter
const router = createBrowserRouter([
    // Публічні маршрути (доступні без авторизації)
    { path: "/LogIn", element: <LogIn /> },
    { path: "/SignUp", element: <SignUp /> },

    // Кореневий маршрут: автоматичний редірект на сторінку входу
    {
        path: "/",
        element: <Navigate to="/LogIn" replace />,
    },

    // Група захищених маршрутів з спільним layout-компонентом Nav
    {
        element: <Nav />, // Навігаційна панель відображається на всіх захищених сторінках
        children: [
            {
                // Обгортка для всіх приватних маршрутів — перевіряє, чи користувач авторизований
                element: <PrivateRoute />,
                children: [
                    { path: "/CurrencyList", element: <CurrencyList /> },
                    { path: "/Converting", element: <Converting /> },
                    {
                        path: "/HistoricalExchangeRates",
                        element: <HistoricalExchangeRates />,
                    },
                ],
            },
        ],
    },
]);

// Головний компонент додатка
function App() {
    return (
        // Глобальний провайдер контексту для повідомлень (дозволяє показувати сповіщення з будь-якої сторінки)
        <MessageProvider>
            {/* Обгортка для загальної структури (може містити глобальні стилі, теми тощо) */}
            <Wrapper>
                {/* Компонент, що рендерить поточні повідомлення з контексту */}
                <MessageDisplay />
                {/* Підключення маршрутизатора до додатка */}
                <RouterProvider router={router} />
            </Wrapper>
        </MessageProvider>
    );
}

export default App;
