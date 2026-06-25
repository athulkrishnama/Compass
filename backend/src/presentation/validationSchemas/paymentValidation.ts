import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
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

export const initiateCabPaymentSchema = z.object({
  tripId: z.string({ error: INTERNAL_ERROR_MESSAGES.TRIP_ID_REQUIRED }),
  paymentMethod: z.enum(
    [PAYMENT_METHOD.WALLET, PAYMENT_METHOD.STRIPE, PAYMENT_METHOD.CASH],
    { error: INTERNAL_ERROR_MESSAGES.INVALID_PAYMENT_METHOD },
  ),
});

export const recordCashPaymentSchema = z.object({
  tripId: z.string({ error: INTERNAL_ERROR_MESSAGES.TRIP_ID_REQUIRED }),
  amountReceived: z.coerce
    .number({ error: INTERNAL_ERROR_MESSAGES.INVALID_DATA })
    .positive({ message: INTERNAL_ERROR_MESSAGES.INVALID_DATA }),
});

export const cabPaymentStatusSchema = z.object({
  tripId: z.string({ error: INTERNAL_ERROR_MESSAGES.TRIP_ID_REQUIRED }),
});
