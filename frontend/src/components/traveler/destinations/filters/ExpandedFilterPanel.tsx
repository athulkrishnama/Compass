import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import PriceRangeInput from "../PriceRangeInput";
import CitySearchBox from "../CitySearchBox";
import ProximitySelector from "./ProximitySelector";
import FilterToggles from "./FilterToggles";
import SortOptions from "./SortOptions";
import type { DestinationFilterState } from "../DestinationFilters";

interface ExpandedFilterPanelProps {
    isExpanded: boolean;
    filter: DestinationFilterState;
    onUpdate: <K extends keyof DestinationFilterState>(
        key: K,
        value: DestinationFilterState[K]
    ) => void;
    onReset: () => void;
    onClose: () => void;
}

function ExpandedFilterPanel({
    isExpanded,
    filter,
    onUpdate,
    onReset,
    onClose,
}: ExpandedFilterPanelProps) {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="border-t border-gray-100 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PriceRangeInput
                                minPrice={filter.minPrice}
                                maxPrice={filter.maxPrice}
                                onMinPriceChange={(v) =>
                                    onUpdate("minPrice", v)
                                }
                                onMaxPriceChange={(v) =>
                                    onUpdate("maxPrice", v)
                                }
                            />
                            <ProximitySelector
                                value={filter.proximityRadius}
                                disabled={!filter.city}
                                onChange={(v) => onUpdate("proximityRadius", v)}
                            />
                        </div>

                        <div className="max-w-md">
                            <CitySearchBox
                                onCitySelect={(coords, name) => {
                                    onUpdate("city", coords);
                                    onUpdate("cityName", name);
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <FilterToggles
                                isActive={filter.isActive ?? true}
                                onlyFree={!!filter.onlyFree}
                                isWheelchairAccessible={
                                    !!filter.isWheelchairAccessible
                                }
                                onIsActiveChange={(v) =>
                                    onUpdate("isActive", v)
                                }
                                onOnlyFreeChange={(v) =>
                                    onUpdate("onlyFree", v)
                                }
                                onWheelchairAccessibleChange={(v) =>
                                    onUpdate("isWheelchairAccessible", v)
                                }
                            />
                            <SortOptions
                                sortBy={filter.sortBy}
                                sortOrder={filter.sortOrder}
                                onSortByChange={(v) => onUpdate("sortBy", v)}
                                onSortOrderChange={(v) =>
                                    onUpdate("sortOrder", v)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <Button
                                variant="ghost"
                                onClick={onReset}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                {t(translationKey.text.clearAllFilters)}
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                {t(translationKey.button.cancel)}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ExpandedFilterPanel;
