import autoImg from "@/assets/images/vehicleImages/auto.png";
import sedanImg from "@/assets/images/vehicleImages/sedan.png";
import suvImg from "@/assets/images/vehicleImages/suv.png";

export const CAB_IMAGE_MAP: Record<string, string> = {
    SUV: suvImg,
    SEDAN: sedanImg,
    RICKSHAW: autoImg,
};

export const CAB_DESCRIPTIONS: Record<string, string> = {
    SUV: "Spacious rides for groups",
    SEDAN: "Comfortable sedans",
    RICKSHAW: "Quick rides, great value",
};

export const CAB_CAPACITY: Record<string, number> = {
    SUV: 6,
    SEDAN: 4,
    RICKSHAW: 3,
};
