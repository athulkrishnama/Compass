import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import translationKey from "@/utils/i18n/translationKey";
import type { RoomVariantFormType } from "@/components/shared/validations/roomVariantSchema";

interface BasicRoomVariantInfoSectionProps {
    form: RoomVariantFormType;
}

function BasicRoomVariantInfoSection({
    form,
}: BasicRoomVariantInfoSectionProps) {
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
                <Info className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(translationKey.sections.basicRoomInfo)}
                </h2>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">
                        {t(translationKey.form.roomName)}
                    </Label>
                    <Input
                        {...register("name")}
                        placeholder={t(translationKey.form.roomNamePlaceholder)}
                        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">
                        {t(translationKey.form.description)}
                    </Label>
                    <Textarea
                        {...register("description")}
                        placeholder={t(
                            translationKey.form.roomDescriptionPlaceholder
                        )}
                        className="min-h-[100px] rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none"
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">
                            {errors.description.message}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default BasicRoomVariantInfoSection;
