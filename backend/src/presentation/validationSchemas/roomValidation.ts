import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import z from "zod";
import { RoomStatus } from "@domain/enums/roomStatus";

export const createRoomValidation = z.object({
  hotelId: z.string({
    error: INTERNAL_ERROR_MESSAGES.HOTEL_ID_MISSING_OR_INVALID,
  }),
  name: z.string({
    error: INTERNAL_ERROR_MESSAGES.ROOM_NAME_MISSING_OR_INVALID,
  }),
  code: z.string({
    error: INTERNAL_ERROR_MESSAGES.ROOM_CODE_MISSING_OR_INVALID,
  }),
  description: z.string({
    error: INTERNAL_ERROR_MESSAGES.DESCRIPTION_MISSING_OR_INVALID,
  }),
  baseOccupancy: z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value, 10) : value),
    z
      .number({
        error: INTERNAL_ERROR_MESSAGES.BASE_OCCUPANCY_MISSING_OR_INVALID,
      })
      .min(1, {
        error: INTERNAL_ERROR_MESSAGES.BASE_OCCUPANCY_MISSING_OR_INVALID,
      }),
  ),
  maxOccupancy: z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value, 10) : value),
    z
      .number({
        error: INTERNAL_ERROR_MESSAGES.MAX_OCCUPANCY_MISSING_OR_INVALID,
      })
      .min(1, {
        error: INTERNAL_ERROR_MESSAGES.MAX_OCCUPANCY_MISSING_OR_INVALID,
      }),
  ),
  bedConfig: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.object(
      {
        type: z.enum(BedType, {
          error: INTERNAL_ERROR_MESSAGES.BED_TYPE_MISSING_OR_INVALID,
        }),
        count: z
          .number({
            error: INTERNAL_ERROR_MESSAGES.BED_COUNT_MISSING_OR_INVALID,
          })
          .min(1, {
            error: INTERNAL_ERROR_MESSAGES.BED_COUNT_MISSING_OR_INVALID,
          }),
      },
      { error: INTERNAL_ERROR_MESSAGES.BED_CONFIG_MISSING_OR_INVALID },
    ),
  ),
  amenities: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.array(z.nativeEnum(RoomAmenity), {
      error: INTERNAL_ERROR_MESSAGES.AMENITIES_MISSING_OR_INVALID,
    }),
  ),
  policies: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.object(
      {
        smokingAllowed: z.boolean({
          error: INTERNAL_ERROR_MESSAGES.SMOKING_POLICY_MISSING_OR_INVALID,
        }),
        petsAllowed: z.boolean({
          error: INTERNAL_ERROR_MESSAGES.PETS_POLICY_MISSING_OR_INVALID,
        }),
        checkInTime: z.string({
          error: INTERNAL_ERROR_MESSAGES.CHECK_IN_TIME_MISSING_OR_INVALID,
        }),
        checkOutTime: z.string({
          error: INTERNAL_ERROR_MESSAGES.CHECK_OUT_TIME_MISSING_OR_INVALID,
        }),
      },
      { error: INTERNAL_ERROR_MESSAGES.POLICIES_MISSING_OR_INVALID },
    ),
  ),
  basePrice: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z
      .number({
        error: INTERNAL_ERROR_MESSAGES.BASE_PRICE_MISSING_OR_INVALID,
      })
      .min(0, { error: INTERNAL_ERROR_MESSAGES.BASE_PRICE_MISSING_OR_INVALID }),
  ),
  coverImage: z
    .file({
      error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID,
    })
    .mime(["image/jpeg", "image/png", "image/webp"], {
      error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID,
    }),
  images: z.array(
    z
      .file({ error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID })
      .mime(["image/jpeg", "image/png", "image/webp"], {
        error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
      }),
  ),
});

