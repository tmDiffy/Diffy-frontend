import { useTranslation } from "react-i18next";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../api/services/auth.service";
import { toast } from "react-toastify";
import {
    profileSchema,
    type ProfileFormValues,
} from "../../utils/validations/auth.schemas";

// 1. Правильный импорт
import styles from "./ProfilePage.module.scss";

export function ProfilePage() {
    const { user, logout } = useCurrentUser();
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username || "",
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
        },
    });

    useEffect(() => {
        if (user?.username) {
            reset({
                username: user.username,
                oldPassword: "",
                newPassword: "",
                newPasswordConfirm: "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        if (!isDirty) return;

        let isSuccess = false;

        try {
            if (data.username && data.username !== user?.username) {
                await authService.changeUsername(data.username);
                toast.success(t("profile.usernameChanged"));
                isSuccess = true;
            }

            if (data.newPassword && data.oldPassword) {
                await authService.changePassword(
                    data.oldPassword,
                    data.newPassword,
                );
                toast.success(t("profile.passwordChanged"));
                isSuccess = true;

                reset({
                    ...data,
                    oldPassword: "",
                    newPassword: "",
                    newPasswordConfirm: "",
                });
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage =
                error.response?.data?.message || t("profile.errorOccurred");
            toast.error(errorMessage);
        }
    };

    const confirmDelete = async () => {
        try {
            await authService.deleteProfile();
            toast.success(t("profile.accountDeleted"));
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
        <div className={styles.profileBlock}>
            <div className={styles.userAvatar}>
                <p className={styles.avatarText}>
                    {user?.username?.[0]?.toUpperCase() || "U"}
                </p>
            </div>
            <p className={styles.userName}>{user?.username}</p>
            <p className={styles.userEmail}>{user?.email}</p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.profileChange}
            >
                <p className={styles.accountInfo}>{t("profile.accountInfo")}</p>
                <hr className={styles.line} />

                {/* Используем универсальный fieldLabel */}
                <p className={styles.fieldLabel}>{t("profile.username")}</p>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder={t("profile.enterUsername")}
                    {...register("username")}
                />
                {errors.username && (
                    <span className={styles.errorText}>
                        {t(errors.username.message as string)}
                    </span>
                )}
                <hr className={styles.line} />

                <p className={styles.fieldLabel}>{t("profile.oldPassword")}</p>
                <input
                    type="password"
                    className={styles.inputField}
                    placeholder={t("profile.enterOldPassword")}
                    {...register("oldPassword")}
                />
                {errors.oldPassword && (
                    <span className={styles.errorText}>
                        {t(errors.oldPassword.message as string)}
                    </span>
                )}

                <p className={styles.fieldLabel}>{t("profile.newPassword")}</p>
                <input
                    type="password"
                    className={styles.inputField}
                    placeholder={t("profile.enterNewPassword")}
                    {...register("newPassword")}
                />
                {errors.newPassword && (
                    <span className={styles.errorText}>
                        {t(errors.newPassword.message as string)}
                    </span>
                )}

                <p className={styles.fieldLabel}>
                    {t("profile.newPasswordConfirm")}
                </p>
                <input
                    type="password"
                    className={styles.inputField}
                    placeholder={t("profile.enterNewPasswordConfirm")}
                    {...register("newPasswordConfirm")}
                />
                {errors.newPasswordConfirm && (
                    <span className={styles.errorText}>
                        {t(errors.newPasswordConfirm.message as string)}
                    </span>
                )}

                <div className={styles.profileActions}>
                    <button
                        type="submit"
                        className={styles.btnSave}
                        disabled={!isDirty || isSubmitting}
                    >
                        {isSubmitting ? "..." : t("profile.save")}
                    </button>

                    <button
                        type="button"
                        className={styles.btnDanger}
                        onClick={() => setShowDeleteModal(true)}
                    >
                        {t("profile.deleteAccount")}
                    </button>
                </div>
            </form>

            {/* Модальное окно */}
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>{t("profile.deleteConfirmTitle")}</h3>
                        <p>{t("profile.deleteConfirmText")}</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.btnCancel}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                {t("profile.cancel")}
                            </button>
                            <button
                                className={styles.btnDanger}
                                onClick={confirmDelete}
                            >
                                {t("profile.yesDelete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
