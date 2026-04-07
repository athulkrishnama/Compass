import {type TFunction } from "i18next";
import translationKey from "@/utils/i18n/translationKey";

export const formatTravelTime = (timeInSeconds: number, t: TFunction): string => {
    const totalMinutes = Math.ceil(timeInSeconds / 60);

    if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const hourLabel =
            hours === 1
                ? t(translationKey.fareSummary.hour)
                : t(translationKey.fareSummary.hours);
        const minLabel = t(translationKey.fareSummary.mins);

        return mins > 0
            ? `${hours} ${hourLabel} ${mins} ${minLabel}`
            : `${hours} ${hourLabel}`;
    }

    const minLabel =
        totalMinutes === 1
            ? t(translationKey.fareSummary.min)
            : t(translationKey.fareSummary.mins);
    return `${totalMinutes} ${minLabel}`;
};
