import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../../api/services/auth.service";

export function ResetPasswordConfirmPage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Пароли не совпадают!");
            return;
        }

        if (!uid || !token) {
            setError("Некорректная ссылка восстановления.");
            return;
        }

        try {
            console.log(uid, token, newPassword);
            await authService.resetPasswordConfirm(uid, token, newPassword);

            alert("Пароль успешно изменен!");
            navigate("/login");
        } catch (err: any) {
            setError(
                err.response?.data?.new_password?.[0] ||
                    "Ошибка при смене пароля. Возможно, ссылка устарела.",
            );
            console.error(err);
        }
    };

    return (
        <div className="auth__inner">
            <div className="auth__image">
                <img
                    src="../../../public/images/iPhone-17.png"
                    alt="iPhone 17 Pro"
                />
            </div>
            <div className="auth__form">
                <h2>Придумайте новый пароль</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Повторите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <p className="error-text" style={{ color: "red" }}>
                            {error}
                        </p>
                    )}
                    <button type="submit">Сохранить пароль</button>
                </form>
            </div>
        </div>
    );
}
