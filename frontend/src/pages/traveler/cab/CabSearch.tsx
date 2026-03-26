import { useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

const CabSearch = () => {
    const { t } = useTranslation();
    const { pickupLat, pickupLng, dropoffLat, dropoffLng } = useSearch({
        from: "/traveler/cab/search",
    });

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-black">
                {t(translationKey.cabHome.searchResults)}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
                {pickupLat}, {pickupLng} → {dropoffLat}, {dropoffLng}
            </p>
        </div>
    );
};

export default CabSearch;
