import { useState, useEffect } from "react";
import { authService, type UserData } from "../api/services/auth.service";
import { useNavigate } from "react-router";

export function useCurrentUser() {
    const [user, setUser] = useState<UserData | null>(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        try {
            const data = await authService.getCurrentUser();
            setUser(data);
        } catch (error) {
            localStorage.removeItem("access_token");
            setUser(null);
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

    return { user, setUser, logout, fetchUser };
}
