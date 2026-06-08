import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authService } from "../../api/services/auth.service";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styles from "./ActivateAccountPage.module.scss"; // Импортируем стили как объект styles

export function ActivateAccountPage() {
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const { t } = useTranslation();

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading",
    );

    const hasRequested = useRef(false);

    useEffect(() => {
        if (hasRequested.current) return;
        hasRequested.current = true;

        const confirmAccount = async () => {
            try {
                if (!uid || !token) throw new Error("Неверная ссылка");

                await authService.confirmEmail(uid, token);
                setStatus("success");
                toast.success(
                    t("auth.activationSuccess") ||
                        "Почта успешно подтверждена!",
                );
            } catch (error) {
                console.error(error);
                setStatus("error");
                toast.error(
                    t("auth.activationError") ||
                        "Ошибка подтверждения почты. Возможно, ссылка устарела.",
                );
            }
        };

        confirmAccount();
    }, [uid, token, t]);

    return (
        <main className={styles.container}>
            {status === "loading" && (
                <div>
                    <div className={styles.loader}></div>
                    <p className={styles.message}>
                        {t("auth.activationLoading") || "Проверяем данные..."}
                    </p>
                </div>
            )}

            {status === "success" && (
                <>
                    <p className={styles.message}>
                        {t("auth.activationSuccessText") ||
                            "Ваша почта подтверждена. Теперь вы можете войти в аккаунт."}
                    </p>
                    <Link to="/login" className={styles.homeBtn}>
                        {t("auth.loginButton") || "Войти"}
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <h1 className={`${styles.title} ${styles.errorTitle}`}>
                        ✕
                    </h1>
                    <p className={styles.message}>
                        {t("auth.activationErrorText") ||
                            "Ссылка недействительна или срок её действия истёк."}
                    </p>
                    <Link to="/register" className={styles.homeBtn}>
                        {t("auth.registerLink") || "Зарегистрироваться заново"}
                    </Link>
                </>
            )}
        </main>
    );
}
