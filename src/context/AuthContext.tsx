import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type UserData } from "../api/services/auth.service";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const refreshUser = async () => {
        setIsLoading(true);
        try {
            const data = await authService.getCurrentUser();
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Загружаем юзера при старте
    useEffect(() => {
        refreshUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, isLoading, refreshUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
