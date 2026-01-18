import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import type { RoomVariantFormType } from "@/components/shared/validations/roomVariantSchema";

interface PricingStatusSectionProps {
    form: RoomVariantFormType;
}

function PricingStatusSection({ form }: PricingStatusSectionProps) {
    const { t } = useTranslation();
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-2 mb-6">
                <IndianRupee className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(translationKey.sections.pricingStatus)}
                </h2>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">
                        {t(translationKey.form.basePrice)}
                    </Label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            ₹
                        </span>
                        <Input
                            type="number"
                            step="0.01"
                            {...register("basePrice", { valueAsNumber: true })}
                            className="h-12 pl-8 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            placeholder="0.00"
                        />
                    </div>
                    {errors.basePrice && (
                        <p className="text-xs text-red-500">
                            {errors.basePrice.message}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default PricingStatusSection;
