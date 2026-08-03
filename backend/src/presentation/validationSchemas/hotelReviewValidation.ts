import { z } from "zod";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

const aspectRatingSchema = z
  .number()
  .min(1, INTERNAL_ERROR_MESSAGES.RATING_MIN)
  .max(5, INTERNAL_ERROR_MESSAGES.RATING_MAX)
  .optional();

export const createHotelReviewValidationSchema = z
  .object({
    bookingId: z.string().min(1, INTERNAL_ERROR_MESSAGES.BOOKING_ID_REQUIRED),
    ratings: z.object({
      hospitality: aspectRatingSchema,
      staffFriendliness: aspectRatingSchema,
      cleanliness: aspectRatingSchema,
      comfort: aspectRatingSchema,
      roomQuality: aspectRatingSchema,
      safety: aspectRatingSchema,
    }),
    comment: z.string().max(500, INTERNAL_ERROR_MESSAGES.REVIEW_MAX).optional(),
  })
  .refine(
    (data) => {
      const values = Object.values(data.ratings);
      return values.some((v) => v !== undefined);
    },
    {
      message: "At least one aspect rating must be provided",
      path: ["ratings"],
    },
  );

export type ICreateHotelReviewRequest = z.infer<
  typeof createHotelReviewValidationSchema
>;

export const getHotelReviewsQueryValidationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
  minRating: z.coerce.number().min(1).max(5).optional(),
  maxRating: z.coerce.number().min(1).max(5).optional(),
  hotelId: z.string().optional(),
  reviewerId: z.string().optional(),
  search: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});
