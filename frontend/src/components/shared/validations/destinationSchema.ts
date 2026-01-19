import { z } from "zod";
import { t } from "i18next";
import translationKey from "@/utils/i18n/translationKey";
import { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";
import { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import { MONTH } from "@/constants/destinationConstants/months";
import { WEEKDAY } from "@/constants/destinationConstants/weekdays";

const destinationTypes = Object.values(DESTINATION_TYPES) as [
    string,
    ...string[],
];
const activityTypes = Object.values(ACTIVITY_TYPE) as [string, ...string[]];
const months = Object.values(MONTH) as [string, ...string[]];
const weekdays = Object.values(WEEKDAY) as [string, ...string[]];

export const createDestinationValidationSchema = () => {
    return z
        .object({
            name: z
                .string()
                .min(3, t(translationKey.errors.destinationNameMinLength))
                .max(100, t(translationKey.errors.destinationNameMaxLength)),
            tagline: z
                .string()
                .min(1, t(translationKey.errors.taglineRequired))
                .max(150, t(translationKey.errors.taglineMaxLength)),
            description: z
                .string()
                .min(10, t(translationKey.errors.descriptionMinLength))
                .max(5000, t(translationKey.errors.descriptionMaxLength)),
            country: z
                .string()
                .min(1, t(translationKey.errors.countryRequired)),
            city: z.string().min(1, t(translationKey.errors.cityRequired)),
            pincode: z
                .string()
                .min(1, t(translationKey.errors.pincodeRequired)),
            latitude: z.number({
                message: t(translationKey.errors.coordinatesRequired),
            }),
            longitude: z.number({
                message: t(translationKey.errors.coordinatesRequired),
            }),
            destinationType: z.enum(destinationTypes, {
                message: t(translationKey.errors.destinationTypeRequired),
            }),
            activities: z.array(z.enum(activityTypes)).optional(),
            bestMonths: z.array(z.enum(months)).optional(),
            isAlwaysOpen: z.boolean().default(false),
            openingTime: z.string().optional(),
            closingTime: z.string().optional(),
            closedDays: z.array(z.enum(weekdays)).optional(),
            wheelchairAccessible: z.boolean().default(false),
            isFree: z.boolean().default(true),
            entryFeeAmount: z.number().min(0).optional(),
        })
        .refine(
            (data) => {
                if (
                    !data.isAlwaysOpen &&
                    data.openingTime &&
                    data.closingTime
                ) {
                    const today = new Date().toISOString().split("T")[0];
                    const openTime = new Date(
                        `${today} ${data.openingTime}`
                    ).getTime();
                    const closeTime = new Date(
                        `${today} ${data.closingTime}`
                    ).getTime();
                    return closeTime > openTime;
                }
                return true;
            },
            {
                message: t(translationKey.errors.closingTimeAfterOpeningTime),
                path: ["closingTime"],
            }
        );
};

export type DestinationFormValues = z.infer<
    ReturnType<typeof createDestinationValidationSchema>
>;

import type { UseFormReturn } from "react-hook-form";
export type DestinationFormType = UseFormReturn<DestinationFormValues>;
