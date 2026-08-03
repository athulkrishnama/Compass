import { motion } from "framer-motion";
import { EMOJI_LABELS_KEYS } from "./reviewAspects";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface EmojiRatingPickerProps {
    value?: number; // 1-5
    onChange: (value: number) => void;
}

const EMOJI_COLORS = [
    { bg: "#FF4136", face: "#FF4136", shadow: "#cc0000" }, // 1 - Very Dissatisfied - red
    { bg: "#FF851B", face: "#FF851B", shadow: "#cc6600" }, // 2 - Dissatisfied - orange
    { bg: "#FFDC00", face: "#FFDC00", shadow: "#ccaa00" }, // 3 - Neutral - yellow
    { bg: "#2ECC40", face: "#2ECC40", shadow: "#1a8a27" }, // 4 - Happy - green
    { bg: "#00BCD4", face: "#00BCD4", shadow: "#007d8f" }, // 5 - Extremely Happy - teal
];

interface EmojiFaceProps {
    index: number; // 0-4
    isSelected: boolean;
    isHovered: boolean;
}

function EmojiFace({ index, isSelected, isHovered }: EmojiFaceProps) {
    const color = EMOJI_COLORS[index];
    const active = isSelected || isHovered;
    const faceColor = active ? color.face : "#d1d5db";
    const shadowColor = active ? color.shadow : "#9ca3af";

    // Eye shapes and mouth paths per mood level
    const mouths = [
        // 1 - Very Dissatisfied: strong frown
        <path
            key="m"
            d="M 26 42 Q 32 34 38 42"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
        />,
        // 2 - Dissatisfied: slight frown
        <path
            key="m"
            d="M 27 40 Q 32 36 37 40"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
        />,
        // 3 - Neutral: flat mouth
        <line
            key="m"
            x1="26"
            y1="39"
            x2="38"
            y2="39"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
        />,
        // 4 - Happy: slight smile
        <path
            key="m"
            d="M 27 37 Q 32 43 37 37"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
        />,
        // 5 - Extremely Happy: big smile
        <path
            key="m"
            d="M 25 36 Q 32 46 39 36"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
        />,
    ];

    // Eye expressions per mood
    const eyes = [
        // 1 - angry eyes: slanted inward
        <>
            <line
                key="el"
                x1="21"
                y1="26"
                x2="26"
                y2="24"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <line
                key="er"
                x1="38"
                y1="24"
                x2="43"
                y2="26"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </>,
        // 2 - sad eyes: slight slant
        <>
            <ellipse key="el" cx="23" cy="27" rx="2.5" ry="2.5" fill="white" />
            <ellipse key="er" cx="41" cy="27" rx="2.5" ry="2.5" fill="white" />
        </>,
        // 3 - neutral eyes: flat
        <>
            <ellipse key="el" cx="23" cy="27" rx="2.5" ry="2.5" fill="white" />
            <ellipse key="er" cx="41" cy="27" rx="2.5" ry="2.5" fill="white" />
        </>,
        // 4 - happy eyes: slightly squinting
        <>
            <path
                key="el"
                d="M 20 27 Q 23 24 26 27"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
            />
            <path
                key="er"
                d="M 38 27 Q 41 24 44 27"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
            />
        </>,
        // 5 - very happy eyes: squinting with cheeks
        <>
            <path
                key="el"
                d="M 19 27 Q 23 23 27 27"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
            />
            <path
                key="er"
                d="M 37 27 Q 41 23 45 27"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
            />
            <ellipse
                key="cl"
                cx="21"
                cy="33"
                rx="4"
                ry="2.5"
                fill="white"
                opacity="0.3"
            />
            <ellipse
                key="cr"
                cx="43"
                cy="33"
                rx="4"
                ry="2.5"
                fill="white"
                opacity="0.3"
            />
        </>,
    ];

    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Drop shadow */}
            <ellipse
                cx="32"
                cy="58"
                rx="14"
                ry="4"
                fill={shadowColor}
                opacity={active ? 0.4 : 0.15}
            />
            {/* Face circle */}
            <circle cx="32" cy="32" r="28" fill={faceColor} />
            {/* Shine */}
            <ellipse
                cx="24"
                cy="20"
                rx="7"
                ry="4"
                fill="white"
                opacity="0.25"
                transform="rotate(-30 24 20)"
            />
            {/* Eyes */}
            {eyes[index]}
            {/* Mouth */}
            {mouths[index]}
        </svg>
    );
}

export function EmojiRatingPicker({ value, onChange }: EmojiRatingPickerProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="flex items-end justify-center gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5].map((score) => {
                    const index = score - 1;
                    const isSelected = value === score;
                    return (
                        <motion.button
                            key={score}
                            type="button"
                            onClick={() => onChange(score)}
                            className="flex flex-col items-center gap-1 focus:outline-none"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            animate={
                                isSelected
                                    ? { scale: 1.2, y: -6 }
                                    : { scale: 1, y: 0 }
                            }
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                            }}
                        >
                            <motion.div
                                className="w-12 h-12 sm:w-14 sm:h-14 cursor-pointer"
                                animate={
                                    isSelected
                                        ? { rotate: [0, -10, 10, 0] }
                                        : {}
                                }
                                transition={{ duration: 0.4, repeat: 0 }}
                            >
                                <EmojiFace
                                    index={index}
                                    isSelected={isSelected}
                                    isHovered={false}
                                />
                            </motion.div>
                            {isSelected && (
                                <motion.span
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] font-semibold text-black text-center leading-tight max-w-[52px]"
                                >
                                    {t(EMOJI_LABELS_KEYS[index])}
                                </motion.span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
            <div className="flex justify-between mt-3 px-1">
                <span className="text-[10px] text-gray-400 font-medium">
                    {t(translationKey.hotelReviewModal.veryDissatisfied)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                    {t(translationKey.hotelReviewModal.extremelyHappy)}
                </span>
            </div>
        </div>
    );
}
