import { useTranslation } from "react-i18next";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.module.scss";
import { useState } from "react";
import { authService } from "../../api/services/auth.service";
import { toast } from "react-toastify";
// import { apiClient } from "../../api/apiClient"; // Если не используется, лучше удалить

export function ProfilePage() {
    const { user, logout } = useCurrentUser();
    const [username, setUsername] = useState(user?.username);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    // Состояние для управления модальным окном
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { t } = useTranslation();

    const handleSaveClick = async () => {
        let change = false;

        try {
            // Изменение имени
            if (username && username !== user?.username) {
                await authService.changeUsername(username);
                toast.success(t("profile.usernameChanged"));
                change = true;
            }

            // Изменение пароля
            if (oldPassword && newPassword && newPasswordConfirm) {
                if (newPassword !== newPasswordConfirm) {
                    toast.error(t("profile.passwordMatchingError"));
                    return;
                }
                await authService.changePassword(oldPassword, newPassword);
                toast.success(t("profile.passwordChanged"));
                change = true;

                setOldPassword("");
                setNewPassword("");
                setNewPasswordConfirm("");
            }

            if (!change) {
                return;
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage =
                error.response?.data?.message ||
                t("profile.errorOccurred") ||
                "Произошла ошибка";
            toast.error(errorMessage);
        }
    };

    // Функция для подтверждения удаления
    const confirmDelete = async () => {
        try {
            await authService.deleteProfile();
            toast.success(
                t("profile.accountDeleted") || "Аккаунт успешно удален",
            );
            setShowDeleteModal(false);
            logout();
        } catch (error: any) {
            console.error(error);
            const errorMessage =
                error.response?.data?.message ||
                t("profile.errorOccurred") ||
                "Произошла ошибка";
            toast.error(errorMessage);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="profile-block">
            {/* ... Верхушка профиля без изменений ... */}
            <div className="user-avatar">
                <p className="avatar-text">
                    {user?.username[0]?.toUpperCase() || "U"}
                </p>
            </div>
            <p className="user-name">{user?.username}</p>
            <p className="user-email">{user?.email}</p>

            <div className="profile-change">
                <p className="account-info">{t("profile.accountInfo")}</p>
                <hr className="line" />

                <p className="name-change">{t("profile.username")}</p>
                <input
                    type="text"
                    value={username || ""}
                    placeholder={t("profile.enterUsername")}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <hr className="line" />

                <p className="old-password">{t("profile.oldPassword")}</p>
                <input
                    type="password"
                    value={oldPassword}
                    placeholder={t("profile.enterOldPassword")}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <p className="new-password">{t("profile.newPassword")}</p>
                <input
                    type="password"
                    value={newPassword}
                    placeholder={t("profile.enterNewPassword")}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="new-password-confirm">
                    {t("profile.newPasswordConfirm")}
                </p>
                <input
                    type="password"
                    value={newPasswordConfirm}
                    placeholder={t("profile.enterNewPasswordConfirm")}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
            </div>

            {/* Кнопки управления */}
            <div className="profile-actions">
                <button onClick={handleSaveClick}>{t("profile.save")}</button>
                {/* <button onClick={logout}>{t("profile.logout")}</button> */}

                <button
                    className="btn-danger"
                    onClick={() => setShowDeleteModal(true)}
                >
                    {t("profile.deleteAccount") || "Удалить аккаунт"}
                </button>
            </div>

            {/* Модальное окно подтверждения */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>
                            {t("profile.deleteConfirmTitle") ||
                                "Удалить аккаунт?"}
                        </h3>
                        <p>
                            {t("profile.deleteConfirmText") ||
                                "Вы уверены? Это действие нельзя будет отменить, и все ваши данные будут потеряны."}
                        </p>
                        <div className="modal-buttons">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                {t("profile.cancel") || "Отмена"}
                            </button>
                            <button
                                className="btn-confirm-delete"
                                onClick={confirmDelete}
                            >
                                {t("profile.yesDelete") || "Да, удалить"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
