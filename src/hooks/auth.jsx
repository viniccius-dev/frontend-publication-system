import { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

// Small helper to decode JWT payload without adding external deps.
// It decodes the middle segment (base64url) and parses JSON. Returns {} on error.
function decodeJwtPayload(token) {
    try {
        const parts = token.split('.');
        if (!parts[1]) return {};
        // base64url -> base64
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const hasBuffer = (typeof Buffer !== 'undefined');
    const json = hasBuffer ? Buffer.from(padded, 'base64').toString('utf8') : decodeURIComponent(escape(window.atob(padded)));
        return JSON.parse(json);
    } catch (e) {
        return {};
    }
}
import { api } from "../services/api";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    function isTokenExpired(token) {
        const { exp } = decodeJwtPayload(token) || {};
        if (!exp) return true; // if we cannot parse, treat as expired
        const expirationTime = exp * 1000;
        return Date.now() > expirationTime;
    };

    async function signIn({ email, password }) {
        try {
            const response = await api.post("/sessions", { email, password });
            const { user, token } = response.data;

            if(isTokenExpired(token)) {
                throw new Error("Token expirado");
            };

            localStorage.setItem("@system:user", JSON.stringify(user));
            localStorage.setItem("@system:token", token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setData({ user, token });
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message || 'Erro ao entrar');
            } else if (error.message === "Token expirado") {
                toast.error("Token expirado. Por favor, faça login novamente.");
            } else {
                toast.error("Não foi possível entrar.");
            };
        };
    };

    async function signOut() {
        localStorage.removeItem("@system:user");
        localStorage.removeItem("@system:token");

        setData({});
    };

    async function updateProfile({ user, sessionUpdated }) {
        try {
            await api.put("/users", user);

            if(sessionUpdated) {
                localStorage.setItem("@system:user", JSON.stringify(sessionUpdated));
                setData({ user: sessionUpdated, token: data.token });
            };
            toast.success("Perfil atualizado!");
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message || 'Erro ao atualizar perfil');
            } else {
                toast.error("Não foi possível atualizar o perfil.");
            };
        };
    };

    useEffect(() => {
        const token = localStorage.getItem("@system:token");
        const user = localStorage.getItem("@system:user");

        if(token && user) {
            if(!isTokenExpired(token)) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setData({
                    token,
                    user: JSON.parse(user)
                });
            } else {
                signOut();
            };
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            updateProfile,
            user: data.user,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    const context = useContext(AuthContext);

    return context;
};

export { AuthProvider, useAuth };