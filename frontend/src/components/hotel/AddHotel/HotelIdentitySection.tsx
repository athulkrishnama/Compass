import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "./SectionCard";
import type { HotelFormType } from "@/components/shared/validations/hotelSchema";

interface HotelIdentitySectionProps {
    form: HotelFormType;
}

function HotelIdentitySection({ form }: HotelIdentitySectionProps) {
    const { t } = useTranslation();
    const {
        register,
        formState: { errors },
        watch,
    } = form;

    const description = watch("description") || "";

    return (
        <SectionCard
            icon={Building2}
            title={t(translationKey.sections.hotelIdentity)}
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label
                        htmlFor="name"
                        className="text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >
                        {t(translationKey.form.hotelName)}
                    </Label>
                    <Input
                        id="name"
                        placeholder="e.g. The Grand Monochrome Resort"
                        {...register("name")}
                        className="h-12 border-gray-200 focus:border-gray-400"
                    />
                    {errors.name && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500"
                        >
                            {errors.name.message}
                        </motion.p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="description"
                        className="text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >
                        {t(translationKey.form.description)}
                    </Label>
                    <textarea
                        id="description"
                        placeholder="Describe the unique features, ambiance, and history of the property."
                        {...register("description")}
                        className="w-full min-h-[120px] p-3 border border-gray-200 rounded-md text-sm 
                            focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                            resize-none"
                    />
                    <div className="flex justify-between items-center">
                        {errors.description && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500"
                            >
                                {errors.description.message}
                            </motion.p>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">
                            {description.length}/5000
                        </span>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export default HotelIdentitySection;
