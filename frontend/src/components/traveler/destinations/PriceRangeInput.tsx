import { useTranslation } from "react-i18next";
import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";

interface PriceRangeInputProps {
    minPrice: number | undefined;
    maxPrice: number | undefined;
    onMinPriceChange: (value: number | undefined) => void;
    onMaxPriceChange: (value: number | undefined) => void;
}

function PriceRangeInput({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
}: PriceRangeInputProps) {
    const { t } = useTranslation();

    return (
        <div>
            <Label className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                {t(translationKey.text.priceRange)}
            </Label>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="number"
                        className="pl-9 h-10"
                        placeholder={t(translationKey.text.minPrice)}
                        value={minPrice || ""}
                        onChange={(e) =>
                            onMinPriceChange(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                    />
                </div>
                <div className="relative flex-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="number"
                        className="pl-9 h-10"
                        placeholder={t(translationKey.text.maxPrice)}
                        value={maxPrice || ""}
                        onChange={(e) =>
                            onMaxPriceChange(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default PriceRangeInput;
