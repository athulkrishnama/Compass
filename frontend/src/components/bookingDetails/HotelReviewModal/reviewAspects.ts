import {
    HeartHandshake,
    Users,
    Sparkles,
    Bed,
    Star,
    ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IReviewAspectRatings } from "@/types/api/requests/reviewRequests";
import translationKey from "@/utils/i18n/translationKey";

export interface ReviewAspect {
    key: keyof IReviewAspectRatings;
    labelKey: string;
    questionKey: string;
    descriptionKey: string;
    icon: LucideIcon;
}

export const REVIEW_ASPECTS: ReviewAspect[] = [
    {
        key: "hospitality",
        labelKey: translationKey.hotelReviewModal.hospitality,
        questionKey: translationKey.hotelReviewModal.hospitalityQuestion,
        descriptionKey: translationKey.hotelReviewModal.hospitalityDescription,
        icon: HeartHandshake,
    },
    {
        key: "staffFriendliness",
        labelKey: translationKey.hotelReviewModal.staffFriendliness,
        questionKey: translationKey.hotelReviewModal.staffFriendlinessQuestion,
        descriptionKey:
            translationKey.hotelReviewModal.staffFriendlinessDescription,
        icon: Users,
    },
    {
        key: "cleanliness",
        labelKey: translationKey.hotelReviewModal.cleanliness,
        questionKey: translationKey.hotelReviewModal.cleanlinessQuestion,
        descriptionKey: translationKey.hotelReviewModal.cleanlinessDescription,
        icon: Sparkles,
    },
    {
        key: "comfort",
        labelKey: translationKey.hotelReviewModal.comfort,
        questionKey: translationKey.hotelReviewModal.comfortQuestion,
        descriptionKey: translationKey.hotelReviewModal.comfortDescription,
        icon: Bed,
    },
    {
        key: "roomQuality",
        labelKey: translationKey.hotelReviewModal.roomQuality,
        questionKey: translationKey.hotelReviewModal.roomQualityQuestion,
        descriptionKey: translationKey.hotelReviewModal.roomQualityDescription,
        icon: Star,
    },
    {
        key: "safety",
        labelKey: translationKey.hotelReviewModal.safety,
        questionKey: translationKey.hotelReviewModal.safetyQuestion,
        descriptionKey: translationKey.hotelReviewModal.safetyDescription,
        icon: ShieldCheck,
    },
];

export const EMOJI_LABELS_KEYS: string[] = [
    translationKey.hotelReviewModal.veryDissatisfied,
    translationKey.hotelReviewModal.dissatisfied,
    translationKey.hotelReviewModal.neutral,
    translationKey.hotelReviewModal.happy,
    translationKey.hotelReviewModal.extremelyHappy,
];
