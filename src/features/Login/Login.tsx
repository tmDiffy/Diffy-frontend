import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../api/services/auth.service";
import { toast } from "react-toastify";
import "./Login.module.scss";

export function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === "") {
            toast.warning(t("auth.emptyEmail"));
            return;
        }
        if (!email.includes("@")) {
            toast.warning(t("auth.invalidEmail"));
            return;
        }
        if (password === "") {
            toast.warning(t("auth.emptyPassword"));
            return;
        }

        const toastId = toast.loading(t("auth.loading"));

        try {
            const data = await authService.login({ email, password });

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            toast.update(toastId, {
                render: t("auth.loginSuccess"),
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });

            navigate("/");

            setTimeout(() => {
                window.location.reload();
            }, 1000);
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
        <main className="auth">
            <div className="auth__inner">
                <div className="auth__image">
                    <img
                        src="../../../public/images/iPhone-17.png"
                        alt="iPhone 17 Pro"
                    />
                </div>
                <div className="auth__form">
                    <h1>{t("auth.loginTitle")}</h1>
                    <p>{t("auth.loginSubtitle")}</p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder={t("auth.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder={t("auth.passwordPlaceholder")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit">{t("auth.loginButton")}</button>

                        <Link to="/password_reset">
                            {t("auth.forgotPassword")}
                        </Link>
                    </form>

                    <div className="auth__footer">
                        <span>{t("auth.noAccount")}</span>
                        <Link to="/register" className="auth__link">
                            {t("auth.registerLink")}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
