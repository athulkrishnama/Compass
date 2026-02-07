import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import translationKey from "@/utils/i18n/translationKey";
import type { RoomVariantFormType } from "@/components/shared/validations/roomVariantSchema";
import { RoomAmenities } from "@/components/shared/validations/roomVariantSchema";
import { Controller } from "react-hook-form";
import { ROOM_AMENITY_WITH_ICON_AND_TRANSLATION } from "@/constants/roomConstants/roomAmenityWithIconAndTranslation";

interface AmenitiesPoliciesSectionProps {
    form: RoomVariantFormType;
}

function AmenitiesPoliciesSection({ form }: AmenitiesPoliciesSectionProps) {
    const { t } = useTranslation();
    const { register, control, watch, setValue } = form;

    const selectedAmenities = watch("amenities") || [];

    const toggleAmenity = (amenity: (typeof RoomAmenities)[number]) => {
        const current = selectedAmenities;
        if (current.includes(amenity)) {
            setValue(
                "amenities",
                current.filter((a) => a !== amenity)
            );
        } else {
            setValue("amenities", [...current, amenity]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(translationKey.sections.amenitiesPolicies)}
                </h2>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">
                        {t(translationKey.form.roomAmenities)}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {ROOM_AMENITY_WITH_ICON_AND_TRANSLATION.map(
                            (amenity) => {
                                const IconComponent = amenity.icon;
                                const amenityValue =
                                    amenity.value as (typeof RoomAmenities)[number];
                                return (
                                    <button
                                        key={amenity.value}
                                        type="button"
                                        onClick={() =>
                                            toggleAmenity(amenityValue)
                                        }
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                            selectedAmenities.includes(
                                                amenityValue
                                            )
                                                ? "bg-gray-900 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        <IconComponent className="w-3 h-3" />
                                        {t(amenity.labelKey)}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-700">
                            {t(translationKey.form.smokingAllowed)}
                        </Label>
                        <Controller
                            name="smokingAllowed"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-700">
                            {t(translationKey.form.petsAllowed)}
                        </Label>
                        <Controller
                            name="petsAllowed"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                            {t(translationKey.form.checkInOut)}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-400">
                                {t(translationKey.form.checkIn)}
                            </Label>
                            <Input
                                type="time"
                                {...register("checkInTime")}
                                className="h-10 rounded-lg bg-gray-50 border-gray-200 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-400">
                                {t(translationKey.form.checkOut)}
                            </Label>
                            <Input
                                type="time"
                                {...register("checkOutTime")}
                                className="h-10 rounded-lg bg-gray-50 border-gray-200 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default AmenitiesPoliciesSection;
