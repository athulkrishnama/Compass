import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import z from "zod";

export const bookingListingQueryValidationSchema = z.object({
  pageNo: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .int({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .positive({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO }),
});

export const bookingDetailsParamsValidationSchema = z.object({
  bookingId: z
    .string({ error: INTERNAL_ERROR_MESSAGES.INVALID_ID })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: INTERNAL_ERROR_MESSAGES.INVALID_ID,
    }),
});

export const hotelBookingQueryValidationSchema = z.object({
  pageNo: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .int({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .positive({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO }),
  roomVariantId: z.string().optional(),
  status: z.enum(Object.values(BOOKING_STATUS)).optional(),
  search: z.string().optional(),
});
