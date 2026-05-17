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
import "./PasswordResetPage.module.scss";

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
            <div className="reset-container">
                <div className="reset-content">
                    <h2>Письмо отправлено!</h2>
                    <p>
                        Проверьте вашу почту {submittedEmail}. Мы отправили туда
                        ссылку для сброса пароля.
                    </p>
                    <Link to="/login" className="auth__link">
                        Вернуться к входу
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth__inner">
            {/* ... Картинка ... */}
            <div className="auth__image">
                <img
                    src="../../../public/images/iPhone-17.png"
                    alt="iPhone 17 Pro"
                />
            </div>
            <div className="auth__form">
                <h1>{t("auth.resetTitle")}</h1>
                <p>{t("auth.resetDescription")}</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        {...register("email")}
                    />
                    {errors.email && (
                        <div className="error-text">
                            {t(errors.email.message as string)}
                        </div>
                    )}

                    {serverError && (
                        <div className="error-message">{serverError}</div>
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
