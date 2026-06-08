import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../api/services/auth.service";
import {
    passwordResetSchema,
    type PasswordResetFormValues,
} from "../../utils/validations/auth.schemas";

import styles from "./PasswordResetPage.module.scss";

export function PasswordResetPage() {
    const { t } = useTranslation();
    const [serverError, setServerError] = useState("");
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordResetFormValues>({
        resolver: zodResolver(passwordResetSchema),
    });

    const onSubmit = async (data: PasswordResetFormValues) => {
        setServerError("");
        try {
            await authService.resetPassword(data.email);
            setSubmittedEmail(data.email);
        } catch (err) {
            setServerError(t("auth.resetError"));
        }
    };

    return (
        <main className={styles.auth}>
            <div className={styles.inner}>
                {/* Левая часть с картинкой (как в логине) */}
                <div className={styles.image}>
                    <img src="/images/iPhone-17.png" alt="iPhone 17 Pro" />
                </div>

                {/* Правая часть с контентом */}
                <div className={styles.formContainer}>
                    {submittedEmail ? (
                        /* Экран успешной отправки внутри той же формы */
                        <div className={styles.successState}>
                            <h2>{t("auth.mailSuccess")}</h2>
                            <p>
                                {t("auth.checkMail1")}{" "}
                                <strong>{submittedEmail}</strong>
                                {t("auth.checkMail2")}
                            </p>
                            <Link to="/login" className={styles.submitBtn}>
                                {t("auth.returnToSignIn")}
                            </Link>
                        </div>
                    ) : (
                        /* Форма ввода email */
                        <>
                            <h1>{t("auth.resetTitle")}</h1>
                            <p>{t("auth.resetDescription")}</p>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Обертка как в логине, чтобы зафиксировать высоту под ошибку */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder={t("auth.emailPlaceholder")}
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <span className={styles.errorText}>
                                            {t(errors.email.message as string)}
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
                                        : t("auth.resetPassword")}
                                </button>

                                <Link to="/login">
                                    {t("auth.returnToSignIn")}
                                </Link>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
