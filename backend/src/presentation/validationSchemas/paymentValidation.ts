import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import z from "zod";

export const createIndentSchema = z.object({
  roomVariantId: z.string({
    error: INTERNAL_ERROR_MESSAGES.INVALID_ROOM_VARIANT_ID,
  }),
  traverlerId: z.string({
    error: INTERNAL_ERROR_MESSAGES.INVALID_TRAVERLER_ID,
  }),
  checkInDate: z.coerce.date({
    error: INTERNAL_ERROR_MESSAGES.INVALID_CHECKIN_DATE,
  }),
  checkOutDate: z.coerce.date({
    error: INTERNAL_ERROR_MESSAGES.INVALID_CHECKOUT_DATE,
  }),
  guests: z.coerce.number({ error: INTERNAL_ERROR_MESSAGES.INVALID_GUESTS }),
});
