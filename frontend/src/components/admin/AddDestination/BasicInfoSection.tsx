import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "./SectionCard";
import type { DestinationFormType } from "@/components/shared/validations/destinationSchema";

interface BasicInfoSectionProps {
    form: DestinationFormType;
}

function BasicInfoSection({ form }: BasicInfoSectionProps) {
    const { t } = useTranslation();
    const {
        register,
        formState: { errors },
        watch,
    } = form;

    const description = watch("description") || "";

    return (
        <SectionCard
            icon={FileText}
            title={t(translationKey.sections.basicInformation)}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            {t(translationKey.form.destinationName)}
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g. Eiffel Tower"
                            {...register("name")}
                            className="h-10"
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
                        <Label htmlFor="tagline">
                            {t(translationKey.form.tagline)}
                        </Label>
                        <Input
                            id="tagline"
                            placeholder="e.g. The Iconic Iron Lady"
                            {...register("tagline")}
                            className="h-10"
                        />
                        {errors.tagline && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500"
                            >
                                {errors.tagline.message}
                            </motion.p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">
                        {t(translationKey.form.description)}
                    </Label>
                    <textarea
                        id="description"
                        placeholder="Describe the destination in detail..."
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

export default BasicInfoSection;
