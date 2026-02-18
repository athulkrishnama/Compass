import type { RoomVariantListingItem } from "@/types/api/responses/roomVariantListingResponse";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import { Button } from "@/components/ui/button";
import { Hotel } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomVariantSelectorProps {
    roomVariants: RoomVariantListingItem[];
    selectedVariantId: string | undefined;
    onSelect: (variantId: string | undefined) => void;
}

export default function RoomVariantSelector({
    roomVariants,
    selectedVariantId,
    onSelect,
}: RoomVariantSelectorProps) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-3 overflow-x-auto hide-scroll-bar pb-1">
            <Button
                variant={
                    selectedVariantId === undefined ? "default" : "outline"
                }
                className={cn(
                    "flex items-center gap-2 h-auto px-4 py-3 rounded-xl whitespace-nowrap cursor-pointer shrink-0",
                    selectedVariantId === undefined && "shadow-sm"
                )}
                onClick={() => onSelect(undefined)}
            >
                <Hotel className="w-5 h-5" />
                <span className="font-medium text-sm">
                    {t(translationKeys.hotelBookingListing.allRooms)}
                </span>
            </Button>

            {roomVariants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                return (
                    <button
                        key={variant.id}
                        onClick={() => onSelect(variant.id)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-xl border transition-all cursor-pointer shrink-0",
                            isSelected
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                                : "border-border bg-card hover:bg-muted/50"
                        )}
                    >
                        <img
                            src={variant.coverImage}
                            alt={variant.name}
                            className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span
                            className={cn(
                                "text-sm font-medium",
                                isSelected ? "text-primary" : "text-foreground"
                            )}
                        >
                            {variant.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
