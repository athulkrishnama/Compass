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
        .min(5, { error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID })
        .mime(["image/jpeg", "image/png", "image/webp"], {
          error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
        }),
    ),
  ),
  coverImage: z
    .file({
      error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID,
    })
    .mime(["image/jpeg", "image/png", "image/webp", "image/svg+xml"], {
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
    z.tuple([z.number(), z.number()], {
      error: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING_OR_INVALID,
    }),
  ),
});

export const editHotelValidationSchema = z.object({
  id: z.string({
    error: INTERNAL_ERROR_MESSAGES.ID_MISSING,
  }),
  userId: z.string({
    error: INTERNAL_ERROR_MESSAGES.USER_ID_MISSING_OR_INVALID,
  }),
  name: z
    .string({ error: INTERNAL_ERROR_MESSAGES.NAME_MISSING_OR_INVALID })
    .optional(),
  description: z
    .string({
      error: INTERNAL_ERROR_MESSAGES.DESCRIPTION_MISSING_OR_INVALID,
    })
    .optional(),
  images: z
    .array(
      z
        .file({ error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID })
        .max(1024 * 1024 * 10, {
          error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
        })
        .mime(["image/jpeg", "image/png", "image/webp"], {
          error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
        }),
    )
    .optional(),
  coverImage: z
    .file({
      error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID,
    })
    .max(1024 * 1024 * 10, {
      error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID,
    })
    .mime(["image/jpeg", "image/png", "image/webp", "image/svg+xml"], {
      error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
    })
    .optional(),
  country: z
    .string({
      error: INTERNAL_ERROR_MESSAGES.COUNTRY_MISSING_OR_INVALID,
    })
    .optional(),
  city: z
    .string({ error: INTERNAL_ERROR_MESSAGES.CITY_MISSING_OR_INVALID })
    .optional(),
  landMark: z
    .string({
      error: INTERNAL_ERROR_MESSAGES.LANDMARK_MISSING_OR_INVALID,
    })
    .optional(),
  pinCode: z
    .string({
      error: INTERNAL_ERROR_MESSAGES.PINCODE_MISSING_OR_INVALID,
    })
    .optional(),
  coordinates: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z
      .tuple([z.number(), z.number()], {
        error: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING_OR_INVALID,
      })
      .optional(),
  ),
});

export const hotelSearchValidationSchema = z.object({
  queryString: z
    .string({ error: INTERNAL_ERROR_MESSAGES.QUERY_STRING_INVALID })
    .optional(),
  city: z.preprocess(
    (v) => (typeof v === "string" ? JSON.parse(v) : v),
    z
      .tuple([z.number(), z.number()], {
        error: INTERNAL_ERROR_MESSAGES.CITY_MISSING_OR_INVALID,
      })
      .optional(),
  ),
  proximityRadius: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.PROXIMITY_RADIUS_INVALID })
    .positive({ error: INTERNAL_ERROR_MESSAGES.PROXIMITY_RADIUS_INVALID })
    .optional(),
  checkInDate: z.coerce
    .date({ error: INTERNAL_ERROR_MESSAGES.CHECK_IN_DATE_INVALID })
    .optional(),
  checkOutDate: z.coerce
    .date({ error: INTERNAL_ERROR_MESSAGES.CHECK_OUT_DATE_INVALID })
    .optional(),
  pageNo: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .int({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .positive({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO }),
  guests: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.GUESTS_INVALID })
    .int({ error: INTERNAL_ERROR_MESSAGES.GUESTS_INVALID })
    .positive({ error: INTERNAL_ERROR_MESSAGES.GUESTS_INVALID })
    .optional(),
  maxPrice: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.MAX_PRICE_INVALID })
    .positive({ error: INTERNAL_ERROR_MESSAGES.MAX_PRICE_INVALID })
    .optional(),
  minPrice: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.MIN_PRICE_INVALID })
    .nonnegative({ error: INTERNAL_ERROR_MESSAGES.MIN_PRICE_INVALID })
    .optional(),
});
