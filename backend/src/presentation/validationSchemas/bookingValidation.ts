import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import z from "zod";

export const bookingListingQueryValidationSchema = z.object({
  pageNo: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .int({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO })
    .positive({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO }),
});
