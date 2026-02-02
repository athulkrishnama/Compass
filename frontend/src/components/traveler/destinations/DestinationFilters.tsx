import {
    useState,
    useEffect,
    useCallback,
    type Dispatch,
    type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import {
    Search,
    RotateCcw,
    SlidersHorizontal,
    ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";
import { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import translationKey from "@/utils/i18n/translationKey";
import TypeSelectPopover from "./TypeSelectPopover";
import ActivitySelectPopover from "./ActivitySelectPopover";
import ExpandedFilterPanel from "./filters/ExpandedFilterPanel";
import { useThrottledCallback } from "@tanstack/react-pacer";
import { cn } from "@/lib/utils";

export interface DestinationFilterState {
    queryString: string;
    type?: DESTINATION_TYPES[];
    activites?: ACTIVITY_TYPE[];
    minPrice?: number;
    maxPrice?: number;
    city?: [number, number];
    cityName?: string;
    proximityRadius?: number;
    onlyFree?: boolean;
    isWheelchairAccessible?: boolean;
    isActive?: boolean;
    sortBy?: "name" | "entryFee";
    sortOrder?: "asc" | "desc";
}

interface DestinationFiltersProps {
    filter: DestinationFilterState;
    setFilter: Dispatch<SetStateAction<DestinationFilterState>>;
    onSearch: () => void;
}

const INITIAL_FILTER: DestinationFilterState = {
    queryString: "",
    type: undefined,
    activites: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    city: undefined,
    cityName: undefined,
    proximityRadius: undefined,
    onlyFree: false,
    isWheelchairAccessible: false,
    isActive: true,
    sortBy: undefined,
    sortOrder: undefined,
};

function DestinationFilters({
    filter,
    setFilter,
    onSearch,
}: DestinationFiltersProps) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [localFilter, setLocalFilter] = useState<DestinationFilterState>({
        ...filter,
    });

    const handleSearch = useCallback(
        () => setFilter(localFilter),
        [localFilter, setFilter]
    );
    const throttledHandleSearch = useThrottledCallback(handleSearch, {
        wait: 500,
    });
    useEffect(() => {
        throttledHandleSearch();
    }, [localFilter, throttledHandleSearch]);

    const handleReset = useCallback(() => {
        setLocalFilter(INITIAL_FILTER);
        setFilter(INITIAL_FILTER);
        onSearch();
    }, [onSearch, setFilter]);

    const updateLocal = <K extends keyof DestinationFilterState>(
        key: K,
        value: DestinationFilterState[K]
    ) => {
        setLocalFilter((prev) => ({ ...prev, [key]: value }));
    };

    const activeFilterCount = [
        localFilter.type?.length,
        localFilter.activites?.length,
        localFilter.minPrice,
        localFilter.maxPrice,
        localFilter.city,
        localFilter.onlyFree,
        localFilter.isWheelchairAccessible,
        localFilter.proximityRadius,
    ].filter(Boolean).length;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 p-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9 h-10 bg-gray-50 border-0"
                        placeholder={t(
                            translationKey.text.searchByNameOrTagline
                        )}
                        value={localFilter.queryString}
                        onChange={(e) =>
                            updateLocal("queryString", e.target.value)
                        }
                    />
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    {t(translationKey.button.reset)}
                </Button>

                <TypeSelectPopover
                    selectedTypes={localFilter.type}
                    onTypeChange={(types) => updateLocal("type", types)}
                />
                <ActivitySelectPopover
                    selectedActivities={localFilter.activites}
                    onActivityChange={(activities) =>
                        updateLocal("activites", activities)
                    }
                />

                <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-auto gap-2 bg-gray-900 text-white hover:bg-gray-800"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {isExpanded
                        ? t(translationKey.button.filters)
                        : t(translationKey.text.showMoreFilters)}
                    {activeFilterCount > 0 && (
                        <span className="bg-white text-gray-900 text-xs px-1.5 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 transition-transform",
                            isExpanded && "rotate-180"
                        )}
                    />
                </Button>
            </div>

            <ExpandedFilterPanel
                isExpanded={isExpanded}
                filter={localFilter}
                onUpdate={updateLocal}
                onReset={handleReset}
                onClose={() => setIsExpanded(false)}
            />
        </div>
    );
}

export default DestinationFilters;
