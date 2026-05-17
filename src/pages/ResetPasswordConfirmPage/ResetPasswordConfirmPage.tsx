import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../api/services/auth.service";
import {
    resetPasswordConfirmSchema,
    type ResetPasswordConfirmFormValues,
} from "../../utils/validations/auth.schemas";

export function ResetPasswordConfirmPage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordConfirmFormValues>({
        resolver: zodResolver(resetPasswordConfirmSchema),
    });

    const onSubmit = async (data: ResetPasswordConfirmFormValues) => {
        setServerError("");

        if (!uid || !token) {
            setServerError("Некорректная ссылка восстановления.");
            return;
        }

        try {
            await authService.resetPasswordConfirm(
                uid,
                token,
                data.newPassword,
            );
            alert("Пароль успешно изменен!");
            navigate("/login");
        } catch (err: any) {
            setServerError(
                err.response?.data?.new_password?.[0] ||
                    "Ошибка при смене пароля. Возможно, ссылка устарела.",
            );
            console.error(err);
        }
    };

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
                <h2>Придумайте новый пароль</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            type="password"
                            placeholder="Новый пароль"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && (
                            <p className="error-text" style={{ color: "red" }}>
                                {errors.newPassword.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Повторите пароль"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="error-text" style={{ color: "red" }}>
                                {errors.confirmPassword.message as string}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <p className="error-text" style={{ color: "red" }}>
                            {serverError}
                        </p>
                    )}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Сохранение..." : "Сохранить пароль"}
                    </button>
                </form>
            </div>
        </div>
    );
}
