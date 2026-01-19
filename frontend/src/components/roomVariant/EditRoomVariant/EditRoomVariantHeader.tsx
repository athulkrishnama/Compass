import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";

interface EditRoomVariantHeaderProps {
    roomVariantName: string;
    hotelName: string;
    isSubmitting: boolean;
    onCancel: () => void;
    formId: string;
}

function EditRoomVariantHeader({
    roomVariantName,
    hotelName,
    isSubmitting,
    onCancel,
    formId,
}: EditRoomVariantHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="sticky top-6 z-50 px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-6xl rounded-2xl border border-gray-200/50 bg-white/50 backdrop-blur-xl shadow-lg"
            >
                <div className="px-5 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col">
                                <h1 className="font-bold text-gray-900 text-sm sm:text-base">
                                    {t(translationKey.headings.editRoomVariant)}
                                    : {roomVariantName}
                                </h1>
                                <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                    {hotelName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onCancel}
                                size="sm"
                                className="h-9 text-xs px-4"
                            >
                                {t(translationKey.button.cancel)}
                            </Button>
                            <Button
                                type="submit"
                                form={formId}
                                disabled={isSubmitting}
                                size="sm"
                                className="bg-gray-900 text-white hover:bg-gray-800 h-9 px-5 rounded-xl text-xs shadow-md transition-all active:scale-95"
                            >
                                <RefreshCw
                                    className={`w-3.5 h-3.5 mr-1.5 ${isSubmitting ? "animate-spin" : ""}`}
                                />
                                {isSubmitting
                                    ? t(translationKey.button.updating)
                                    : t(
                                          translationKey.button
                                              .updateRoomVariant
                                      )}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default EditRoomVariantHeader;
