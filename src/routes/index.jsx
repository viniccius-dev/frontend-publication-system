import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../hooks/auth";

import { SignIn } from "../pages/SignIn";
import { LoggRoutes } from "./app.routes";

export function AppRoutes() {
    const { user, loading } = useAuth();

    if(loading) {
        return <></>;
    };

    return (
        <BrowserRouter>
            {
                !user
                ?
                <Routes>
                    <Route path="/" element={<SignIn />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                :
                <LoggRoutes />
            }
        </BrowserRouter>
    );
}