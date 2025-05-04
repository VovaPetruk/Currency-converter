import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MessageContext } from "./MessageContext";

const PrivateRoute: React.FC = () => {
    const { showMessage } = useContext(MessageContext);
    const location = useLocation();

    const isAuthenticated = localStorage.getItem("token") ? true : false;

    if (!isAuthenticated) {
        showMessage(
            "Access is denied. Please log in to view this page.",
            "error"
        );

        return <Navigate to="/" state={{ from: location.pathname }} />;
    }

    return <Outlet />;
};

export default PrivateRoute;
