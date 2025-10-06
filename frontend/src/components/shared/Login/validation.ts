import translationKey from "@/utils/i18n/translationKey";
import i18next from "i18next";
import z from "zod";

export const loginValidationSchema = z.object({
    email: z.email({ error: i18next.t(translationKey.errors.invalidEmail) }),
    password: z
        .string()
        .min(1, { error: i18next.t(translationKey.errors.passwordRequired) })
        .min(8, {
            error: i18next.t(translationKey.errors.minChar, { count: 8 }),
        })
        .max(16, {
            error: i18next.t(translationKey.errors.maxChar, { count: 16 }),
        }),
});
