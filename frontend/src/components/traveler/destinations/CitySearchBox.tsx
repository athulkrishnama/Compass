import { useTranslation } from "react-i18next";
import { SearchBox } from "@mapbox/search-js-react";
import { Label } from "@/components/ui/label";
import { env } from "@/config/env";
import translationKey from "@/utils/i18n/translationKey";

interface CitySearchBoxProps {
    onCitySelect: (coords: [number, number], name: string) => void;
}

function CitySearchBox({ onCitySelect }: CitySearchBoxProps) {
    const { t } = useTranslation();

    const handleMapboxRetrieve = (res: {
        features?: Array<{
            geometry?: { coordinates?: [number, number] };
            properties?: { name?: string };
        }>;
    }) => {
        const feature = res.features?.[0];
        if (feature) {
            const coords = feature.geometry?.coordinates;
            if (coords) {
                onCitySelect(
                    [coords[0], coords[1]],
                    feature.properties?.name || ""
                );
            }
        }
    };

    return (
        <div>
            <Label className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                {t(translationKey.text.cityHubSearch)}
            </Label>
            <div className="[&_input]:h-10">
                <SearchBox
                    accessToken={env.VITE_MAPBOX_ACCESS_TOKEN}
                    options={{ types: "place" }}
                    placeholder={t(translationKey.text.enterCityName)}
                    onRetrieve={(res) => {
                        handleMapboxRetrieve({
                            features: res.features?.map((f) => ({
                                geometry: {
                                    coordinates: f.geometry?.coordinates as [
                                        number,
                                        number,
                                    ],
                                },
                                properties: {
                                    name: f.properties?.name,
                                },
                            })),
                        });
                    }}
                />
            </div>
        </div>
    );
}

export default CitySearchBox;
