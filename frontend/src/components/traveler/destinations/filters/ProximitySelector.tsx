import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import { cn } from "@/lib/utils";

const PROXIMITY_OPTIONS = [5, 10, 20, 50, 100, 200, 500];

interface ProximitySelectorProps {
    value?: number;
    disabled?: boolean;
    onChange: (value: number | undefined) => void;
}

function ProximitySelector({
    value,
    disabled,
    onChange,
}: ProximitySelectorProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {t(translationKey.text.proximityRadius)}
                </Label>
                {value && (
                    <span className="text-sm text-gray-500">{value} km</span>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {PROXIMITY_OPTIONS.map((km) => (
                    <Button
                        key={km}
                        type="button"
                        variant={value === km ? "default" : "outline"}
                        size="sm"
                        disabled={disabled}
                        onClick={() => onChange(value === km ? undefined : km)}
                        className={cn(
                            "min-w-[60px]",
                            value === km && "bg-gray-900 text-white"
                        )}
                    >
                        {km} km
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default ProximitySelector;
