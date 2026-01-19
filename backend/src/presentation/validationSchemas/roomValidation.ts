import z from "zod";
import { INTERNAL_ERROR_MESSAGES } from "../../domain/enums/internalErrorMessages";
import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export const createRoomValidationSchema = z.object({
  hotelId: z
    .string({
      message: INTERNAL_ERROR_MESSAGES.HOTEL_ID_MISSING_OR_INVALID,
    })
    .min(1, { message: INTERNAL_ERROR_MESSAGES.HOTEL_ID_MISSING_OR_INVALID })
    .max(255),
  variantId: z
    .string({
      message: INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_ID_MISSING_OR_INVALID,
    })
    .min(1, {
      message: INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_ID_MISSING_OR_INVALID,
    })
    .max(255),
  roomCode: z
    .string({
      message: INTERNAL_ERROR_MESSAGES.ROOM_CODE_MISSING_OR_INVALID,
    })
    .min(1, { message: INTERNAL_ERROR_MESSAGES.ROOM_CODE_MISSING_OR_INVALID })
    .max(255),
  floor: z.number({
    message: INTERNAL_ERROR_MESSAGES.FLOOR_MISSING_OR_INVALID,
  }),
  status: z.enum(RoomVariantStatus, {
    message: INTERNAL_ERROR_MESSAGES.STATUS_MISSING_OR_INVALID,
  }),
});

export const editRoomValidationSchema = z.object({
  id: z.string({
    message: INTERNAL_ERROR_MESSAGES.ID_MISSING,
  }),
  userId: z.string({
    message: INTERNAL_ERROR_MESSAGES.USER_ID_MISSING_OR_INVALID,
  }),
  roomCode: z
    .string()
    .min(1, { message: INTERNAL_ERROR_MESSAGES.ROOM_CODE_MISSING_OR_INVALID })
    .max(255)
    .optional(),
  floor: z.number().optional(),
  status: z.enum(RoomVariantStatus).optional(),
});
