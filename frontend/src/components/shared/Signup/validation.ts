import translationKey from "@/utils/i18n/translationKey";
import i18next from "i18next";
import z from "zod";

export const signupValidationSchema = z
    .object({
        full_name: z
            .string()
            .min(4, {
                error: i18next.t(translationKey.errors.minChar, { count: 4 }),
            })
            .max(20, {
                error: i18next.t(translationKey.errors.maxChar, { count: 20 }),
            })
            .regex(/^[a-zA-Z]+$/, {
                error: translationKey.errors.noSpecial,
            }),
        email: z.email({
            error: i18next.t(translationKey.errors.invalidEmail),
        }),
        password: z
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
        confirmPassword: z.string().min(1, {
            error: i18next.t(translationKey.errors.confirmPasswordRequired),
        }),
    })
    .refine((values) => values.password === values.confirmPassword, {
        error: i18next.t(
            translationKey.errors.passwordAndCofirmPasswordNotMatching
        ),
        path: ["confirmPassword"],
    });
