import React from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { LocateFixed } from "lucide-react";
import { env } from "@/config/env";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface LocationResult {
    lat: number;
    lng: number;
    name: string;
}

interface LocationSearchInputProps {
    placeholder: string;
    value: string;
    onRetrieve: (result: LocationResult) => void;
    onCurrentLocation: () => void;
    onChange?: (value: string) => void;
    id?: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
    placeholder,
    value,
    onRetrieve,
    onCurrentLocation,
    id,
}) => {
    const { t } = useTranslation();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRetrieve = (res: any) => {
        const feature = res?.features?.[0];
        if (!feature) return;
        const [lng, lat] = feature.geometry.coordinates;
        onRetrieve({
            lat,
            lng,
            name:
                feature.properties?.name ??
                feature.properties?.full_address ??
                "",
        });
    };

    return (
        <div className="relative flex items-center gap-2 w-full group" id={id}>
            <div className="flex-1 relative">
                <SearchBox
                    accessToken={env.VITE_MAPBOX_ACCESS_TOKEN}
                    placeholder={placeholder}
                    value={value}
                    options={{ country: "in" }}
                    onRetrieve={handleRetrieve}
                    theme={{
                        variables: {
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "none",
                            colorBackground: "#f9f9f9",
                            colorBackgroundHover: "#f4f4f4",
                            colorText: "#111111",
                            fontFamily: "inherit",
                        },
                    }}
                />
            </div>
            <button
                type="button"
                title={t(translationKey.cabHome.useCurrentLocation)}
                onClick={onCurrentLocation}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
                <LocateFixed className="w-4 h-4" />
            </button>
        </div>
    );
};

export default LocationSearchInput;
