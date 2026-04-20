import autoImg from "@/assets/images/vehicleImages/auto.png";
import sedanImg from "@/assets/images/vehicleImages/sedan.png";
import suvImg from "@/assets/images/vehicleImages/suv.png";
import type { VehicleType } from "@/types/vehicleType";

export const CAB_IMAGE_MAP: Record<VehicleType, string> = {
    SUV: suvImg,
    SEDAN: sedanImg,
    RICKSHAW: autoImg,
};

export const CAB_DESCRIPTIONS: Record<VehicleType, string> = {
    SUV: "Spacious rides for groups",
    SEDAN: "Comfortable sedans",
    RICKSHAW: "Quick rides, great value",
};

export const CAB_CAPACITY: Record<VehicleType, number> = {
    SUV: 6,
    SEDAN: 4,
    RICKSHAW: 3,
};
