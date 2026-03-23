import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../api/services/auth.service"; // Наш сервис
import "./Login.css";

export function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (email === "") {
            setError(t("auth.emptyEmail"));
            return;
        }
        if (!email.includes("@")) {
            setError(t("auth.invalidEmail"));
            return;
        }
        if (password === "") {
            setError(t("auth.emptyPassword"));
            return;
        }

        try {
            // 1. Вызываем метод сервиса
            const data = await authService.login({ email, password });

            // 2. Сохраняем токены (структура data зависит от того, что вернет apiClient)
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            console.log(t("auth.loginSuccess"));

            // 3. Перенаправляем пользователя
            navigate("/");

            // Перезагрузка нужна, если Header не умеет подхватывать изменения localStorage автоматически
            window.location.reload();
        } catch (error: any) {
            // Ошибка уже обработана в apiClient, здесь мы просто выводим уведомление
            console.error("Ошибка входа:", error.message);
            setError(t("auth.loginError"));
        }
    };

    return (
        <main className="auth">
            <div className="auth__inner">
                <div className="auth__image">
                    {/* Убедись, что путь к картинке верный, обычно в Vite это /src/assets/... */}
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

                        <Link to="/">{t("auth.forgotPassword")}</Link>
                    </form>

                    {error && <div className="error-message">{error}</div>}

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
