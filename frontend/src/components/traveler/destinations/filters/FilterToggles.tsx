import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import translationKey from "@/utils/i18n/translationKey";

interface FilterTogglesProps {
    isActive: boolean;
    onlyFree: boolean;
    isWheelchairAccessible: boolean;
    onIsActiveChange: (value: boolean) => void;
    onOnlyFreeChange: (value: boolean) => void;
    onWheelchairAccessibleChange: (value: boolean) => void;
}

function FilterToggles({
    isActive,
    onlyFree,
    isWheelchairAccessible,
    onIsActiveChange,
    onOnlyFreeChange,
    onWheelchairAccessibleChange,
}: FilterTogglesProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                    <Label className="font-medium">
                        {t(translationKey.text.activeStatus)}
                    </Label>
                    <p className="text-xs text-gray-500">
                        {t(translationKey.text.liveAvailabilityOnly)}
                    </p>
                </div>
                <Switch checked={isActive} onCheckedChange={onIsActiveChange} />
            </div>
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                        checked={onlyFree}
                        onCheckedChange={(v) => onOnlyFreeChange(!!v)}
                    />
                    <span className="text-sm">
                        {t(translationKey.text.freeEntryOnly)}
                    </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                        checked={isWheelchairAccessible}
                        onCheckedChange={(v) =>
                            onWheelchairAccessibleChange(!!v)
                        }
                    />
                    <span className="text-sm">
                        {t(translationKey.text.wheelchairAccessible)}
                    </span>
                </label>
            </div>
        </div>
    );
}

export default FilterToggles;
