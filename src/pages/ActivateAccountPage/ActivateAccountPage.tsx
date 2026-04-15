import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authService } from "../../api/services/auth.service";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export function ActivateAccountPage() {
    // Вытаскиваем параметры из URL (настроим их в роутере на 3 шаге)
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const { t } = useTranslation();

    const [status, setStatus] = useState<"success" | "error">("success");

    // useRef нужен, чтобы в React 18 (Strict Mode) запрос не отправился дважды
    const hasRequested = useRef(false);

    useEffect(() => {
        if (hasRequested.current) return;
        hasRequested.current = true;

        const confirmAccount = async () => {
            try {
                if (!uid || !token) throw new Error("Неверная ссылка");

                console.log(uid, token);

                await authService.confirmEmail(uid, token);
                setStatus("success");
                toast.success("Почта успешно подтверждена!");
            } catch (error) {
                console.error(error);
                setStatus("error");
                toast.error(
                    "Ошибка подтверждения почты. Возможно, ссылка устарела.",
                );
            }
        };

        confirmAccount();
    }, [uid, token]);

    return (
        <div className="reset-container">
            <div className="reset-content">
                {status === "success" && (
                    <>
                        <h2>Отлично!</h2>
                        <p>
                            Ваша почта подтверждена. Теперь вы можете войти в
                            аккаунт.
                        </p>
                        <Link to="/login" className="btn-submit">
                            Войти
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h2>Что-то пошло не так</h2>
                        <p>
                            Ссылка недействительна или срок её действия истёк.
                        </p>
                        <Link to="/register">Зарегистрироваться заново</Link>
                    </>
                )}
            </div>
        </div>
    );
}
