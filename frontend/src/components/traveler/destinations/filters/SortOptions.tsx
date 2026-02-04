import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import { cn } from "@/lib/utils";

interface SortOptionsProps {
    sortBy?: "name" | "entryFee";
    sortOrder?: "asc" | "desc";
    onSortByChange: (value: "name" | "entryFee" | undefined) => void;
    onSortOrderChange: (value: "asc" | "desc" | undefined) => void;
}

function SortOptions({
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderChange,
}: SortOptionsProps) {
    const { t } = useTranslation();

    const handleSortByClick = (value: "name" | "entryFee") => {
        onSortByChange(sortBy === value ? undefined : value);
    };

    const handleSortOrderClick = (value: "asc" | "desc") => {
        onSortOrderChange(sortOrder === value ? undefined : value);
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium uppercase tracking-wider text-gray-500">
                {t(translationKey.text.sortConfiguration)}
            </Label>
            <div className="flex gap-2">
                {(["name", "entryFee"] as const).map((s) => (
                    <Button
                        key={s}
                        variant={sortBy === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSortByClick(s)}
                        className={cn(
                            "flex-1",
                            sortBy === s && "bg-gray-900 text-white"
                        )}
                    >
                        {t(
                            s === "name"
                                ? translationKey.text.sortByName
                                : translationKey.text.sortByPrice
                        )}
                    </Button>
                ))}
            </div>
            <div className="flex gap-2">
                {(["asc", "desc"] as const).map((o) => (
                    <Button
                        key={o}
                        variant={sortOrder === o ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSortOrderClick(o)}
                        className={cn(
                            "flex-1",
                            sortOrder === o && "bg-gray-900 text-white"
                        )}
                    >
                        {t(
                            o === "asc"
                                ? translationKey.text.sortOrderAsc
                                : translationKey.text.sortOrderDesc
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default SortOptions;
