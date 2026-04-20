import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import LocationSearchInput from "./LocationSearchInput";
import translationKey from "@/utils/i18n/translationKey";

interface LocationPoint {
    lat: number;
    lng: number;
    name: string;
}

interface LocationCardProps {
    pickupValue: string;
    dropoffValue: string;
    isGettingPickup: boolean;
    isGettingDropoff: boolean;
    canSearch: boolean;
    onPickupRetrieve: (r: LocationPoint) => void;
    onDropoffRetrieve: (r: LocationPoint) => void;
    onPickupCurrentLocation: () => void;
    onDropoffCurrentLocation: () => void;
    onSwap: () => void;
    onSearch: () => void;
}

const LocationCard = ({
    pickupValue,
    dropoffValue,
    isGettingPickup,
    isGettingDropoff,
    canSearch,
    onPickupRetrieve,
    onDropoffRetrieve,
    onPickupCurrentLocation,
    onDropoffCurrentLocation,
    onSwap,
    onSearch,
}: LocationCardProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="bg-white rounded-2xl p-5 space-y-3"
            style={{
                boxShadow:
                    "0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            }}
        >
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full border-2 border-black bg-white" />
                    <div className="w-px h-7 bg-zinc-200" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase mb-1">
                        {t(translationKey.cabHome.pickup)}
                    </p>
                    <LocationSearchInput
                        id="pickup-input"
                        placeholder={t(translationKey.cabHome.selectPickup)}
                        value={pickupValue}
                        onRetrieve={onPickupRetrieve}
                        onCurrentLocation={onPickupCurrentLocation}
                    />
                    {isGettingPickup && (
                        <p className="text-[11px] text-zinc-400 mt-1 ml-1">
                            {t(translationKey.cabHome.gettingLocation)}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={onSwap}
                    title={t(translationKey.cabHome.swapPoints)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm"
                >
                    <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                    <div className="w-3 h-3 rounded-sm bg-black" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase mb-1">
                        {t(translationKey.cabHome.dropoff)}
                    </p>
                    <LocationSearchInput
                        id="dropoff-input"
                        placeholder={t(translationKey.cabHome.selectDropoff)}
                        value={dropoffValue}
                        onRetrieve={onDropoffRetrieve}
                        onCurrentLocation={onDropoffCurrentLocation}
                    />
                    {isGettingDropoff && (
                        <p className="text-[11px] text-zinc-400 mt-1 ml-1">
                            {t(translationKey.cabHome.gettingLocation)}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={onSearch}
                disabled={!canSearch}
                className={`w-full mt-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                    canSearch
                        ? "bg-black text-white hover:bg-zinc-800 shadow-md hover:shadow-lg active:scale-[0.98]"
                        : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}
            >
                {t(translationKey.cabHome.searchRides)}
            </button>
        </motion.div>
    );
};

export default LocationCard;
