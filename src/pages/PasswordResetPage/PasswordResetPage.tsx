import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../api/services/auth.service";
import "./PasswordResetPage.module.scss";

export function PasswordResetPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await authService.resetPassword(email);
            setIsSubmitted(true);
        } catch (err) {
            setError(t("auth.resetError"));
        }
    };

    if (isSubmitted) {
        return (
            <div className="reset-container">
                <div className="reset-content">
                    <h2>Письмо отправлено!</h2>
                    <p>
                        Проверьте вашу почту {email}. Мы отправили туда ссылку
                        для сброса пароля.
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
            <div className="auth__image">
                <img
                    src="../../../public/images/iPhone-17.png"
                    alt="iPhone 17 Pro"
                />
            </div>
            <div className="auth__form">
                <h1>{t("auth.resetTitle")}</h1>
                <p>{t("auth.resetDescription")}</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit">{t("auth.resetPassword")}</button>
                    <Link to="/login">{t("auth.returnToSignIn")}</Link>
                </form>
            </div>
        </div>
    );
}
