import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { VEHICLE_TYPES } from "@domain/types/vehicleType";
import z from "zod";

export const createRideValidationSchema = z.object({
  userId: z.string({
    error: INTERNAL_ERROR_MESSAGES.INVALID_ID,
  }),
  fareId: z.string({
    error: INTERNAL_ERROR_MESSAGES.INVALID_ID,
  }),
  vehicleType: z.enum(VEHICLE_TYPES, {
    error: INTERNAL_ERROR_MESSAGES.INVALID_CAB_TYPE,
  }),
});
