import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";

const SearchingDriver = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center py-10 gap-6">
            {/* Animated pulsing ring */}
            <div className="relative flex items-center justify-center">
                <motion.div
                    className="absolute w-24 h-24 rounded-full border-2 border-black/10"
                    animate={{ scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
                <motion.div
                    className="absolute w-24 h-24 rounded-full border-2 border-black/10"
                    animate={{ scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.6,
                    }}
                />
                <motion.div
                    className="absolute w-24 h-24 rounded-full border-2 border-black/10"
                    animate={{ scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 1.2,
                    }}
                />

                <motion.div
                    className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Search className="w-6 h-6 text-white" />
                </motion.div>
            </div>

            {/* Text */}
            <div className="text-center space-y-1.5">
                <h3 className="text-lg font-semibold text-black tracking-tight">
                    {t(translationKey.rideDetails.findingYourDriver)}
                </h3>
                <p className="text-sm text-neutral-500">
                    {t(translationKey.rideDetails.holdTightMatching)}
                </p>
            </div>

            {/* Subtle loading dots */}
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-black/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchingDriver;
