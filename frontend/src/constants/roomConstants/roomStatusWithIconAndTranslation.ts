import translationKey from "@/utils/i18n/translationKey";
import { CheckCircle, Wrench, Ban, type LucideIcon } from "lucide-react";
import { ROOM_STATUS } from "./roomStatusConstants";

export interface ROOM_STATUS_WITH_ICON_AND_TRANSLATION_TYPE {
    value: string;
    labelKey: string;
    icon: LucideIcon;
}

export const ROOM_STATUS_WITH_ICON_AND_TRANSLATION: ROOM_STATUS_WITH_ICON_AND_TRANSLATION_TYPE[] =
    [
        {
            value: ROOM_STATUS.ACTIVE,
            labelKey: translationKey.roomStatus.available,
            icon: CheckCircle,
        },

        {
            value: ROOM_STATUS.MAINTENANCE,
            labelKey: translationKey.roomStatus.repair,
            icon: Wrench,
        },
        {
            value: ROOM_STATUS.INACTIVE,
            labelKey: translationKey.roomStatus.blocked,
            icon: Ban,
        },
    ];
