import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { authService } from "../../api/services/auth.service";
import {
    resetPasswordConfirmSchema,
    type ResetPasswordConfirmFormValues,
} from "../../utils/validations/auth.schemas";
import styles from "./ResetPasswordConfirmPage.module.scss";

export function ResetPasswordConfirmPage() {
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordConfirmFormValues>({
        resolver: zodResolver(resetPasswordConfirmSchema),
    });

    const onSubmit = async (data: ResetPasswordConfirmFormValues) => {
        setServerError("");

        if (!uid || !token) {
            setServerError(
                t("auth.invalidResetLink") ||
                    "Некорректная ссылка восстановления.",
            );
            return;
        }

        const toastId = toast.loading(
            t("auth.passwordLoading") || "Сохранение...",
        );

        try {
            await authService.resetPasswordConfirm(
                uid,
                token,
                data.newPassword,
            );

            toast.update(toastId, {
                render:
                    t("auth.passwordResetSuccess") || "Пароль успешно изменен!",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });

            navigate("/login");
        } catch (err: any) {
            toast.dismiss(toastId); // Убираем лоадер, если прилетела ошибка

            setServerError(
                err.response?.data?.new_password?.[0] ||
                    t("auth.passwordResetError") ||
                    "Ошибка при смене пароля. Возможно, ссылка устарела.",
            );
            console.error(err);
        }
    };

    return (
        <main className={styles.auth}>
            <div className={styles.inner}>
                {/* Левая панель с картинкой */}
                <div className={styles.image}>
                    <img src="/images/iPhone-17.png" alt="iPhone 17 Pro" />
                </div>

                {/* Правая панель с формой */}
                <div className={styles.formContainer}>
                    <h1>{t("auth.newPasswordTitle") || "Новый пароль"}</h1>
                    <p>
                        {t("auth.newPasswordSubtitle") ||
                            "Придумайте новый пароль для вашего аккаунта"}
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Обертка фиксирует высоту в 85px, предотвращая скачки вёрстки */}
                        <div>
                            <input
                                type="password"
                                placeholder={
                                    t("auth.newPasswordPlaceholder") ||
                                    "Новый пароль"
                                }
                                {...register("newPassword")}
                            />
                            {errors.newPassword && (
                                <span className={styles.errorText}>
                                    {t(errors.newPassword.message as string)}
                                </span>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder={
                                    t("auth.confirmPasswordPlaceholder") ||
                                    "Повторите пароль"
                                }
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <span className={styles.errorText}>
                                    {t(
                                        errors.confirmPassword
                                            .message as string,
                                    )}
                                </span>
                            )}
                        </div>

                        {serverError && (
                            <div className={styles.serverError}>
                                {serverError}
                            </div>
                        )}

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "..."
                                : t("auth.savePasswordButton") ||
                                  "Сохранить пароль"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
