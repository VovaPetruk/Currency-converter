import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import Wrapper from "./components/Wrapper/Wrapper";
import Nav from "./components/Nav/Nav";
import LogIn from "./pages/LogIn/LogIn";
import SignUp from "./pages/SignUp/SignUp";
import CurrencyList from "./pages/CurrencyList/CurrencyList";
import Converting from "./pages/Converting/Converting";
import HistoricalExchangeRates from "./pages/HistoricalExchangeRates/HistoricalExchangeRates";
import PrivateRoute from "./components/PrivateRoute";
import { MessageProvider } from "./components/MessageContext";
import MessageDisplay from "./components/MessageDisplay";

const router = createBrowserRouter([
    { path: "/LogIn", element: <LogIn /> },
    { path: "/SignUp", element: <SignUp /> },
    {
        path: "/",
        element: <Navigate to="/LogIn" replace />,
    },
    {
        element: <Nav />,
        children: [
            {
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

function App() {
    return (
        <MessageProvider>
            <Wrapper>
                <MessageDisplay />
                <RouterProvider router={router} />
            </Wrapper>
        </MessageProvider>
    );
}

export default App;
