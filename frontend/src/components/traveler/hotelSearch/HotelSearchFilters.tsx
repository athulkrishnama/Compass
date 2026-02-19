import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, MapPin, RotateCcw } from "lucide-react";
import { SearchBox } from "@mapbox/search-js-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";
import translationKey from "@/utils/i18n/translationKey";
import { GuestSelector, HotelPriceRangeInput } from ".";

interface HotelFilters {
    searchQuery: string;
    city?: [number, number];
    cityName?: string;
    proximityRadius?: number;
    guests: number;
    minPrice?: number;
    maxPrice?: number;
}

interface HotelSearchFiltersProps {
    filters: HotelFilters;
    onFilterChange: (filters: Partial<HotelFilters>) => void;
    onReset: () => void;
}

const PROXIMITY_OPTIONS = [5, 10, 20, 50, 100];

export const HotelSearchFilters = ({
    filters,
    onFilterChange,
    onReset,
}: HotelSearchFiltersProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white rounded-2xl shadow-xl border border-zinc-200 p-6"
        >
            <div className="absolute top-4 right-6">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-black flex items-center gap-2"
                    onClick={onReset}
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        {t(translationKey.text.clearAllFilters)}
                    </span>
                </Button>
            </div>
            <div className="flex flex-col gap-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative z-20">
                        <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block font-bold">
                            {t(translationKey.text.cityHubSearch)}
                        </Label>
                        <div className="h-10 mb-1 search-box-wrapper">
                            <SearchBox
                                accessToken={env.VITE_MAPBOX_ACCESS_TOKEN}
                                options={{ types: "place" }}
                                placeholder={t(
                                    translationKey.text.enterCityName
                                )}
                                value={filters.cityName || ""}
                                onRetrieve={(res) => {
                                    const feature = res.features?.[0];
                                    if (feature?.geometry?.coordinates) {
                                        onFilterChange({
                                            city: feature.geometry
                                                .coordinates as [
                                                number,
                                                number,
                                            ],
                                            cityName: feature.properties?.name,
                                        });
                                    }
                                }}
                                theme={{
                                    variables: {
                                        fontFamily: "inherit",
                                        unit: "14px",
                                        borderRadius: "0.5rem",
                                        boxShadow: "none",
                                    },
                                }}
                            />
                        </div>
                        {filters.city && (
                            <div className="flex flex-wrap gap-2 mt-4 items-center animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-1.5 mr-1">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                        {t(translationKey.text.proximityRadius)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {PROXIMITY_OPTIONS.map((km) => (
                                        <Button
                                            key={km}
                                            type="button"
                                            variant={
                                                filters.proximityRadius === km
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            className={cn(
                                                "h-7 text-[11px] px-3 font-medium transition-all duration-200",
                                                filters.proximityRadius === km
                                                    ? "bg-black text-white hover:bg-black/90 shadow-md scale-105"
                                                    : "text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                                            )}
                                            onClick={() =>
                                                onFilterChange({
                                                    proximityRadius:
                                                        filters.proximityRadius ===
                                                        km
                                                            ? undefined
                                                            : km,
                                                })
                                            }
                                        >
                                            {km} km
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative z-10">
                        <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block font-bold">
                            {t(translationKey.hotelSearch.whereTo)}
                        </Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                type="text"
                                placeholder={t(
                                    translationKey.form.hotelNamePlaceholder
                                )}
                                value={filters.searchQuery}
                                onChange={(e) =>
                                    onFilterChange({
                                        searchQuery: e.target.value,
                                    })
                                }
                                className="pl-9 h-[42px] bg-zinc-50 border-zinc-200 focus:border-black focus:ring-black text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
                    <GuestSelector
                        guests={filters.guests}
                        onGuestsChange={(guests: number) =>
                            onFilterChange({ guests })
                        }
                    />

                    <HotelPriceRangeInput
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        onMinPriceChange={(minPrice: number | undefined) =>
                            onFilterChange({ minPrice })
                        }
                        onMaxPriceChange={(maxPrice: number | undefined) =>
                            onFilterChange({ maxPrice })
                        }
                    />
                </div>
            </div>
        </motion.div>
    );
};
