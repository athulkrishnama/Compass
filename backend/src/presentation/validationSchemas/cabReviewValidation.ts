import { z } from "zod";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

export const createCabReviewValidationSchema = z.object({
  rideId: z.string().min(1, INTERNAL_ERROR_MESSAGES.RIDE_ID_REQUIRED),
  rating: z
    .number()
    .min(1, INTERNAL_ERROR_MESSAGES.RATING_MIN)
    .max(5, INTERNAL_ERROR_MESSAGES.RATING_MAX),
  review: z
    .string()
    .min(10, INTERNAL_ERROR_MESSAGES.REVIEW_MIN)
    .max(500, INTERNAL_ERROR_MESSAGES.REVIEW_MAX),
});

export type ICreateCabReviewRequest = z.infer<
  typeof createCabReviewValidationSchema
>;
