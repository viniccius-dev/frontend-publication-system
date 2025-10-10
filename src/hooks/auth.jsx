import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../services/api";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    function isTokenExpired(token) {
        const { exp } = jwtDecode(token);
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
                alert(error.response.data.message);
            } else if (error.message === "Token expirado") {
                alert("Token expirado. Por favor, faça login novamente.");
            } else {
                alert("Não foi possível entrar.");
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
            alert("Perfil atualizado!");
        } catch(error) {
            if(error.response) {
                alert(error.response.data.message);
            } else {
                alert("Não foi possível atualizar o perfil.");
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