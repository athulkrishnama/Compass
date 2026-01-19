import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";

interface ProximityRadiusSelectorProps {
    selectedRadius: number | undefined;
    onRadiusChange: (radius: number | undefined) => void;
    disabled?: boolean;
}

const PROXIMITY_OPTIONS = [5, 20, 50, 100];

function ProximityRadiusSelector({
    selectedRadius,
    onRadiusChange,
    disabled = false,
}: ProximityRadiusSelectorProps) {
    const { t } = useTranslation();

    return (
        <div className={disabled ? "opacity-50" : ""}>
            <Label className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                {t(translationKey.text.proximityRadius)}
            </Label>
            <div className="flex items-center gap-2">
                {PROXIMITY_OPTIONS.map((radius) => (
                    <button
                        key={radius}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                            onRadiusChange(
                                selectedRadius === radius ? undefined : radius
                            )
                        }
                        className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-all ${
                            selectedRadius === radius
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        } ${disabled ? "cursor-not-allowed" : ""}`}
                    >
                        {radius}KM
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ProximityRadiusSelector;
