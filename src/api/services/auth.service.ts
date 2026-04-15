import { data } from "react-router-dom";
import { apiClient } from "../apiClient";

export type UserData = {
    email: string;
    username: string;
};

export const authService = {
    login: (credentials: object) => apiClient.post<any>("/token/", credentials),

    register: (username: string, email: string, password: string) =>
        apiClient.post<any>("/accounts/register/", {
            username,
            email,
            password,
        }),

    getCurrentUser: () => apiClient.get<UserData>("/accounts/current_user/"),

    resetPassword: (email: string) =>
        apiClient.post("/accounts/password_reset/", { email }),

    resetPasswordConfirm: (
        uidb64: string,
        token: string,
        new_password: string,
    ) =>
        apiClient.post("/accounts/password_reset/confirm/", {
            uidb64,
            token,
            new_password,
        }),

    changePassword: (old_password: string, new_password: string) =>
        apiClient.post("/accounts/password_change/", {
            old_password,
            new_password,
        }),

    changeUsername: (new_username: string) =>
        apiClient.post("/accounts/username_change/", { new_username }),

    confirmEmail: (uidb64: string, token: string) =>
        apiClient.post("/accounts/activate/", { uidb64, token }),

    deleteProfile: () => apiClient.delete("/accounts/profile_delete/"),
};
