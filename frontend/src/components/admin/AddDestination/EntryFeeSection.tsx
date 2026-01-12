import { useTranslation } from "react-i18next";
import { Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import SectionCard from "./SectionCard";
import { CURRENCY } from "@/constants/destinationConstants/currency";
import { currencyIcons } from "@/constants/destinationConstants/currencyIcons";
import type { DestinationFormType } from "@/components/shared/validations/destinationSchema";

interface EntryFeeSectionProps {
    form: DestinationFormType;
}

function EntryFeeSection({ form }: EntryFeeSectionProps) {
    const { t } = useTranslation();
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;

    const isFree = watch("isFree");
    const currency = watch("entryFeeCurrency");

    return (
        <SectionCard icon={Ticket} title={t(translationKey.sections.entryFee)}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            {t(translationKey.form.isFree)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {t(translationKey.form.isFreeHint)}
                        </p>
                    </div>
                    <motion.button
                        type="button"
                        onClick={() => setValue("isFree", !isFree)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            isFree ? "bg-gray-900" : "bg-gray-300"
                        }`}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{
                                left: isFree ? "calc(100% - 20px)" : "4px",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                            }}
                        />
                    </motion.button>
                </div>

                <AnimatePresence>
                    {!isFree && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="entryFeeAmount">
                                        {t(translationKey.form.entryFeeAmount)}
                                    </Label>
                                    <Input
                                        id="entryFeeAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register("entryFeeAmount", {
                                            valueAsNumber: true,
                                        })}
                                        className="h-10"
                                    />
                                    {errors.entryFeeAmount && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-red-500"
                                        >
                                            {errors.entryFeeAmount.message}
                                        </motion.p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        {t(translationKey.form.currency)}
                                    </Label>
                                    <Select
                                        value={currency}
                                        onValueChange={(value) =>
                                            setValue(
                                                "entryFeeCurrency",
                                                value as CURRENCY,
                                                {
                                                    shouldValidate: true,
                                                }
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="USD – US Dollar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(CURRENCY).map(
                                                (curr) => {
                                                    const Icon =
                                                        currencyIcons[curr];
                                                    return (
                                                        <SelectItem
                                                            key={curr}
                                                            value={curr}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4" />
                                                                <span>
                                                                    {curr}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </SectionCard>
    );
}

export default EntryFeeSection;
