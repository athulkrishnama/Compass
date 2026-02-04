import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import translationKey from "@/utils/i18n/translationKey";
import { DateRangePicker, GuestSelector, HotelPriceRangeInput } from ".";

interface HotelFilters {
    searchQuery: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    minPrice?: number;
    maxPrice?: number;
}

interface HotelSearchFiltersProps {
    filters: HotelFilters;
    onFilterChange: (filters: Partial<HotelFilters>) => void;
}

export const HotelSearchFilters = ({
    filters,
    onFilterChange,
}: HotelSearchFiltersProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-6"
        >
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <Input
                            type="text"
                            placeholder={t(translationKey.hotelSearch.whereTo)}
                            value={filters.searchQuery}
                            onChange={(e) =>
                                onFilterChange({ searchQuery: e.target.value })
                            }
                            className="pl-10 h-12 bg-zinc-50 border-zinc-200 focus:border-black focus:ring-black"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <DateRangePicker
                            checkIn={filters.checkIn}
                            checkOut={filters.checkOut}
                            onCheckInChange={(date: string) =>
                                onFilterChange({ checkIn: date })
                            }
                            onCheckOutChange={(date: string) =>
                                onFilterChange({ checkOut: date })
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
