import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../api/services/auth.service";
import googleIcon from "../../assets/icons/Google.svg";
import "./Register.css";

export function Register() {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        if (name === "") {
            setError(t("auth.emptyName"));
            return;
        }
        if (!email.includes("@")) {
            setError(t("auth.invalidEmail"));
            return;
        }
        if (password !== passwordRepeat) {
            setError(t("auth.passwordsDoNotMatch"));
            return;
        }
        if (password.length < 6) {
            setError(t("auth.passwordTooShort"));
            return;
        }

        try {
            // Используем сервис. Ключи объекта должны совпадать с ожиданиями бэкенда
            await authService.register({
                username: name,
                email: email,
                password: password,
            });

            console.log(t("auth.registerSuccess"));
            navigate("/login");
        } catch (error: any) {
            // Наш apiClient уже прокинул текст ошибки в error.message
            const errorMessage = error.message || t("auth.checkData");
            console.error(`${t("auth.registerError")} ${errorMessage}`);
            setError(`${t("auth.registerError")} ${errorMessage}`);
        }
    }

    return (
        <main className="reg">
            <div className="reg__inner">
                <div className="reg__image">
                    <img
                        src="../../../public/images/iPhone-17.png"
                        alt="iPhone 17 Pro"
                    />
                </div>
                <div className="reg__form">
                    <h1>{t("auth.registerTitle")}</h1>
                    <p className="reg-subtitle">{t("auth.registerSubtitle")}</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form__group">
                            <label htmlFor="name">{t("auth.nameLabel")}</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form__group">
                            <label htmlFor="email">
                                {t("auth.emailLabel")}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form__group">
                            <label htmlFor="password">
                                {t("auth.passwordLabel")}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form__group">
                            <label htmlFor="password_repeat">
                                {t("auth.passwordRepeatLabel")}
                            </label>
                            <input
                                id="password_repeat"
                                type="password"
                                value={passwordRepeat}
                                onChange={(e) =>
                                    setPasswordRepeat(e.target.value)
                                }
                            />
                        </div>

                        <button type="submit" className="btn-submit">
                            {t("auth.createAccountButton")}
                        </button>

                        <button type="button" className="btn-google">
                            <img
                                src={googleIcon}
                                alt="Google"
                                className="google-icon"
                            />
                            {t("auth.googleButton")}
                        </button>
                    </form>
                    {error && <div className="error-message">{error}</div>}

                    <div className="reg__footer">
                        <span>{t("auth.alreadyHaveAccount")}</span>
                        <Link to="/login" className="reg__link">
                            {t("auth.loginLink")}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
