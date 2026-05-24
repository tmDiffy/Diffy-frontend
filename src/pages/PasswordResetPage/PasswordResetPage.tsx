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

    if (submittedEmail) {
        return (
            // 2. ОБРАЩАЕМСЯ К КЛАССАМ ЧЕРЕЗ styles[...]
            <div className={styles["reset-container"]}>
                <div className={styles["reset-content"]}>
                    <h2>Письмо отправлено!</h2>
                    <p>
                        Проверьте вашу почту {submittedEmail}. Мы отправили туда
                        ссылку для сброса пароля.
                    </p>
                    <Link to="/login" className={styles["auth__link"]}>
                        Вернуться к входу
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles["auth__inner"]}>
            <div className={styles["auth__image"]}>
                {/* 3. ИСПРАВЛЕН ПУТЬ К КАРТИНКЕ */}
                <img src="/images/iPhone-17.png" alt="iPhone 17 Pro" />
            </div>
            <div className={styles["auth__form"]}>
                <h1>{t("auth.resetTitle")}</h1>
                <p>{t("auth.resetDescription")}</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        {...register("email")}
                    />
                    {errors.email && (
                        <div className={styles["error-text"]}>
                            {t(errors.email.message as string)}
                        </div>
                    )}

                    {serverError && (
                        <div className={styles["error-message"]}>
                            {serverError}
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "..." : t("auth.resetPassword")}
                    </button>
                    <Link to="/login">{t("auth.returnToSignIn")}</Link>
                </form>
            </div>
        </div>
    );
}
