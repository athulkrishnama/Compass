import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";

interface DateRangePickerProps {
    checkIn: string;
    checkOut: string;
    onCheckInChange: (date: string) => void;
    onCheckOutChange: (date: string) => void;
}

export const DateRangePicker = ({
    checkIn,
    checkOut,
    onCheckInChange,
    onCheckOutChange,
}: DateRangePickerProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Label className="text-xs text-zinc-500 mb-1 block">
                    {t(translationKey.hotelSearch.checkIn)}
                </Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => onCheckInChange(e.target.value)}
                        className="pl-10 h-10 bg-zinc-50 border-zinc-200 focus:border-black focus:ring-black text-sm"
                    />
                </div>
            </div>
            <div className="relative flex-1">
                <Label className="text-xs text-zinc-500 mb-1 block">
                    {t(translationKey.hotelSearch.checkOut)}
                </Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => onCheckOutChange(e.target.value)}
                        className="pl-10 h-10 bg-zinc-50 border-zinc-200 focus:border-black focus:ring-black text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
