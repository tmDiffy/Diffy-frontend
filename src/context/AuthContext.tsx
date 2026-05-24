import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type UserData } from "../api/services/auth.service";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
