import translationKey from "@/utils/i18n/translationKey";
import i18next from "i18next";
import z from "zod";

export const resetPasswordValidation = z
    .object({
        newPassword: z
            .string()
            .min(1, {
                error: i18next.t(translationKey.errors.passwordRequired),
            })
            .min(8, {
                error: i18next.t(translationKey.errors.minChar, { count: 8 }),
            })
            .max(16, {
                error: i18next.t(translationKey.errors.maxChar, { count: 16 }),
            })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                { error: i18next.t(translationKey.errors.invalidPassword) }
            ),
        confirmPassword: z.string({
            error: i18next.t(translationKey.errors.confirmPasswordRequired),
        }),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        error: i18next.t(
            translationKey.errors.passwordAndCofirmPasswordNotMatching
        ),
        path: ["confirmPassword"],
    });
