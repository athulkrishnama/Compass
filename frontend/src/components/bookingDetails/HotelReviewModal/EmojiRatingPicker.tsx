import { motion } from "framer-motion";
import { EMOJI_LABELS_KEYS } from "./reviewAspects";
import { useTranslation } from "react-i18next";
import { Angry, Frown, Meh, Smile, Laugh } from "lucide-react";

interface EmojiRatingPickerProps {
    value?: number; // 1-5
    onChange: (value: number) => void;
}

const MOODS = [
    { icon: Angry, color: "#EF4444", bg: "#FEE2E2", label: 1 },
    { icon: Frown, color: "#F97316", bg: "#FFEDD5", label: 2 },
    { icon: Meh, color: "#EAB308", bg: "#FEF9C3", label: 3 },
    { icon: Smile, color: "#22C55E", bg: "#DCFCE7", label: 4 },
    { icon: Laugh, color: "#06B6D4", bg: "#CFFAFE", label: 5 },
];

export function EmojiRatingPicker({ value, onChange }: EmojiRatingPickerProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="flex items-end justify-center gap-3 sm:gap-5">
                {MOODS.map((mood, index) => {
                    const score = index + 1;
                    const isSelected = value === score;
                    const Icon = mood.icon;

                    return (
                        <motion.button
                            key={score}
                            type="button"
                            onClick={() => onChange(score)}
                            className="flex flex-col items-center gap-1.5 focus:outline-none"
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            animate={isSelected ? { y: -6 } : { y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                            }}
                        >
                            {/* Icon circle */}
                            <motion.div
                                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-colors duration-150"
                                style={{
                                    backgroundColor: mood.bg,
                                    borderColor: isSelected
                                        ? mood.color
                                        : "transparent",
                                    boxShadow: isSelected
                                        ? `0 0 0 3px ${mood.color}33`
                                        : "none",
                                }}
                                animate={
                                    isSelected
                                        ? { rotate: [0, -8, 8, 0] }
                                        : { rotate: 0 }
                                }
                                transition={{ duration: 0.35 }}
                            >
                                <Icon
                                    className="w-7 h-7 sm:w-8 sm:h-8"
                                    style={{
                                        color: mood.color,
                                        strokeWidth: isSelected ? 2.2 : 1.8,
                                    }}
                                />
                            </motion.div>

                            {/* Label — always show, bold when selected */}
                            <span
                                className="text-[10px] leading-tight text-center max-w-[52px] font-medium transition-all duration-150"
                                style={{
                                    color: isSelected ? mood.color : "#9ca3af",
                                    fontWeight: isSelected ? 700 : 500,
                                }}
                            >
                                {t(EMOJI_LABELS_KEYS[index])}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
