import { useTranslation } from "react-i18next";
import { IndianRupee } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";

interface HotelPriceRangeInputProps {
    minPrice?: number;
    maxPrice?: number;
    onMinPriceChange: (value: number | undefined) => void;
    onMaxPriceChange: (value: number | undefined) => void;
}

export const HotelPriceRangeInput = ({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
}: HotelPriceRangeInputProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Label className="text-xs text-zinc-500 mb-1 block">Min</Label>
                <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        type="number"
                        placeholder="0"
                        value={minPrice ?? ""}
                        onChange={(e) =>
                            onMinPriceChange(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                        className="pl-10 h-10 bg-zinc-50 border-zinc-200 focus:border-black focus:ring-black text-sm"
                    />
                </div>
            </div>
            <div className="relative flex-1">
                <Label className="text-xs text-zinc-500 mb-1 block">
                    {t(translationKey.hotelSearch.max)}
                </Label>
                <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        type="number"
                        placeholder="∞"
                        value={maxPrice ?? ""}
                        onChange={(e) =>
                            onMaxPriceChange(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                        className="pl-10 h-10 bg-zinc-50 border-zinc-200 focus:border-black focus:ring-black text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
