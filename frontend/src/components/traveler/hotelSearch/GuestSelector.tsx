import { useTranslation } from "react-i18next";
import { Users, Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";

interface GuestSelectorProps {
    guests: number;
    onGuestsChange: (guests: number) => void;
    maxGuests?: number;
}

export const GuestSelector = ({
    guests,
    onGuestsChange,
    maxGuests = 10,
}: GuestSelectorProps) => {
    const { t } = useTranslation();

    const increment = () => {
        if (guests < maxGuests) {
            onGuestsChange(guests + 1);
        }
    };

    const decrement = () => {
        if (guests > 1) {
            onGuestsChange(guests - 1);
        }
    };

    return (
        <div>
            <Label className="text-xs text-zinc-500 mb-1 block">
                {t(translationKey.hotelSearch.guests)}
            </Label>
            <div className="flex items-center gap-2 h-10 bg-zinc-50 border border-zinc-200 rounded-md px-3">
                <Users className="w-4 h-4 text-zinc-400" />
                <div className="flex items-center gap-3 flex-1 justify-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-zinc-200"
                        onClick={decrement}
                        disabled={guests <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[2rem] text-center">
                        {guests}{" "}
                        {guests === 1
                            ? t(translationKey.hotelSearch.guest)
                            : t(translationKey.hotelSearch.guests)}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-zinc-200"
                        onClick={increment}
                        disabled={guests >= maxGuests}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
