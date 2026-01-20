import { useState, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";
import { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import translationKey from "@/utils/i18n/translationKey";
import TypeSelectPopover from "./TypeSelectPopover";
import ActivitySelectPopover from "./ActivitySelectPopover";
import PriceRangeInput from "./PriceRangeInput";
import ProximityRadiusSelector from "./ProximityRadiusSelector";
import CitySearchBox from "./CitySearchBox";

export interface DestinationFilterState {
    queryString: string;
    type?: DESTINATION_TYPES[];
    activites?: ACTIVITY_TYPE[];
    minPrice?: number;
    maxPrice?: number;
    city?: [number, number];
    cityName?: string;
    proximityRadius?: number;
}

interface DestinationFiltersProps {
    filter: DestinationFilterState;
    setFilter: Dispatch<SetStateAction<DestinationFilterState>>;
    onSearch: () => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
};

function DestinationFilters({
    filter,
    setFilter,
    onSearch,
}: DestinationFiltersProps) {
    const { t } = useTranslation();
    const [localFilter, setLocalFilter] = useState<DestinationFilterState>({
        ...filter,
    });

    function handleSearch() {
        setFilter(localFilter);
        onSearch();
    }

    function handleReset() {
        const resetState: DestinationFilterState = {
            queryString: "",
            type: undefined,
            activites: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            city: undefined,
            cityName: undefined,
            proximityRadius: undefined,
        };
        setLocalFilter(resetState);
        setFilter(resetState);
        onSearch();
    }

    return (
        <motion.div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} custom={0}>
                <Label className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                    {t(translationKey.text.searchByNameOrTagline)}
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9 h-10"
                        placeholder={t(
                            translationKey.text.searchByNameOrTagline
                        )}
                        value={localFilter.queryString}
                        onChange={(e) =>
                            setLocalFilter((prev) => ({
                                ...prev,
                                queryString: e.target.value,
                            }))
                        }
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div variants={itemVariants} custom={1}>
                    <TypeSelectPopover
                        selectedTypes={localFilter.type}
                        onTypeChange={(types) =>
                            setLocalFilter((prev) => ({ ...prev, type: types }))
                        }
                    />
                </motion.div>

                <motion.div variants={itemVariants} custom={2}>
                    <ActivitySelectPopover
                        selectedActivities={localFilter.activites}
                        onActivityChange={(activities) =>
                            setLocalFilter((prev) => ({
                                ...prev,
                                activites: activities,
                            }))
                        }
                    />
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    custom={3}
                    className="md:col-span-2"
                >
                    <PriceRangeInput
                        minPrice={localFilter.minPrice}
                        maxPrice={localFilter.maxPrice}
                        onMinPriceChange={(value) =>
                            setLocalFilter((prev) => ({
                                ...prev,
                                minPrice: value,
                            }))
                        }
                        onMaxPriceChange={(value) =>
                            setLocalFilter((prev) => ({
                                ...prev,
                                maxPrice: value,
                            }))
                        }
                    />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} custom={4}>
                    <ProximityRadiusSelector
                        selectedRadius={localFilter.proximityRadius}
                        disabled={!localFilter.city}
                        onRadiusChange={(radius) =>
                            setLocalFilter((prev) => ({
                                ...prev,
                                proximityRadius: radius,
                            }))
                        }
                    />
                </motion.div>

                <motion.div variants={itemVariants} custom={5}>
                    <CitySearchBox
                        onCitySelect={(coords, name) =>
                            setLocalFilter((prev) => ({
                                ...prev,
                                city: coords,
                                cityName: name,
                            }))
                        }
                    />
                </motion.div>
            </div>

            <motion.div
                variants={itemVariants}
                custom={6}
                className="flex items-center justify-end gap-3 pt-2"
            >
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <RotateCcw className="w-4 h-4" />
                    {t(translationKey.button.reset)}
                </Button>
                <Button
                    onClick={handleSearch}
                    className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors px-6"
                >
                    <Search className="w-4 h-4" />
                    {t(translationKey.button.search)}
                </Button>
            </motion.div>
        </motion.div>
    );
}

export default DestinationFilters;
