import { z } from "zod";
import i18next from "i18next";
import translationKey from "@/utils/i18n/translationKey";

export const createProfileValidationSchema = () => {
    return z.object({
        full_name: z
            .string()
            .min(1, i18next.t(translationKey.errors.fullnameRequired))
            .max(30, i18next.t(translationKey.errors.fullnameMaxLength)),
        mobile: z
            .string()
            .regex(/^\d{10}$/, {
                message: i18next.t(translationKey.errors.invalidMobileNumber),
            })
            .optional()
            .or(z.literal("")),
        date_of_birth: z
            .string()
            .refine(
                (date) => {
                    if (!date) return true; // Optional field
                    const selectedDate = new Date(date);
                    const today = new Date();
                    return selectedDate < today;
                },
                {
                    message: i18next.t(
                        translationKey.errors.dateOfBirthMustBePast
                    ),
                }
            )
            .refine(
                (date) => {
                    if (!date) return true; // Optional field
                    const selectedDate = new Date(date);
                    const ageInMs = Date.now() - selectedDate.getTime();
                    const age = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
                    return age >= 15;
                },
                {
                    message: i18next.t(
                        translationKey.errors.minimumAgeRequired
                    ),
                }
            )
            .optional(),
    });
};

export type ProfileFormValues = z.infer<
    ReturnType<typeof createProfileValidationSchema>
>;
