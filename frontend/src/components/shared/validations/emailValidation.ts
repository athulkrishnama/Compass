import translationKey from "@/utils/i18n/translationKey";
import i18next from "i18next";
import z from "zod";

export const emailValidationSchema = z.email({
    error: i18next.t(translationKey.errors.invalidEmail),
});
