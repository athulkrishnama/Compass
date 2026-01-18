import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Bed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import translationKey from "@/utils/i18n/translationKey";
import type { RoomVariantFormType } from "@/components/shared/validations/roomVariantSchema";
import { BED_TYPE_WITH_TRANSLATION } from "@/constants/roomConstants/bedTypeWithTranslation";
import { Controller } from "react-hook-form";

interface OccupancyBeddingSectionProps {
    form: RoomVariantFormType;
}

function OccupancyBeddingSection({ form }: OccupancyBeddingSectionProps) {
    const { t } = useTranslation();
    const {
        register,
        control,
        formState: { errors },
    } = form;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-2 mb-6">
                <Bed className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(translationKey.sections.occupancyBedding)}
                </h2>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">
                        {t(translationKey.form.maxOccupancy)}
                    </Label>
                    <Input
                        type="number"
                        {...register("maxOccupancy", {
                            valueAsNumber: true,
                        })}
                        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                    {errors.maxOccupancy && (
                        <p className="text-xs text-red-500">
                            {errors.maxOccupancy.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-500 uppercase tracking-wider">
                            {t(translationKey.form.bedType)}
                        </Label>
                        <Controller
                            name="bedType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BED_TYPE_WITH_TRANSLATION.map(
                                            (type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {t(type.labelKey)}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.bedType && (
                            <p className="text-xs text-red-500">
                                {errors.bedType.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-gray-500 uppercase tracking-wider">
                            {t(translationKey.form.bedCount)}
                        </Label>
                        <Input
                            type="number"
                            {...register("bedCount", { valueAsNumber: true })}
                            className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                        {errors.bedCount && (
                            <p className="text-xs text-red-500">
                                {errors.bedCount.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default OccupancyBeddingSection;
