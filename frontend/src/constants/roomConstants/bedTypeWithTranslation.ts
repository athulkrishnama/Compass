import translationKey from "@/utils/i18n/translationKey";
import { BED_TYPES } from "./bedTypeConstants";

export interface BED_TYPE_WITH_TRANSLATION_TYPE {
    value: string;
    labelKey: string;
}

export const BED_TYPE_WITH_TRANSLATION: BED_TYPE_WITH_TRANSLATION_TYPE[] = [
    {
        value: BED_TYPES.KING,
        labelKey: translationKey.room.bedTypeKing,
    },
    {
        value: BED_TYPES.QUEEN,
        labelKey: translationKey.room.bedTypeQueen,
    },
    {
        value: BED_TYPES.TWIN,
        labelKey: translationKey.room.bedTypeTwin,
    },
    {
        value: BED_TYPES.DOUBLE,
        labelKey: translationKey.room.bedTypeDouble,
    },
    {
        value: BED_TYPES.SINGLE,
        labelKey: translationKey.room.bedTypeSingle,
    },
    {
        value: BED_TYPES.BUNK,
        labelKey: translationKey.room.bedTypeBunk,
    },
];
