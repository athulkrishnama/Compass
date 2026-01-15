import { z } from "zod";
import { t } from "i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { UseFormReturn } from "react-hook-form";

export const BedTypes = [
    "KING",
    "QUEEN",
    "TWIN",
    "DOUBLE",
    "SINGLE",
    "BUNK",
] as const;

export const RoomStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE"] as const;

export const RoomAmenities = [
    "WIFI",
    "AIR_CONDITIONING",
    "SMART_TV",
    "MINI_BAR",
    "COFFEE_MAKER",
    "IN_ROOM_SAFE",
    "WORK_DESK",
    "HAIR_DRYER",
    "IRON",
    "BATHTUB",
    "SHOWER",
    "TOILETRIES",
    "ROOM_SERVICE",
    "BALCONY",
    "SEA_VIEW_BALCONY",
    "CITY_VIEW",
    "GARDEN_VIEW",
    "POOL_VIEW",
    "BLACKOUT_CURTAINS",
    "SOUNDPROOFING",
] as const;

export const createRoomValidationSchema = () => {
    return z.object({
        name: z
            .string()
            .min(3, t(translationKey.errors.roomNameMinLength))
            .max(100, t(translationKey.errors.roomNameMaxLength)),
        code: z
            .string()
            .min(2, t(translationKey.errors.roomCodeRequired))
            .max(20, t(translationKey.errors.roomCodeMaxLength)),
        description: z
            .string()
            .min(10, t(translationKey.errors.descriptionMinLength))
            .max(2000, t(translationKey.errors.descriptionMaxLength)),
        baseOccupancy: z
            .number()
            .min(1, t(translationKey.errors.baseOccupancyRequired)),
        maxOccupancy: z
            .number()
            .min(1, t(translationKey.errors.maxOccupancyRequired)),
        bedType: z.enum(BedTypes, {
            message: t(translationKey.errors.bedTypeRequired),
        }),
        bedCount: z.number().min(1, t(translationKey.errors.bedCountRequired)),
        basePrice: z
            .number()
            .min(0, t(translationKey.errors.basePriceRequired)),
        status: z.enum(RoomStatuses, {
            message: t(translationKey.errors.statusRequired),
        }),
        amenities: z.array(z.enum(RoomAmenities)),
        smokingAllowed: z.boolean(),
        petsAllowed: z.boolean(),
        checkInTime: z
            .string()
            .min(1, t(translationKey.errors.checkInTimeRequired)),
        checkOutTime: z
            .string()
            .min(1, t(translationKey.errors.checkOutTimeRequired)),
    });
};

export type RoomFormValues = z.infer<
    ReturnType<typeof createRoomValidationSchema>
>;

export type RoomFormType = UseFormReturn<RoomFormValues>;
