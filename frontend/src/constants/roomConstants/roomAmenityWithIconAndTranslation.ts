import translationKey from "@/utils/i18n/translationKey";
import {
    Waves,
    Wind,
    Wine,
    Tv,
    MonitorSmartphone,
    Wifi,
    Fan,
    Lock,
    Coffee,
    ConciergeBell,
    Shirt,
    Bath,
    ShowerHead,
    SprayCan,
    DoorOpen,
    Building2,
    Flower2,
    Droplets,
    Moon,
    Volume2,
    type LucideIcon,
} from "lucide-react";
import { RoomAmenity } from "./roomAmenity";

export interface RoomAmenityWithIconAndTranslationType {
    value: RoomAmenity;
    labelKey: string;
    icon: LucideIcon;
}

export const ROOM_AMENITY_WITH_ICON_AND_TRANSLATION: RoomAmenityWithIconAndTranslationType[] =
    [
        {
            value: RoomAmenity.WIFI,
            labelKey: translationKey.roomAmenities.WIFI,
            icon: Wifi,
        },
        {
            value: RoomAmenity.AIR_CONDITIONING,
            labelKey: translationKey.roomAmenities.AIR_CONDITIONING,
            icon: Wind,
        },
        {
            value: RoomAmenity.SMART_TV,
            labelKey: translationKey.roomAmenities.SMART_TV,
            icon: Tv,
        },
        {
            value: RoomAmenity.MINI_BAR,
            labelKey: translationKey.roomAmenities.MINI_BAR,
            icon: Wine,
        },
        {
            value: RoomAmenity.COFFEE_MAKER,
            labelKey: translationKey.roomAmenities.COFFEE_MAKER,
            icon: Coffee,
        },
        {
            value: RoomAmenity.IN_ROOM_SAFE,
            labelKey: translationKey.roomAmenities.IN_ROOM_SAFE,
            icon: Lock,
        },
        {
            value: RoomAmenity.WORK_DESK,
            labelKey: translationKey.roomAmenities.WORK_DESK,
            icon: MonitorSmartphone,
        },
        {
            value: RoomAmenity.HAIR_DRYER,
            labelKey: translationKey.roomAmenities.HAIR_DRYER,
            icon: Fan,
        },
        {
            value: RoomAmenity.ROOM_SERVICE,
            labelKey: translationKey.roomAmenities.ROOM_SERVICE,
            icon: ConciergeBell,
        },
        {
            value: RoomAmenity.IRON,
            labelKey: translationKey.roomAmenities.IRON,
            icon: Shirt,
        },
        {
            value: RoomAmenity.BATHTUB,
            labelKey: translationKey.roomAmenities.BATHTUB,
            icon: Bath,
        },
        {
            value: RoomAmenity.SHOWER,
            labelKey: translationKey.roomAmenities.SHOWER,
            icon: ShowerHead,
        },
        {
            value: RoomAmenity.TOILETRIES,
            labelKey: translationKey.roomAmenities.TOILETRIES,
            icon: SprayCan,
        },
        {
            value: RoomAmenity.BALCONY,
            labelKey: translationKey.roomAmenities.BALCONY,
            icon: DoorOpen,
        },
        {
            value: RoomAmenity.SEA_VIEW_BALCONY,
            labelKey: translationKey.roomAmenities.SEA_VIEW_BALCONY,
            icon: Waves,
        },
        {
            value: RoomAmenity.CITY_VIEW,
            labelKey: translationKey.roomAmenities.CITY_VIEW,
            icon: Building2,
        },
        {
            value: RoomAmenity.GARDEN_VIEW,
            labelKey: translationKey.roomAmenities.GARDEN_VIEW,
            icon: Flower2,
        },
        {
            value: RoomAmenity.POOL_VIEW,
            labelKey: translationKey.roomAmenities.POOL_VIEW,
            icon: Droplets,
        },
        {
            value: RoomAmenity.BLACKOUT_CURTAINS,
            labelKey: translationKey.roomAmenities.BLACKOUT_CURTAINS,
            icon: Moon,
        },
        {
            value: RoomAmenity.SOUNDPROOFING,
            labelKey: translationKey.roomAmenities.SOUNDPROOFING,
            icon: Volume2,
        },
    ];

export const getAmenityDetails = (
    amenityValue: string
): RoomAmenityWithIconAndTranslationType | undefined => {
    return ROOM_AMENITY_WITH_ICON_AND_TRANSLATION.find(
        (amenity) => amenity.value === amenityValue
    );
};
