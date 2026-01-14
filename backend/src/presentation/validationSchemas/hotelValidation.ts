import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import z from "zod";

export const createHotelValidation = z.object({
  userId: z.string({
    error: INTERNAL_ERROR_MESSAGES.USER_ID_MISSING_OR_INVALID,
  }),
  name: z.string({ error: INTERNAL_ERROR_MESSAGES.NAME_MISSING_OR_INVALID }),
  description: z.string({
    error: INTERNAL_ERROR_MESSAGES.DESCRIPTION_MISSING_OR_INVALID,
  }),
  images: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.array(
      z
        .file({ error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID })
        .min(1, { error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID })
        .mime(["image/jpeg", "image/png", "image/webp"], {
          error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
        }),
    ),
  ),
  coverImage: z
    .file({ error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID })
    .mime(["image/jpeg", "image/png", "image/webp"], {
      error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
    }),
  country: z.string({
    error: INTERNAL_ERROR_MESSAGES.COUNTRY_MISSING_OR_INVALID,
  }),
  city: z.string({ error: INTERNAL_ERROR_MESSAGES.CITY_MISSING_OR_INVALID }),
  landMark: z.string({
    error: INTERNAL_ERROR_MESSAGES.LANDMARK_MISSING_OR_INVALID,
  }),
  pinCode: z.string({
    error: INTERNAL_ERROR_MESSAGES.PINCODE_MISSING_OR_INVALID,
  }),
  coordinates: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.array(z.number(), {
      error: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING_OR_INVALID,
    }),
  ),
});
