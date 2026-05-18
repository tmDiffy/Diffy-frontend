// src/pages/ProfilePage/ChangePasswordForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../../api/services/auth.service";

interface Props {
    onCancel: () => void;
}

export function ChangePasswordForm({ onCancel }: Props) {
    const { t } = useTranslation();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== reNewPassword) {
            setError(t("auth.passwordsDoNotMatch"));
            return;
        }

        setLoading(true);
        try {
            // Отправляем данные на бэкенд
            await authService.changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                re_new_password: reNewPassword,
            });

            alert(t("profile.passwordChangedSuccess"));
            onCancel(); // Закрываем форму после успеха
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="password-form" onSubmit={handleSubmit}>
            <h3>{t("profile.changePasswordTitle")}</h3>

            <input
                type="password"
                placeholder={t("profile.oldPassword")}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder={t("profile.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder={t("profile.confirmNewPassword")}
                value={reNewPassword}
                onChange={(e) => setReNewPassword(e.target.value)}
                required
            />

            {error && <p className="error-message">{error}</p>}

            <div className="form-buttons">
                <button type="submit" className="button" disabled={loading}>
                    {loading ? t("common.saving") : t("profile.savePassword")}
                </button>
                <button
                    type="button"
                    className="button button--cancel"
                    onClick={onCancel}
                >
                    {t("common.cancel")}
                </button>
            </div>
        </form>
    );
}
