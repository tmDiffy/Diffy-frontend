import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../api/services/auth.service";
import { toast } from "react-toastify";
import {
    loginSchema,
    type LoginFormValues,
} from "../../utils/validations/auth.schemas";
import styles from "./Login.module.scss";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuth } from "../../context/AuthContext";

export function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { fetchUser } = useCurrentUser();
    const { refreshUser } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        const toastId = toast.loading(t("auth.loading"));

        try {
            const response = await authService.login(data);

            localStorage.setItem("access_token", response.access);
            localStorage.setItem("refresh_token", response.refresh);

            await refreshUser();

            toast.update(toastId, {
                render: t("auth.loginSuccess"),
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });

            navigate("/");
        } catch (error: any) {
            toast.update(toastId, {
                render: t("auth.loginError"),
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            console.error("Ошибка входа:", error.message);
        }
    };

    return (
        <main className={styles.auth}>
            <div className={styles.inner}>
                {/* ... Картинка ... */}
                <div className={styles.image}>
                    <img
                        src="../../../public/images/iPhone-17.png"
                        alt="iPhone 17 Pro"
                    />
                </div>

                <div className={styles.formContainer}>
                    <h1>{t("auth.loginTitle")}</h1>
                    <p>{t("auth.loginSubtitle")}</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
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

                        <div>
                            <input
                                type="password"
                                placeholder={t("auth.passwordPlaceholder")}
                                {...register("password")}
                            />
                            {errors.password && (
                                <span className={styles.errorText}>
                                    {t(errors.password.message as string)}
                                </span>
                            )}
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "..." : t("auth.loginButton")}
                        </button>

                        <Link to="/password_reset">
                            {t("auth.forgotPassword")}
                        </Link>
                    </form>

                    <div className={styles.footer}>
                        <span>{t("auth.noAccount")}</span>
                        <Link to="/register" className={styles.link}>
                            {t("auth.registerLink")}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
