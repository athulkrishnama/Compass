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

export const rideReportQuerySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  dateTo: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  pageNo: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export const rideReportPdfQuerySchema = rideReportQuerySchema.omit({
  pageNo: true,
  limit: true,
});
