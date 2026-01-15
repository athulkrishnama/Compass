import { z } from "zod";
import { t } from "i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { UseFormReturn } from "react-hook-form";

export const createHotelValidationSchema = () => {
    return z.object({
        name: z
            .string()
            .min(3, t(translationKey.errors.hotelNameMinLength))
            .max(100, t(translationKey.errors.hotelNameMaxLength)),
        description: z
            .string()
            .min(10, t(translationKey.errors.descriptionMinLength))
            .max(5000, t(translationKey.errors.descriptionMaxLength)),
        country: z.string().min(1, t(translationKey.errors.countryRequired)),
        city: z.string().min(1, t(translationKey.errors.cityRequired)),
        landMark: z.string().min(1, t(translationKey.errors.landmarkRequired)),
        pinCode: z.string().min(1, t(translationKey.errors.pincodeRequired)),
        latitude: z.number({
            message: t(translationKey.errors.coordinatesRequired),
        }),
        longitude: z.number({
            message: t(translationKey.errors.coordinatesRequired),
        }),
    });
};

export type HotelFormValues = z.infer<
    ReturnType<typeof createHotelValidationSchema>
>;

export type HotelFormType = UseFormReturn<HotelFormValues>;
