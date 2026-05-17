import { t } from "i18next";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "auth.emptyEmail").email("auth.invalidEmail"),
    password: z.string().min(1, "auth.emptyPassword"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const passwordResetSchema = z.object({
    email: z.string().min(1, "auth.emptyEmail").email("auth.invalidEmail"),
});
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export const resetPasswordConfirmSchema = z
    .object({
        newPassword: z.string().min(8, "auth.passwordTooShort"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: t("auth.passwordsDoNotMatch"),
        path: ["confirmPassword"],
    });
export type ResetPasswordConfirmFormValues = z.infer<
    typeof resetPasswordConfirmSchema
>;

export const profileSchema = z
    .object({
        username: z
            .string()
            .min(1, "profile.emptyUsername")
            .optional()
            .or(z.literal("")),
        oldPassword: z.string().optional().or(z.literal("")),
        newPassword: z.string().optional().or(z.literal("")),
        newPasswordConfirm: z.string().optional().or(z.literal("")),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword && data.newPassword.length > 0) {
            if (data.newPassword.length < 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "auth.passwordTooShort",
                    path: ["newPassword"],
                });
            }
            if (!data.oldPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "profile.enterOldPassword",
                    path: ["oldPassword"],
                });
            }
            if (data.newPassword !== data.newPasswordConfirm) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "profile.passwordMatchingError",
                    path: ["newPasswordConfirm"],
                });
            }
        }
    });
export type ProfileFormValues = z.infer<typeof profileSchema>;

export const registerSchema = z
    .object({
        name: z.string().min(1, "auth.emptyName"),
        email: z.string().email("auth.invalidEmail"),
        password: z.string().min(8, "auth.passwordTooShort"),
        passwordRepeat: z.string(),
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: "auth.passwordsDoNotMatch",
        path: ["passwordRepeat"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