export const editRoomValidation = z.object({
  roomId: z.string({
    error: INTERNAL_ERROR_MESSAGES.ROOM_ID_MISSING_OR_INVALID,
  }),
  name: z
    .string({
      error: INTERNAL_ERROR_MESSAGES.ROOM_NAME_MISSING_OR_INVALID,
    })
    .optional(),
  description: z
    .string({
      error: INTERNAL_ERROR_MESSAGES.DESCRIPTION_MISSING_OR_INVALID,
    })
    .optional(),
  baseOccupancy: z
    .preprocess(
      (value) => (typeof value === "string" ? parseInt(value, 10) : value),
      z
        .number({
          error: INTERNAL_ERROR_MESSAGES.BASE_OCCUPANCY_MISSING_OR_INVALID,
        })
        .min(1, {
          error: INTERNAL_ERROR_MESSAGES.BASE_OCCUPANCY_MISSING_OR_INVALID,
        }),
    )
    .optional(),
  maxOccupancy: z
    .preprocess(
      (value) => (typeof value === "string" ? parseInt(value, 10) : value),
      z
        .number({
          error: INTERNAL_ERROR_MESSAGES.MAX_OCCUPANCY_MISSING_OR_INVALID,
        })
        .min(1, {
          error: INTERNAL_ERROR_MESSAGES.MAX_OCCUPANCY_MISSING_OR_INVALID,
        }),
    )
    .optional(),
  bedConfig: z
    .preprocess(
      (value) => (typeof value === "string" ? JSON.parse(value) : value),
      z.object(
        {
          type: z.enum(BedType, {
            error: INTERNAL_ERROR_MESSAGES.BED_TYPE_MISSING_OR_INVALID,
          }),
          count: z
            .number({
              error: INTERNAL_ERROR_MESSAGES.BED_COUNT_MISSING_OR_INVALID,
            })
            .min(1, {
              error: INTERNAL_ERROR_MESSAGES.BED_COUNT_MISSING_OR_INVALID,
            }),
        },
        { error: INTERNAL_ERROR_MESSAGES.BED_CONFIG_MISSING_OR_INVALID },
      ),
    )
    .optional(),
  amenities: z
    .preprocess(
      (value) => (typeof value === "string" ? JSON.parse(value) : value),
      z.array(z.nativeEnum(RoomAmenity), {
        error: INTERNAL_ERROR_MESSAGES.AMENITIES_MISSING_OR_INVALID,
      }),
    )
    .optional(),
  policies: z
    .preprocess(
      (value) => (typeof value === "string" ? JSON.parse(value) : value),
      z.object(
        {
          smokingAllowed: z.boolean({
            error: INTERNAL_ERROR_MESSAGES.SMOKING_POLICY_MISSING_OR_INVALID,
          }),
          petsAllowed: z.boolean({
            error: INTERNAL_ERROR_MESSAGES.PETS_POLICY_MISSING_OR_INVALID,
          }),
          checkInTime: z.string({
            error: INTERNAL_ERROR_MESSAGES.CHECK_IN_TIME_MISSING_OR_INVALID,
          }),
          checkOutTime: z.string({
            error: INTERNAL_ERROR_MESSAGES.CHECK_OUT_TIME_MISSING_OR_INVALID,
          }),
        },
        { error: INTERNAL_ERROR_MESSAGES.POLICIES_MISSING_OR_INVALID },
      ),
    )
    .optional(),
  basePrice: z
    .preprocess(
      (value) => (typeof value === "string" ? parseFloat(value) : value),
      z
        .number({
          error: INTERNAL_ERROR_MESSAGES.BASE_PRICE_MISSING_OR_INVALID,
        })
        .min(0, {
          error: INTERNAL_ERROR_MESSAGES.BASE_PRICE_MISSING_OR_INVALID,
        }),
    )
    .optional(),
  coverImage: z
    .file({
      error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID,
    })
    .mime(["image/jpeg", "image/png", "image/webp"], {
      error: INTERNAL_ERROR_MESSAGES.COVER_IMAGE_MISSING_OR_INVALID,
    })
    .optional(),
  images: z
    .array(
      z
        .file({ error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID })
        .mime(["image/jpeg", "image/png", "image/webp"], {
          error: INTERNAL_ERROR_MESSAGES.IMAGES_MISSING_OR_INVALID,
        }),
    )
    .optional(),
  status: z
    .nativeEnum(RoomStatus, {
      error: INTERNAL_ERROR_MESSAGES.STATUS_MISSING_OR_INVALID,
    })
    .optional(),
});
