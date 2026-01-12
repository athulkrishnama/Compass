import { ACTIVITY_TYPE } from "@domain/enums/activityType";
import { CURRENCY } from "@domain/enums/currency";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { MONTH } from "@domain/enums/months";
import { ROLES } from "@domain/enums/roles";
import { WEEKDAY } from "@domain/enums/weekdays";
import { ROLES as ROLETYPE } from "@domain/types/roles";
import z from "zod";

export const getUsersQueryValidationSchema = z.object({
  query: z.string().optional(),
  role: z
    .string()
    .transform((data) =>
      data
        .split(",")
        .filter((r) => Object.values(ROLES).includes(r as ROLETYPE)),
    )
    .optional(),
  status: z
    .string()
    .optional()
    .transform((v) =>
      v === "blocked" ? true : v === "active" ? false : undefined,
    ),
  pageNo: z.coerce.number(),
});

export const userStatusChangeValidationSchema = z.object({
  id: z.string({ error: INTERNAL_ERROR_MESSAGES.ID_MISSING }),
  status: z.boolean({ error: INTERNAL_ERROR_MESSAGES.STATUS_MISSING }),
});

export const getUnverifiedUserValidationSchema = z.object({
  role: z
    .string()
    .refine((val) => Object.values(ROLES).includes(val as ROLETYPE), {
      error: INTERNAL_ERROR_MESSAGES.INVALID_ROLE,
    }),
  pageNo: z.coerce.number({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO }),
  query: z.string().optional(),
});

export const rejectUserVerificationRequestValidationSchema = z.object({
  userId: z.string({ error: INTERNAL_ERROR_MESSAGES.ID_MISSING }),
  reason: z.string({ error: INTERNAL_ERROR_MESSAGES.REASON_MISSING }),
});

export const addDestinationValidationSchema = z.object({
  name: z.string({ error: INTERNAL_ERROR_MESSAGES.NAME_MISSING }),
  tagline: z.string({ error: INTERNAL_ERROR_MESSAGES.TAGLINE_MISSING }),
  description: z.string({ error: INTERNAL_ERROR_MESSAGES.DESCRIPTION_MISSING }),
  coverImage: z
    .file({ error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING })
    .max(10 * 1024 * 1024)
    .mime(["image/jpeg", "image/png", "image/svg+xml", "image/webp"]),
  images: z
    .array(
      z
        .file()
        .mime(["image/jpeg", "image/png", "image/svg+xml", "image/webp"])
        .max(10 * 1024 * 1024),
    )
    .min(4, { error: INTERNAL_ERROR_MESSAGES.MINIMUM_IMAGES_REQUIRED }),

  country: z.string({ error: INTERNAL_ERROR_MESSAGES.COUNTRY_MISSING }),
  state: z.string({ error: INTERNAL_ERROR_MESSAGES.STATE_MISSING }),
  city: z.string({ error: INTERNAL_ERROR_MESSAGES.CITY_MISSING }),
  pincode: z.string({ error: INTERNAL_ERROR_MESSAGES.PINCODE_MISSING }),
  coordinates: z.tuple([z.number(), z.number()], {
    error: INTERNAL_ERROR_MESSAGES.COORDINATES_MISSING,
  }),

  type: z.array(
    z.enum(DESTINATION_TYPES, {
      error: INTERNAL_ERROR_MESSAGES.TYPE_MISSING_OR_INVALID,
    }),
  ),
  activities: z.array(
    z.enum(ACTIVITY_TYPE, {
      error: INTERNAL_ERROR_MESSAGES.ACTIVITIES_MISSING_OR_INVALID,
    }),
  ),
  bestTimeToVisit: z.array(
    z.enum(MONTH, {
      error: INTERNAL_ERROR_MESSAGES.BEST_TIME_TO_VISIT_MISSING_OR_INVALID,
    }),
  ),

  isWheelChairAccessible: z.boolean({
    error: INTERNAL_ERROR_MESSAGES.IS_WHEELCHAIR_ACCESSIBLE_MISSING,
  }),
  isFree: z.boolean({ error: INTERNAL_ERROR_MESSAGES.IS_FREE_MISSING }),
  isAlwaysOpen: z.boolean({
    error: INTERNAL_ERROR_MESSAGES.IS_ALWAYS_OPEN_MISSING,
  }),

  entryFee: z.number({ error: INTERNAL_ERROR_MESSAGES.ENTRY_FEE_MISSING }),
  currency: z.enum(CURRENCY, {
    error: INTERNAL_ERROR_MESSAGES.CURRENCY_MISSING_OR_INVALID,
  }),

  openingTime: z.string({
    error: INTERNAL_ERROR_MESSAGES.OPENING_TIME_MISSING,
  }),
  closingTime: z.string({
    error: INTERNAL_ERROR_MESSAGES.CLOSING_TIME_MISSING,
  }),

  closedDays: z.array(
    z.enum(WEEKDAY, {
      error: INTERNAL_ERROR_MESSAGES.CLOSED_DAYS_MISSING_OR_INVALID,
    }),
  ),
});
