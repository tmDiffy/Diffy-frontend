import { data } from "react-router-dom";
import { apiClient } from "../apiClient";

export type UserData = {
    email: string;
    username: string;
};

export const authService = {
    login: (credentials: object) => apiClient.post<any>("/token/", credentials),

    register: (userData: object) =>
        apiClient.post<any>("/accounts/register/", userData),

    getCurrentUser: () => apiClient.get<UserData>("/accounts/current_user/"),

    resetPassword: (email: string) =>
        apiClient.post("/accounts/password_reset/", { email }),

    resetPasswordConfirm: (data: {
        uid: string;
        token: string;
        new_password: string;
    }) => apiClient.post("/accounts/password_reset/confirm/", data),

    changePassword: (data: object) =>
        apiClient.post("/accounts/password_change/", data),
};
