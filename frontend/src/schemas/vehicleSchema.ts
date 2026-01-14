import { z } from "zod";
import { VEHICLE_TYPES } from "@/types/vehicleType";
import { t } from "i18next";
import translationKey from "@/utils/i18n/translationKey";

export const createVehicleValidationSchema = () => {
    return z.object({
        registrationNumber: z
            .string()
            .min(1, t(translationKey.errors.registrationNumberRequired))
            .max(20, t(translationKey.errors.registrationNumberMaxLength))
            .regex(
                /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
                t(translationKey.errors.invalidRegistrationNumber)
            ),
        modelName: z
            .string()
            .min(1, t(translationKey.errors.modelNameRequired))
            .max(50, t(translationKey.errors.modelNameMaxLength)),
        type: z.enum(VEHICLE_TYPES, {
            message: t(translationKey.errors.invalidVehicleType),
        }),
    });
};

export type VehicleFormValues = z.infer<
    ReturnType<typeof createVehicleValidationSchema>
>;
