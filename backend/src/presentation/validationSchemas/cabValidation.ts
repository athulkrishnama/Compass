import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { VEHICLE_TYPES } from "@domain/types/vehicleType";
import z from "zod";

export const updateVehicleValidationSchema = z.object({
  userId: z.string({ error: INTERNAL_ERROR_MESSAGES.INVALID_ID }),
  model: z.string().optional(),
  type: z
    .enum(VEHICLE_TYPES, { error: INTERNAL_ERROR_MESSAGES.INVALID_CAB_TYPE })
    .optional(),
  registrationNumber: z.string().optional(),
  images: z
    .array(
      z.file().max(1024 * 1024 * 2, {
        message: INTERNAL_ERROR_MESSAGES.FILE_TOO_LARGE,
      }),
    )
    .optional(),
});
