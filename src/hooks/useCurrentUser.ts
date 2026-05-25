import { useState, useEffect } from "react";
import { authService, type UserData } from "../api/services/auth.service";
import { useNavigate } from "react-router";

export function useCurrentUser() {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const data = await authService.getCurrentUser();
            setUser(data);
            console.log("Текущий пользователь:", data);
        } catch (error) {
            localStorage.removeItem("access_token");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/");
    };

    return { user, setUser, logout, fetchUser, isLoading };
}
