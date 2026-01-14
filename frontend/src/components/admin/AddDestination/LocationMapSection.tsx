import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SearchBox } from "@mapbox/search-js-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/config/env";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "./SectionCard";
import type { DestinationFormType } from "@/components/shared/validations/destinationSchema";

interface LocationMapSectionProps {
    form: DestinationFormType;
}

function LocationMapSection({ form }: LocationMapSectionProps) {
    const { t } = useTranslation();
    const {
        setValue,
        watch,
        formState: { errors },
    } = form;

    const latitude = watch("latitude");
    const longitude = watch("longitude");
    const country = watch("country");

    const handleRetrieve = (res: {
        features?: Array<{
            geometry?: { coordinates?: [number, number] };
            properties?: {
                name?: string;
                context?: {
                    country?: { name?: string };
                    city?: { name?: string };
                    postcode?: { name?: string };
                };
            };
        }>;
    }) => {
        const feature = res.features?.[0];
        if (feature) {
            const coords = feature.geometry?.coordinates;
            if (coords) {
                setValue("longitude", coords[0], { shouldValidate: true });
                setValue("latitude", coords[1], { shouldValidate: true });
            }

            const context = feature.properties?.context;
            if (context) {
                if (context.country?.name) {
                    setValue("country", context.country.name, {
                        shouldValidate: true,
                    });
                }
                if (context.city?.name) {
                    setValue("city", context.city.name, {
                        shouldValidate: true,
                    });
                }
                if (context.postcode?.name) {
                    setValue("pincode", context.postcode.name, {
                        shouldValidate: true,
                    });
                }
            }
        }
    };

    return (
        <SectionCard
            icon={MapPin}
            title={t(translationKey.sections.locationAndMap)}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t(translationKey.form.searchLocation)}</Label>
                        <div className="w-full">
                            <SearchBox
                                accessToken={env.VITE_MAPBOX_ACCESS_TOKEN}
                                options={{ types: "poi" }}
                                onRetrieve={(res) => {
                                    handleRetrieve({
                                        features: res.features?.map((f) => ({
                                            geometry: {
                                                coordinates: f.geometry
                                                    ?.coordinates as [
                                                    number,
                                                    number,
                                                ],
                                            },
                                            properties: {
                                                name: f.properties?.name,
                                                context: {
                                                    country: {
                                                        name: f.properties
                                                            ?.context?.country
                                                            ?.name,
                                                    },
                                                    city: {
                                                        name:
                                                            f.properties
                                                                ?.context?.place
                                                                ?.name ||
                                                            f.properties
                                                                ?.context
                                                                ?.locality
                                                                ?.name,
                                                    },
                                                    postcode: {
                                                        name: f.properties
                                                            ?.context?.postcode
                                                            ?.name,
                                                    },
                                                },
                                            },
                                        })),
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">
                            {t(translationKey.form.country)}
                        </Label>
                        <Input
                            id="country"
                            {...form.register("country")}
                            className="h-10"
                            readOnly
                        />
                        {errors.country && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-500"
                            >
                                {errors.country.message}
                            </motion.p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">
                                {t(translationKey.form.city)}
                            </Label>
                            <Input
                                id="city"
                                {...form.register("city")}
                                className="h-10"
                                readOnly
                            />
                            {errors.city && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-red-500"
                                >
                                    {errors.city.message}
                                </motion.p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pincode">
                                {t(translationKey.form.pincode)}
                            </Label>
                            <Input
                                id="pincode"
                                {...form.register("pincode")}
                                className="h-10"
                                readOnly
                            />
                            {errors.pincode && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-red-500"
                                >
                                    {errors.pincode.message}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">
                                {t(translationKey.form.latitude)}
                            </Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                value={latitude || ""}
                                readOnly
                                className="h-10 bg-gray-50"
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude">
                                {t(translationKey.form.longitude)}
                            </Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                value={longitude || ""}
                                readOnly
                                className="h-10 bg-gray-50"
                                disabled
                            />
                        </div>
                    </div>
                    {(errors.latitude || errors.longitude) && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-500"
                        >
                            {errors.latitude?.message ||
                                errors.longitude?.message}
                        </motion.p>
                    )}
                </div>

                <div className="h-64 lg:h-auto min-h-[200px] bg-gray-100 rounded-lg overflow-hidden">
                    {latitude && longitude ? (
                        <img
                            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+000(${longitude},${latitude})/${longitude},${latitude},12,0/400x300@2x?access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}`}
                            alt="Map preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <MapPin className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">
                                    {country || "Search for location"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SectionCard>
    );
}

export default LocationMapSection;
