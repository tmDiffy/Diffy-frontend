import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../api/services/auth.service";
import googleIcon from "../../assets/icons/Google.svg";
import {
    registerSchema,
    type RegisterFormValues,
} from "../../utils/validations/auth.schemas.ts";
import styles from "./Register.module.scss"; // Импортируем стили как модуль

export function Register() {
    const { t } = useTranslation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState("");
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError("");

        try {
            await authService.register(data.name, data.email, data.password);
            setSubmittedEmail(data.email);
            setIsSuccess(true);
        } catch (error: any) {
            const errorMessage = error.message || t("auth.checkData");
            setServerError(`${t("auth.registerError")} ${errorMessage}`);
        }
    };

    if (isSuccess) {
        return (
            <main className={styles.resetContainer}>
                <div className={styles.resetContent}>
                    <h2>Письмо отправлено!</h2>
                    <p>
                        Проверьте вашу почту {submittedEmail}. Мы отправили туда
                        ссылку.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.reg}>
            <div className={styles.inner}>
                <div className={styles.image}>
                    <img
                        src="../../../public/images/iPhone-17.png"
                        alt="iPhone 17 Pro"
                    />
                </div>
                <div className={styles.formContainer}>
                    <h1>{t("auth.registerTitle")}</h1>
                    <p className={styles.subtitle}>
                        {t("auth.registerSubtitle")}
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">{t("auth.nameLabel")}</label>
                            <input
                                id="name"
                                type="text"
                                {...register("name")}
                            />
                            {errors.name && (
                                <span className={styles.errorText}>
                                    {t(errors.name.message as string)}
                                </span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                {t("auth.emailLabel")}
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <span className={styles.errorText}>
                                    {t(errors.email.message as string)}
                                </span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                {t("auth.passwordLabel")}
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <span className={styles.errorText}>
                                    {t(errors.password.message as string)}
                                </span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="passwordRepeat">
                                {t("auth.passwordRepeatLabel")}
                            </label>
                            <input
                                id="passwordRepeat"
                                type="password"
                                {...register("passwordRepeat")}
                            />
                            {errors.passwordRepeat && (
                                <span className={styles.errorText}>
                                    {t(errors.passwordRepeat.message as string)}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles.btnSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Загрузка..."
                                : t("auth.createAccountButton")}
                        </button>

                        <button type="button" className={styles.btnGoogle}>
                            <img
                                src={googleIcon}
                                alt="Google"
                                className={styles.googleIcon}
                            />
                            {t("auth.googleButton")}
                        </button>
                    </form>

                    {serverError && (
                        <div className={styles.errorMessage}>{serverError}</div>
                    )}

                    <div className={styles.footer}>
                        <span>{t("auth.alreadyHaveAccount")}</span>
                        <Link to="/login" className={styles.link}>
                            {t("auth.loginLink")}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
