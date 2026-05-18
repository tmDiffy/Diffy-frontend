import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage/HomePage";
import { ComparePage } from "../pages/ComparePage/ComparePage";
import { Login } from "../features/Login/Login";
import { Register } from "../features/Register/Register";
import { FavoritesPage } from "../pages/FavouritesPage/FavoritesPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { PasswordResetPage } from "../pages/PasswordResetPage/PasswordResetPage";
import { ResetPasswordConfirmPage } from "../pages/ResetPasswordConfirmPage/ResetPasswordConfirmPage";
import { ActivateAccountPage } from "../pages/ActivateAccountPage/ActivateAccountPage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/password_reset" element={<PasswordResetPage />} />
            <Route
                path="/password_reset/:uid/:token"
                element={<ResetPasswordConfirmPage />}
            />
            <Route
                path="/activate/:uid/:token"
                element={<ActivateAccountPage />}
            />
        </Routes>
    );
};
