import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import z from "zod";

const coordinateSchema = z.object({
  latitude: z
    .number({
      message: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING_OR_INVALID,
    })
    .min(-90, {
      message: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING_OR_INVALID,
    })
    .max(90, {
      message: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING_OR_INVALID,
    }),
  longitude: z
    .number({
      message: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING_OR_INVALID,
    })
    .min(-180)
    .max(180),
});

export const calculateFareValidationSchema = z.object({
  pickup: coordinateSchema,
  dropoff: coordinateSchema,
});
